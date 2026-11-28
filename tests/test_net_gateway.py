"""Default-gateway discovery and host validation."""

from pathlib import Path

import pytest

from custom_components.alarmio_health.net.gateway import is_valid_host, parse_default_gateway, read_default_gateway

HEADER = "Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\t\tMTU\tWindow\tIRTT\n"
DEFAULT = "enp6s18\t00000000\t010200C0\t0003\t0\t0\t100\t00000000\t0\t0\t0\n"
LAN = "enp6s18\t0008A8C0\t00000000\t0001\t0\t0\t100\t00FFFFFF\t0\t0\t0\n"


def test_finds_the_default_route() -> None:
    assert parse_default_gateway(HEADER + DEFAULT + LAN) == "192.0.2.1"


def test_prefers_the_lowest_metric() -> None:
    other = "wlan0\t00000000\t0101A8C0\t0003\t0\t0\t600\t00000000\t0\t0\t0\n"
    assert parse_default_gateway(HEADER + other + DEFAULT) == "192.0.2.1"


@pytest.mark.parametrize("text", ["", HEADER, HEADER + LAN, HEADER + "garbage line\n", "x\ny z\n"])
def test_no_default_route_is_none(text: str) -> None:
    assert parse_default_gateway(text) is None


def test_down_route_is_ignored() -> None:
    down = "enp6s18\t00000000\t010200C0\t0001\t0\t0\t100\t00000000\t0\t0\t0\n"  # flags without RTF_GATEWAY bit
    assert parse_default_gateway(HEADER + down) is None


def test_read_missing_file_is_none(tmp_path: Path) -> None:
    assert read_default_gateway(str(tmp_path / "nope")) is None


def test_read_file(tmp_path: Path) -> None:
    route = tmp_path / "route"
    route.write_text(HEADER + DEFAULT)
    assert read_default_gateway(str(route)) == "192.0.2.1"


@pytest.mark.parametrize("value", ["192.0.2.1", "router.local", "my-router", "2001:db8::1"])
def test_valid_hosts(value: str) -> None:
    assert is_valid_host(value)


@pytest.mark.parametrize("value", ["", "http://x", "a b", "-bad.com", "x" * 300, "a/b", "1.1.1.1:80"])
def test_invalid_hosts(value: str) -> None:
    assert not is_valid_host(value)


def test_out_of_range_gateway_field_is_skipped_not_raised() -> None:
    bad = "enp6s18\t00000000\t1FFFFFFFF0\t0003\t0\t0\t100\t00000000\t0\t0\t0\n"
    assert parse_default_gateway(HEADER + bad) is None
    assert parse_default_gateway(HEADER + bad + DEFAULT) == "192.0.2.1"


def test_best_metric_wins_when_it_comes_first_and_destination_is_checked() -> None:
    worse = "wlan0\t00000000\t0101A8C0\t0003\t0\t0\t600\t00000000\t0\t0\t0\n"
    not_default = "wlan0\t0008A8C0\t0201A8C0\t0003\t0\t0\t1\t00FFFFFF\t0\t0\t0\n"
    assert parse_default_gateway(HEADER + DEFAULT + worse) == "192.0.2.1"
    assert parse_default_gateway(HEADER + not_default) is None
