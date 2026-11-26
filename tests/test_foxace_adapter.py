import logging
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

from custom_components.alarmio_health.foxace_adapter import FoxaceAdapter
from custom_components.alarmio_health.models import Status
from custom_components.alarmio_health.probes.foxace import probe_ajax, probe_foxace

NOW = datetime(2026, 11, 26, 12, 0, tzinfo=UTC)


def _entry(coordinator):
    return SimpleNamespace(runtime_data=coordinator, state=SimpleNamespace(value="loaded"))


def _coordinator(sse_connected=True, armed_name="DISARMED"):
    device = SimpleNamespace(name="Door", online=True, malfunctions=0, battery_level=88, signal_strength=2)
    space = SimpleNamespace(security_state=SimpleNamespace(name=armed_name), devices={"d1": device})
    sse = (
        SimpleNamespace(sse_client=SimpleNamespace(is_connected=sse_connected)) if sse_connected is not None else None
    )
    coord = MagicMock()
    coord.api = SimpleNamespace(is_proxy_mode=True, proxy_url="https://a.test", session_token="secret")  # noqa: S106
    coord.sse_manager = sse
    coord.last_update_success = True
    coord.account = SimpleNamespace(spaces={"s1": space})
    return coord


def _hass(entries):
    hass = MagicMock()
    hass.config_entries.async_entries.return_value = entries
    return hass


async def _snapshot(adapter, version="0.39.0"):
    with patch("custom_components.alarmio_health.foxace_adapter.async_get_integration") as get_int:
        get_int.return_value = SimpleNamespace(version=version)
        return await adapter.snapshot(NOW)


async def test_not_installed_when_no_entry() -> None:
    snap = await _snapshot(FoxaceAdapter(_hass([])))
    assert snap.installed is False


async def test_reads_foxace_state() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator())]))
    snap = await _snapshot(adapter)
    assert snap.installed and snap.version_tested
    assert snap.proxy_url == "https://a.test"
    assert snap.sse_connected is True
    assert snap.armed is False
    assert snap.devices[0].battery_level == 88


async def test_armed_states_are_detected() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator(armed_name="ARMED"))]))
    assert (await _snapshot(adapter)).armed is True


async def test_no_sse_manager_means_sse_unknown() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator(sse_connected=None))]))
    assert (await _snapshot(adapter)).sse_connected is None


async def test_untested_version_is_flagged() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator())]))
    assert (await _snapshot(adapter, version="1.2.0")).version_tested is False


async def test_listener_records_update_age() -> None:
    coord = _coordinator()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    await _snapshot(adapter)
    listener = coord.async_add_listener.call_args.args[0]
    with patch(
        "custom_components.alarmio_health.foxace_adapter.dt_util.utcnow", return_value=NOW - timedelta(seconds=90)
    ):
        listener()
    assert (await _snapshot(adapter)).seconds_since_update == 90.0


async def test_session_token_is_never_in_the_snapshot() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator())]))
    assert "secret" not in repr(await _snapshot(adapter))
    assert adapter.session_token() == "secret"


async def test_second_snapshot_does_not_register_again() -> None:
    coord = _coordinator()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    await _snapshot(adapter)
    await _snapshot(adapter)
    assert coord.async_add_listener.call_count == 1


async def test_replaced_coordinator_unsubscribes_old_and_registers_new() -> None:
    old, new = _coordinator(), _coordinator()
    hass = _hass([_entry(old)])
    adapter = FoxaceAdapter(hass)
    await _snapshot(adapter)
    hass.config_entries.async_entries.return_value = [_entry(new)]
    await _snapshot(adapter)
    old.async_add_listener.return_value.assert_called_once_with()
    assert new.async_add_listener.call_count == 1


async def test_replaced_coordinator_resets_last_update() -> None:
    old, new = _coordinator(), _coordinator()
    hass = _hass([_entry(old)])
    adapter = FoxaceAdapter(hass)
    await _snapshot(adapter)
    old.async_add_listener.call_args.args[0]()
    hass.config_entries.async_entries.return_value = [_entry(new)]
    assert (await _snapshot(adapter)).seconds_since_update == 0.0  # counted from the new listener's attach time


