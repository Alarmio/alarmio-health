"""The built panel must ship in the repository: HACS installs it as is and never runs a build.

Freshness against frontend/src is deliberately not checked by file mtime: a git clone gives every file
a new, arbitrary mtime, so such a test would fail or pass at random. `npm run test:ci` rebuilds the
panel before running its tests, which is the real guard.
"""

from pathlib import Path

WWW = Path(__file__).parent.parent / "custom_components" / "alarmio_health" / "www"
FONTS = ("space-grotesk.woff2", "inter.woff2", "jetbrains-mono.woff2")


def test_fonts_present() -> None:
    for name in FONTS:
        assert (WWW / "fonts" / name).stat().st_size > 1000, name


def test_panel_is_a_production_build() -> None:
    panel = WWW / "panel.js"
    assert panel.stat().st_size > 50_000
    text = panel.read_text(encoding="utf-8")
    assert "alarmio-health-panel" in text
    assert "createMockApi" not in text
