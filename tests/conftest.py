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
    hass.config.components.update({"http", "frontend", "panel_custom", "recorder", "websocket_api"})
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