async def _snapshot_at(adapter, when, version="0.39.0"):
    with patch("custom_components.alarmio_health.foxace_adapter.async_get_integration") as get_int:
        get_int.return_value = SimpleNamespace(version=version)
        return await adapter.snapshot(when)


async def test_fresh_attach_has_small_age() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator())]))
    snap = await _snapshot_at(adapter, NOW)
    assert snap.seconds_since_update == 0.0
    assert probe_foxace(snap, NOW).status is Status.HEALTHY


async def test_no_update_ever_seen_ages_from_listener_attach_and_is_degraded() -> None:
    adapter = FoxaceAdapter(_hass([_entry(_coordinator())]))
    await _snapshot_at(adapter, NOW)
    snap = await _snapshot_at(adapter, NOW + timedelta(minutes=10))
    assert snap.seconds_since_update == pytest.approx(600.0)
    assert probe_foxace(snap, NOW + timedelta(minutes=10)).status is Status.DEGRADED


async def test_update_seen_takes_precedence_over_attach_time() -> None:
    coord = _coordinator()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    await _snapshot_at(adapter, NOW)
    with patch(
        "custom_components.alarmio_health.foxace_adapter.dt_util.utcnow",
        return_value=NOW + timedelta(minutes=9),
    ):
        coord.async_add_listener.call_args.args[0]()
    snap = await _snapshot_at(adapter, NOW + timedelta(minutes=10))
    assert snap.seconds_since_update == pytest.approx(60.0)


async def test_coordinator_replacement_resets_listening_since() -> None:
    old, new = _coordinator(), _coordinator()
    hass = _hass([_entry(old)])
    adapter = FoxaceAdapter(hass)
    await _snapshot_at(adapter, NOW)
    hass.config_entries.async_entries.return_value = [_entry(new)]
    snap = await _snapshot_at(adapter, NOW + timedelta(minutes=10))
    assert snap.seconds_since_update == 0.0


async def test_outer_guard_warns_once_per_failure_kind_and_again_after_recovery(
    caplog: pytest.LogCaptureFixture,
) -> None:
    coord = _coordinator()
    good_account = coord.account
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    coord.account = SimpleNamespace(spaces=5)  # .values() raises AttributeError
    with caplog.at_level(logging.WARNING, logger="custom_components.alarmio_health.foxace_adapter"):
        for _ in range(3):
            await _snapshot(adapter)
        assert len([r for r in caplog.records if r.levelno == logging.WARNING]) == 1
        coord.account = good_account
        assert (await _snapshot(adapter)).devices  # recovered
        coord.account = SimpleNamespace(spaces=5)
        await _snapshot(adapter)
    warnings = [r.getMessage() for r in caplog.records if r.levelno == logging.WARNING]
    assert len(warnings) == 2
    assert all("AttributeError" in w for w in warnings)


async def test_unload_unsubscribes_and_is_idempotent() -> None:
    coord = _coordinator()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    await _snapshot(adapter)
    adapter.async_unload()
    adapter.async_unload()
    coord.async_add_listener.return_value.assert_called_once_with()


async def test_sse_client_none_means_sse_unknown() -> None:
    coord = _coordinator()
    coord.sse_manager = SimpleNamespace(sse_client=None)
    assert (await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))).sse_connected is None


async def test_missing_account_means_no_devices_and_armed_unknown() -> None:
    coord = _coordinator()
    coord.account = None
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.devices == () and snap.armed is None


async def test_space_without_security_state_is_ignored() -> None:
    coord = _coordinator(armed_name="ARMED")
    coord.account.spaces["s2"] = SimpleNamespace(security_state=None, devices={})
    assert (await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))).armed is True
    coord.account.spaces.pop("s1")
    assert (await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))).armed is None


async def test_api_without_proxy_url_does_not_raise() -> None:
    coord = _coordinator()
    coord.api = SimpleNamespace()
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.installed and snap.proxy_url is None and snap.proxy_mode is False


async def test_device_missing_attribute_is_skipped() -> None:
    coord = _coordinator()
    coord.account.spaces["s1"].devices["bad"] = SimpleNamespace(name="Broken")
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert [d.name for d in snap.devices] == ["Door"]


