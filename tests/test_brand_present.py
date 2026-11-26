"""The integration ships brand images so Home Assistant shows an icon on its integration page.

Home Assistant serves a custom integration's images from `custom_components/<domain>/brand/` (a missing folder means
a blank placeholder). `icon.png` is the only required file because every other image falls back to it.
"""

from __future__ import annotations

import struct
from pathlib import Path

import pytest

BRAND = Path(__file__).resolve().parent.parent / "custom_components" / "alarmio_health" / "brand"
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
COLOR_TYPE_RGBA = 6
# The only file names Home Assistant's brands proxy will serve for an integration.
ALLOWED_NAMES = frozenset(
    {
        "icon.png", "logo.png", "icon@2x.png", "logo@2x.png",
        "dark_icon.png", "dark_logo.png", "dark_icon@2x.png", "dark_logo@2x.png",
    }
)


def _png_header(path: Path) -> tuple[int, int, int]:
    """Return (width, height, colour type) read from the PNG IHDR chunk, without any imaging library."""
    data = path.read_bytes()
    assert data[:8] == PNG_SIGNATURE, f"{path.name} is not a PNG file"
    width, height = struct.unpack(">II", data[16:24])
    return width, height, data[25]


def test_brand_folder_exists() -> None:
    assert BRAND.is_dir(), "custom_components/alarmio_health/brand is missing: HA shows a blank icon without it"


@pytest.mark.parametrize(("name", "size"), [("icon.png", 256), ("icon@2x.png", 512)])
def test_icon_is_a_square_png_of_the_size_home_assistant_expects(name: str, size: int) -> None:
    width, height, _ = _png_header(BRAND / name)
    assert (width, height) == (size, size), f"{name} must be {size}x{size}, got {width}x{height}"


@pytest.mark.parametrize("name", ["icon.png", "icon@2x.png"])
def test_icon_has_an_alpha_channel_for_the_rounded_corners(name: str) -> None:
    assert _png_header(BRAND / name)[2] == COLOR_TYPE_RGBA, f"{name} must be RGBA so its corners stay transparent"


def test_only_file_names_home_assistant_serves() -> None:
    names = {p.name for p in BRAND.iterdir() if p.is_file()}
    assert names <= ALLOWED_NAMES, f"unexpected files in brand/: {sorted(names - ALLOWED_NAMES)}"
