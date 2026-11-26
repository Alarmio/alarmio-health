"""Fails loudly if foXaCe renames anything the adapter reads.

Parses the pinned fixtures with ``ast`` so comments and substrings cannot satisfy a check.
"""

import ast
from pathlib import Path

from custom_components.alarmio_health.foxace_adapter import ARMED_STATES

FIX = Path(__file__).parent / "fixtures" / "foxace-0.39.0"


def _tree(source: str) -> ast.Module:
    return ast.parse(source)


def _fixture(name: str) -> ast.Module:
    return _tree((FIX / name).read_text(encoding="utf-8"))


def _classes(tree: ast.Module) -> dict[str, ast.ClassDef]:
    return {n.name: n for n in ast.walk(tree) if isinstance(n, ast.ClassDef)}


def enum_member_names(tree: ast.Module, class_name: str) -> set[str] | None:
    """Member names of an Enum class, or None if the class is missing or not an Enum."""
    cls = _classes(tree).get(class_name)
    if cls is None:
        return None
    if not any((isinstance(b, ast.Name) and b.id.endswith("Enum")) for b in cls.bases):
        return None
    names: set[str] = set()
    for stmt in cls.body:
        if isinstance(stmt, ast.Assign):
            names.update(t.id for t in stmt.targets if isinstance(t, ast.Name))
    return names


def annotated_fields(tree: ast.Module, class_name: str) -> set[str] | None:
    cls = _classes(tree).get(class_name)
    if cls is None:
        return None
    return {s.target.id for s in cls.body if isinstance(s, ast.AnnAssign) and isinstance(s.target, ast.Name)}


def has_property(tree: ast.Module, class_name: str, prop: str) -> bool:
    cls = _classes(tree).get(class_name)
    if cls is None:
        return False
    return any(
        isinstance(s, ast.FunctionDef)
        and s.name == prop
        and any(isinstance(d, ast.Name) and d.id == "property" for d in s.decorator_list)
        for s in cls.body
    )


def self_attrs_assigned(func: ast.AST) -> set[str]:
    """Names X for every ``self.X = ...`` / ``self.X: T = ...`` inside func."""
    found: set[str] = set()
    for n in ast.walk(func):
        targets: list[ast.expr] = []
        if isinstance(n, ast.Assign):
            targets = list(n.targets)
        elif isinstance(n, ast.AnnAssign):
            targets = [n.target]
        for t in targets:
            if isinstance(t, ast.Attribute) and isinstance(t.value, ast.Name) and t.value.id == "self":
                found.add(t.attr)
    return found


def missing_enum_members(tree: ast.Module, class_name: str, required: set[str]) -> set[str]:
    members = enum_member_names(tree, class_name)
    return set(required) if members is None else required - members


def test_security_state_has_every_state_the_adapter_uses() -> None:
    missing = missing_enum_members(_fixture("models.py"), "SecurityState", set(ARMED_STATES) | {"DISARMED"})
    assert not missing, f"SecurityState Enum is missing members: {sorted(missing)}"


def test_checker_reports_missing_enum_member() -> None:
    src = "from enum import Enum\nclass SecurityState(Enum):\n    DISARMED = 'd'\n    NIGHT_MODE = 'n'\n"
    assert missing_enum_members(_tree(src), "SecurityState", {"ARMED", "DISARMED"}) == {"ARMED"}
    assert missing_enum_members(_tree("class SecurityState: ARMED = 1"), "SecurityState", {"ARMED"}) == {"ARMED"}


def test_device_has_fields_the_adapter_reads() -> None:
    fields = annotated_fields(_fixture("models.py"), "AjaxDevice")
    assert fields is not None, "class AjaxDevice missing from models.py"
    missing = {"online", "malfunctions", "battery_level", "signal_strength", "name"} - fields
    assert not missing, f"AjaxDevice is missing annotated fields: {sorted(missing)}"