async def test_last_resort_guard_returns_minimal_snapshot() -> None:
    coord = _coordinator()
    coord.account = SimpleNamespace(spaces=5)  # .values() raises AttributeError
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.installed and snap.update_ok is True and snap.devices == ()


async def test_listener_registration_failure_does_not_raise() -> None:
    coord = _coordinator()
    coord.async_add_listener.side_effect = RuntimeError("boom")
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.installed is True
    assert snap.update_ok is True and snap.version == "0.39.0"


async def test_raising_api_property_does_not_raise_and_log_is_safe(caplog: pytest.LogCaptureFixture) -> None:
    class _Api:
        session_token = "secret"  # noqa: S105

        @property
        def is_proxy_mode(self) -> bool:
            raise KeyError("secret")

    coord = _coordinator()
    coord.api = _Api()
    with caplog.at_level(logging.WARNING):
        snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.installed is True and snap.update_ok is True
    assert "KeyError" in caplog.text
    assert "secret" not in caplog.text


class _RaisingApi:
    @property
    def is_proxy_mode(self) -> bool:
        raise RuntimeError("api")


async def test_fallback_survives_raising_update_success_property(caplog: pytest.LogCaptureFixture) -> None:
    class _Coord:
        api = _RaisingApi()
        sse_manager = None
        account = None

        @property
        def last_update_success(self) -> bool:
            raise KeyError("secret")

        def async_add_listener(self, cb: object) -> object:
            return lambda: None

    with caplog.at_level(logging.DEBUG):
        snap = await _snapshot(FoxaceAdapter(_hass([_entry(_Coord())])))
    assert snap.installed is True and snap.update_ok is False
    assert "secret" not in caplog.text


async def test_fallback_survives_raising_bool() -> None:
    class _BadBool:
        def __bool__(self) -> bool:
            raise RuntimeError("nope")

    coord = _coordinator()
    coord.api = _RaisingApi()
    coord.last_update_success = _BadBool()
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.installed is True and snap.update_ok is False


async def test_version_with_raising_str_does_not_raise() -> None:
    class _BadVersion:
        def __str__(self) -> str:
            raise RuntimeError("nope")

    snap = await _snapshot(FoxaceAdapter(_hass([_entry(_coordinator())])), version=_BadVersion())
    assert snap.installed is True and snap.version is None and snap.version_tested is False


async def test_async_entries_raising_returns_not_installed() -> None:
    hass = MagicMock()
    hass.config_entries.async_entries.side_effect = RuntimeError("boom")
    adapter = FoxaceAdapter(hass)
    snap = await _snapshot(adapter)
    assert snap.installed is False
    assert adapter.session_token() is None


def _raise() -> None:
    raise KeyError("secret")


class _Dev:
    def __init__(self, fault: str) -> None:
        self._fault = fault
        self._ok = {"name": "Door", "online": True, "malfunctions": 0, "battery_level": 88, "signal_strength": 2}

    def __getattr__(self, attr: str) -> object:
        if attr in self._ok:
            if self._fault == f"device.{attr}":
                _raise()
            return self._ok[attr]
        raise AttributeError(attr)


class _Space:
    def __init__(self, fault: str) -> None:
        self._fault = fault

    @property
    def security_state(self) -> object:
        if self._fault == "space.security_state":
            _raise()
        return SimpleNamespace(name="ARMED")

    @property
    def devices(self) -> object:
        if self._fault == "space.devices":
            _raise()
        return {"d1": _Dev(self._fault)}


class _FaultApi:
    def __init__(self, fault: str) -> None:
        self._fault = fault

    @property
    def session_token(self) -> str:
        if self._fault == "api.session_token":
            _raise()
        return "secret"

    @property
    def proxy_url(self) -> str:
        if self._fault == "api.proxy_url":
            _raise()
        return "https://a.test"

    @property
    def is_proxy_mode(self) -> bool:
        if self._fault == "api.is_proxy_mode":
            _raise()
        return True


class _FaultSse:
    def __init__(self, fault: str) -> None:
        self._fault = fault

    @property
    def is_connected(self) -> bool:
        if self._fault == "sse_client.is_connected":
            _raise()
        return True


class _FaultSseManager:
    def __init__(self, fault: str) -> None:
        self._fault = fault

    @property
    def sse_client(self) -> object:
        if self._fault == "sse_manager.sse_client":
            _raise()
        return _FaultSse(self._fault)


