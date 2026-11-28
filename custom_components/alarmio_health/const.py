"""Constants for Alarmio Health."""

from datetime import timedelta

DOMAIN = "alarmio_health"
VERSION = "0.2.1"
SCAN_INTERVAL = timedelta(seconds=60)
STORE_KEY = f"{DOMAIN}.incidents"
STORE_VERSION = 1
CONF_SHARE_DIAGNOSTICS = "share_diagnostics"
PROBES = ("alarmio", "tls", "session", "foxace", "stream", "ajax", "gateway", "internet", "ajaxcloud")
PROBE_TITLES = {
    "alarmio": "Alarmio reachability", "tls": "Alarmio certificate", "session": "Alarmio session",
    "foxace": "foXaCe integration", "stream": "Event stream", "ajax": "Ajax hub and devices",
    "gateway": "Gateway", "internet": "Internet connection", "ajaxcloud": "Ajax cloud",
}
CONF_GATEWAY = "gateway"
CONF_ANCHOR_HOST = "anchor_host"
CONF_ANCHOR_ENABLED = "anchor_enabled"
DEFAULT_ANCHOR = "1.1.1.1"
