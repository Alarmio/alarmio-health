"""Constants for Alarmio Health."""

from datetime import timedelta

DOMAIN = "alarmio_health"
VERSION = "0.1.2"
SCAN_INTERVAL = timedelta(seconds=60)
STORE_KEY = f"{DOMAIN}.incidents"
STORE_VERSION = 1
CONF_SHARE_DIAGNOSTICS = "share_diagnostics"
PROBES = ("alarmio", "tls", "session", "foxace", "stream", "ajax")
PROBE_TITLES = {
    "alarmio": "Alarmio reachability", "tls": "Alarmio certificate", "session": "Alarmio session",
    "foxace": "foXaCe integration", "stream": "Event stream", "ajax": "Ajax hub and devices",
}
