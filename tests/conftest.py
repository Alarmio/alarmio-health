"""Shared fixtures."""

import contextlib

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Let the test hass load custom_components/."""
    yield


@pytest.fixture(autouse=True)
def preload_dependencies(hass):
    """Mark the manifest dependencies as loaded.

    The frontend package (hass_frontend) is not installed in the test venv and the recorder needs a database,
    neither of which these tests use; the panel registration is patched where it matters.
    """
    hass.config.components.update({"http", "frontend", "panel_custom", "ping", "recorder", "websocket_api"})
    yield


@pytest.fixture(scope="session", autouse=True)
def pycares_helper_thread() -> None:
    """Start pycares' lazily created shutdown thread up front.

    The real http server (used by the websocket tests) creates it during the first test that resolves DNS,
    which the harness' per-test thread-leak check would otherwise report.
    """
    with contextlib.suppress(Exception):  # only helps the leak check; the attribute is private to pycares
        import pycares

        pycares._shutdown_manager.start()


@pytest.fixture(autouse=True)
def no_real_network(monkeypatch):
    """The coordinator must never ping or connect for real in tests: default to "no data"."""
    from custom_components.alarmio_health import coordinator as module
    from custom_components.alarmio_health.net.probes import NetHops

    async def no_hops(**kwargs):
        return NetHops(None, None, None)

    async def tcp_mode(ping=None):
        return "tcp-fallback"

    async def no_direct(client, **kwargs):
        from custom_components.alarmio_health.models import StageTimings

        return None, None, StageTimings()

    monkeypatch.setattr(module, "measure_network", no_hops)
    monkeypatch.setattr(module, "probe_ajax_direct", no_direct)
    monkeypatch.setattr(module, "detect_icmp_mode", tcp_mode)
    monkeypatch.setattr(module, "read_default_gateway", lambda: None)
    yield
