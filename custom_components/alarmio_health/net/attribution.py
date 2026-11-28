"""Attach the blame verdict to probe results: the cause on the culprit, "not evaluated" beyond it."""

from __future__ import annotations

from dataclasses import replace

from ..models import ProbeResult, Status, Verdict

_BAD = (Status.DEGRADED, Status.DOWN)
# Probes further from Home Assistant than the blamed hop. Chain, from HA outward:
# gateway -> internet -> Alarmio (alarmio, tls, session) -> Ajax cloud -> Ajax hub (ajax, stream, foxace).
# Only reachability failures are masked. `tls` and `session` are never masked: a DOWN there (expired certificate,
# 401 rejections) exists because the server answered, so it is proof the path works. After a single loop stall
# (`ha_host`) `ajax` and `stream` stay too: they are read from foXaCe's state, not measured over the network.
_BEYOND = {
    "ha_host": ("gateway", "internet", "alarmio", "ajaxcloud"),
    "gateway": ("internet", "alarmio", "ajaxcloud", "ajax", "stream"),
    "internet": ("alarmio", "ajaxcloud", "ajax", "stream"),
}
_OWN_PROBE = {
    "gateway": "gateway",
    "internet": "internet",
    "route": "alarmio",
    "alarmio": "alarmio",
    "ajax_cloud": "ajaxcloud",
}

_DEBOUNCED = ("gateway", "internet", "ajax_cloud")


def apply_verdict(
    results: dict[str, ProbeResult], verdict: Verdict, echo_state: str
) -> tuple[dict[str, ProbeResult], Verdict]:
    """Return new results and the verdict actually applied.

    The cause text goes on the blamed probe, downstream reachability probes become unknown. When the blamed probe's
    own debounced reading is not bad yet, nothing is applied and the returned verdict is an unblamed one (the
    same numbers and notes), so a summary never names a cause the probes do not show.
    """
    out = dict(results)
    broken = verdict.broken
    if broken is None:
        return out, verdict
    own = _OWN_PROBE.get(broken)
    if broken in _DEBOUNCED and (own not in out or out[own].status not in _BAD):
        return out, Verdict(None, Status.HEALTHY, "", verdict.numbers, verdict.notes)
    if own in out:
        out[own] = replace(out[own], detail=verdict.text)
    beyond = list(_BEYOND.get(broken, ()))
    if broken == "route" and echo_state not in ("ok", "slow"):
        beyond.append("ajaxcloud")  # no reply from the server, so its Ajax report is missing too
    for name in beyond:
        result = out.get(name)
        if result is not None and result.status in _BAD:
            out[name] = ProbeResult(name, Status.UNKNOWN, result.checked_at, detail=f"Not evaluated: {verdict.text}")
    return out, verdict