class _FaultAccount:
    def __init__(self, fault: str) -> None:
        self._fault = fault

    @property
    def spaces(self) -> object:
        if self._fault == "account.spaces":
            _raise()
        return {"s1": _Space(self._fault)}


class _FaultCoordinator:
    def __init__(self, fault: str) -> None:
        self._fault = fault

    @property
    def api(self) -> object:
        if self._fault == "api":
            _raise()
        return _FaultApi(self._fault)

    @property
    def sse_manager(self) -> object:
        if self._fault == "sse_manager":
            _raise()
        return _FaultSseManager(self._fault)

    @property
    def account(self) -> object:
        if self._fault == "account":
            _raise()
        return _FaultAccount(self._fault)

    @property
    def last_update_success(self) -> bool:
        if self._fault == "last_update_success":
            _raise()
        return True

    def async_add_listener(self, cb: object) -> object:
        if self._fault == "async_add_listener":
            _raise()
        return _raise if self._fault == "unsubscribe" else (lambda: None)


_NO_DEVICES = {"devices": (), "armed": None}
_FAULTS: dict[str, dict[str, object]] = {
    "api": {"proxy_url": None},
    "api.session_token": {"proxy_url": "https://a.test", "armed": True},
    "api.proxy_url": {"proxy_url": None},
    "api.is_proxy_mode": {"proxy_url": "https://a.test", "proxy_mode": False},
    "sse_manager": {"sse_connected": None},
    "sse_manager.sse_client": {"sse_connected": None},
    "sse_client.is_connected": {"sse_connected": None},
    "account": _NO_DEVICES,
    "account.spaces": _NO_DEVICES,
    "space.security_state": _NO_DEVICES,
    "space.devices": _NO_DEVICES,
    "device.name": _NO_DEVICES,
    "device.online": _NO_DEVICES,
    "device.malfunctions": _NO_DEVICES,
    "device.battery_level": _NO_DEVICES,
    "device.signal_strength": _NO_DEVICES,
    "last_update_success": {"update_ok": False},
    "async_add_listener": _NO_DEVICES,
    "unsubscribe": {"armed": True},
}


@pytest.mark.parametrize("fault", list(_FAULTS))
async def test_every_foxace_access_may_raise_without_escaping(fault: str, caplog: pytest.LogCaptureFixture) -> None:
    hass = _hass([_entry(_FaultCoordinator(fault))])
    adapter = FoxaceAdapter(hass)
    with caplog.at_level(logging.DEBUG):
        snap = await _snapshot(adapter)
        assert snap.installed is True
        for field, expected in _FAULTS[fault].items():
            assert getattr(snap, field) == expected, field
        adapter.session_token()
        # Replace the coordinator so the old (possibly raising) unsubscribe runs.
        hass.config_entries.async_entries.return_value = [_entry(_FaultCoordinator(fault))]
        assert (await _snapshot(adapter)).installed is True
        adapter.async_unload()
        adapter.async_unload()
    assert adapter._unsub is None and adapter._listening_to is None
    assert "secret" not in caplog.text


async def test_one_raising_device_yields_no_devices_and_unknown_ajax() -> None:
    coord = _coordinator()
    devices = coord.account.spaces["s1"].devices
    devices["bad"] = _Dev("device.online")
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert snap.devices == ()
    assert probe_ajax(snap, NOW).status is Status.UNKNOWN


async def test_missing_attribute_skips_only_that_device() -> None:
    coord = _coordinator()
    coord.account.spaces["s1"].devices["bad"] = SimpleNamespace(name="Broken", malfunctions=0)
    snap = await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))
    assert [d.name for d in snap.devices] == ["Door"]


class _FlakyCoord:
    """Coordinator whose `api` read fails while `broken` is True."""

    def __init__(self) -> None:
        self.broken = True
        self.last_update_success = True
        self.sse_manager = None
        self.account = None

    @property
    def api(self) -> object:
        if self.broken:
            raise KeyError("secret")
        return SimpleNamespace(is_proxy_mode=True, proxy_url="u")

    def async_add_listener(self, cb: object) -> object:
        return lambda: None