def test_space_has_fields_the_adapter_reads() -> None:
    fields = annotated_fields(_fixture("models.py"), "AjaxSpace")
    assert fields is not None, "class AjaxSpace missing from models.py"
    missing = {"security_state", "devices"} - fields
    assert not missing, f"AjaxSpace is missing annotated fields: {sorted(missing)}"


def test_sse_client_exposes_is_connected_property() -> None:
    assert has_property(_fixture("sse_client.py"), "AjaxSSEClient", "is_connected"), (
        "AjaxSSEClient.is_connected property missing"
    )


def test_api_exposes_proxy_and_session_fields() -> None:
    tree = _fixture("api__base.py")
    candidates = [
        c
        for c in _classes(tree).values()
        if any(isinstance(s, ast.FunctionDef) and s.name == "__init__" for s in c.body)
        and has_property(tree, c.name, "is_proxy_mode")
    ]
    assert candidates, "no api class defines an is_proxy_mode property and an __init__"
    init = next(s for s in candidates[0].body if isinstance(s, ast.FunctionDef) and s.name == "__init__")
    missing = {"session_token", "proxy_url"} - self_attrs_assigned(init)
    assert not missing, f"{candidates[0].name}.__init__ does not assign: {sorted(missing)}"


def test_coordinator_assigns_sse_manager() -> None:
    assert "sse_manager" in self_attrs_assigned(_fixture("_coordinator_init.py")), (
        "_coordinator_init.py never assigns self.sse_manager"
    )


def class_base_names(tree: ast.Module, class_name: str) -> set[str]:
    """Base-class names of a class, unwrapping ``Base[T]`` subscripts and ``mod.Base`` attributes."""
    cls = _classes(tree).get(class_name)
    if cls is None:
        return set()
    names: set[str] = set()
    for b in cls.bases:
        node = b.value if isinstance(b, ast.Subscript) else b
        if isinstance(node, ast.Name):
            names.add(node.id)
        elif isinstance(node, ast.Attribute):
            names.add(node.attr)
    return names


def class_self_attrs_assigned(tree: ast.Module, class_name: str) -> set[str]:
    """Names X for every ``self.X = ...`` anywhere in the class's methods (empty if class missing)."""
    cls = _classes(tree).get(class_name)
    return set() if cls is None else self_attrs_assigned(cls)


def test_coordinator_inherits_data_update_coordinator() -> None:
    """Gives last_update_success and async_add_listener, which the adapter relies on."""
    bases = class_base_names(_fixture("coordinator.py"), "AjaxDataCoordinator")
    assert "DataUpdateCoordinator" in bases, f"AjaxDataCoordinator bases are {sorted(bases)}"


def test_coordinator_assigns_api_and_account() -> None:
    attrs = class_self_attrs_assigned(_fixture("coordinator.py"), "AjaxDataCoordinator")
    missing = {"api", "account"} - attrs
    assert not missing, f"AjaxDataCoordinator never assigns self.{sorted(missing)}"


def test_account_class_has_spaces_field() -> None:
    fields = annotated_fields(_fixture("models.py"), "AjaxAccount")
    assert fields is not None, "class AjaxAccount missing from models.py"
    assert "spaces" in fields, f"AjaxAccount has no annotated 'spaces' field: {sorted(fields)}"


def test_sse_manager_assigns_sse_client() -> None:
    assert "sse_client" in class_self_attrs_assigned(_fixture("sse_manager.py"), "SSEManager"), (
        "SSEManager never assigns self.sse_client"
    )


def test_new_helpers_can_fail() -> None:
    src = "class C(Other[int]):\n    x: int\n    def f(self):\n        self.a = 1\n"
    tree = _tree(src)
    assert class_base_names(tree, "C") == {"Other"}
    assert "DataUpdateCoordinator" not in class_base_names(tree, "C")
    assert class_base_names(tree, "Missing") == set()
    assert class_self_attrs_assigned(tree, "C") == {"a"}
    assert "api" not in class_self_attrs_assigned(tree, "C")
    assert annotated_fields(tree, "C") == {"x"}
    assert "spaces" not in (annotated_fields(tree, "C") or set())
    assert annotated_fields(tree, "Missing") is None
