"""The version has two sources (manifest.json for HACS/HA, const.VERSION for the heartbeat): they must agree."""

import json
from pathlib import Path

from custom_components.alarmio_health.const import VERSION

MANIFEST = Path(__file__).parent.parent / "custom_components" / "alarmio_health" / "manifest.json"


def test_const_version_matches_manifest() -> None:
    assert json.loads(MANIFEST.read_text())["version"] == VERSION