def _warnings(caplog: pytest.LogCaptureFixture) -> list[logging.LogRecord]:
    return [r for r in caplog.records if r.levelno == logging.WARNING and "api" in r.getMessage()]


async def test_failing_attribute_is_warned_once(caplog: pytest.LogCaptureFixture) -> None:
    adapter = FoxaceAdapter(_hass([_entry(_FlakyCoord())]))
    with caplog.at_level(logging.WARNING):
        await _snapshot(adapter)
        await _snapshot(adapter)
    records = _warnings(caplog)
    assert len(records) == 1 and "KeyError" in records[0].getMessage()
    assert "secret" not in caplog.text


async def test_recovered_attribute_is_warned_again_on_recurrence(caplog: pytest.LogCaptureFixture) -> None:
    coord = _FlakyCoord()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    with caplog.at_level(logging.WARNING):
        await _snapshot(adapter)
        coord.broken = False
        await _snapshot(adapter)
        coord.broken = True
        await _snapshot(adapter)
    assert len(_warnings(caplog)) == 2


async def test_is_connected_raising_means_sse_unknown() -> None:
    coord = _coordinator()

    class _Sse:
        @property
        def is_connected(self) -> bool:
            raise RuntimeError("x")

    coord.sse_manager = SimpleNamespace(sse_client=_Sse())
    assert (await _snapshot(FoxaceAdapter(_hass([_entry(coord)])))).sse_connected is None


@pytest.mark.parametrize("value", [None, 5, object()])
def test_non_str_session_token_returns_none(value: object) -> None:
    coord = _coordinator()
    coord.api = SimpleNamespace(session_token=value)
    assert FoxaceAdapter(_hass([_entry(coord)])).session_token() is None


def test_session_token_with_raising_bool_returns_none() -> None:
    class _BadBool:
        def __bool__(self) -> bool:
            raise RuntimeError("secret")

    hass = _hass([_entry(_BadBool())])
    assert FoxaceAdapter(hass).session_token() is None


class _UpdateFlakyCoord:
    """Coordinator whose last_update_success raises while `broken` is True."""

    api = SimpleNamespace(is_proxy_mode=True, proxy_url="https://a.test")
    sse_manager = None
    account = None

    def __init__(self) -> None:
        self.broken = True

    @property
    def last_update_success(self) -> bool:
        if self.broken:
            raise KeyError("secret")
        return True

    def async_add_listener(self, cb: object) -> object:
        return lambda: None


def _update_warnings(caplog: pytest.LogCaptureFixture) -> list[logging.LogRecord]:
    return [r for r in caplog.records if r.levelno == logging.WARNING and "last_update_success" in r.getMessage()]


async def test_unreadable_update_success_is_warned_once(caplog: pytest.LogCaptureFixture) -> None:
    adapter = FoxaceAdapter(_hass([_entry(_UpdateFlakyCoord())]))
    with caplog.at_level(logging.WARNING):
        first = await _snapshot(adapter)
        second = await _snapshot(adapter)
    records = _update_warnings(caplog)
    assert len(records) == 1 and "KeyError" in records[0].getMessage()
    assert "secret" not in caplog.text
    assert first.update_ok is False and second.update_ok is False


async def test_recovered_update_success_is_warned_again_on_recurrence(caplog: pytest.LogCaptureFixture) -> None:
    coord = _UpdateFlakyCoord()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    with caplog.at_level(logging.WARNING):
        await _snapshot(adapter)
        coord.broken = False
        assert (await _snapshot(adapter)).update_ok is True
        coord.broken = True
        await _snapshot(adapter)
    assert len(_update_warnings(caplog)) == 2


async def test_update_success_with_raising_bool_is_warned_once(caplog: pytest.LogCaptureFixture) -> None:
    class _BadBool:
        def __bool__(self) -> bool:
            raise RuntimeError("secret")

    coord = _coordinator()
    coord.last_update_success = _BadBool()
    adapter = FoxaceAdapter(_hass([_entry(coord)]))
    with caplog.at_level(logging.WARNING):
        first = await _snapshot(adapter)
        await _snapshot(adapter)
    assert first.update_ok is False
    assert len(_update_warnings(caplog)) == 1 and "secret" not in caplog.text
