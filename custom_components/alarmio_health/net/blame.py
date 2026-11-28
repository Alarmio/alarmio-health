"""The blame rule: evaluate the chain from Home Assistant outward and name the first broken hop. Pure functions."""

from __future__ import annotations

from typing import Any

from ..models import HopStats, NetSnapshot, Status, Verdict

LOSS_DEGRADED_PCT = 20.0
GATEWAY_SLOW_MS = 20.0
VPS_ROUND_TRIP_MS = 400.0
SYN_RETRANSMIT_MS = 900.0
SERVER_DEGRADED_MS = 500.0
SERVER_DOWN_MS = 3000.0
AJAX_P95_MS = 3000.0
AJAX_ERROR_RATE = 0.10
AJAX_MIN_CALLS = 10.0
LOOP_LAG_MS = 250.0
DIRECT_AJAX_SLOW_MS = 3000.0
_ANSWERED = ("ok", "slow")
_BAD = (Status.DEGRADED, Status.DOWN)


def _loss_status(hop: HopStats) -> Status:
    """Silence is down; ICMP loss over the limit is degraded (TCP hides loss, so it is not read from TCP hops)."""
    if hop.sent <= 0:
        return Status.UNKNOWN
    if hop.received == 0:
        return Status.DOWN
    if hop.method == "icmp" and hop.loss_pct >= LOSS_DEGRADED_PCT:
        return Status.DEGRADED
    return Status.HEALTHY


def gateway_status(hop: HopStats | None) -> Status:
    """Status of the local router hop."""
    if hop is None:
        return Status.UNKNOWN
    status = _loss_status(hop)
    if status is Status.HEALTHY and hop.rtt_median_ms is not None and hop.rtt_median_ms > GATEWAY_SLOW_MS:
        return Status.DEGRADED
    return status


def internet_status(hop: HopStats | None) -> Status:
    """Status of the internet anchor hop."""
    return Status.UNKNOWN if hop is None else _loss_status(hop)


def server_status(server_ms: float | None) -> Status:
    """Status of Alarmio's own processing time."""
    if server_ms is None:
        return Status.UNKNOWN
    if server_ms > SERVER_DOWN_MS:
        return Status.DOWN
    return Status.DEGRADED if server_ms > SERVER_DEGRADED_MS else Status.HEALTHY


def ajax_cloud_status(ajax: dict[str, Any] | None) -> Status:
    """Status of Ajax's cloud from the server's `ajax` block (canary, p95, error rate)."""
    if not ajax:
        return Status.UNKNOWN
    p95 = ajax.get("p95_ms")
    if not (
        isinstance(ajax.get("canary_ok"), bool)
        or isinstance(p95, int | float)
        or isinstance(ajax.get("calls"), int | float)
    ):
        return Status.UNKNOWN
    if ajax.get("canary_ok") is False:
        return Status.DEGRADED
    if isinstance(p95, int | float) and p95 > AJAX_P95_MS:
        return Status.DEGRADED
    calls, errors = ajax.get("calls"), ajax.get("err_5xx")
    if isinstance(calls, int | float) and isinstance(errors, int | float):
        if calls >= AJAX_MIN_CALLS and errors / calls > AJAX_ERROR_RATE:
            return Status.DEGRADED
    return Status.HEALTHY


def _numbers(net: NetSnapshot) -> dict[str, float | None]:
    echo = net.echo
    return {
        "loop_lag_ms": net.loop_lag_ms,
        "gateway_loss_pct": net.gateway.loss_pct if net.gateway else None,
        "gateway_ms": net.gateway.rtt_median_ms if net.gateway else None,
        "internet_loss_pct": net.internet.loss_pct if net.internet else None,
        "internet_ms": net.internet.rtt_median_ms if net.internet else None,
        "vps_loss_pct": net.vps.loss_pct if net.vps else None,
        "vps_ms": net.vps.rtt_median_ms if net.vps else None,
        "server_ms": echo.server_ms if echo else None,
        "connect_ms": echo.timings.connect_ms if echo else None,
    }


def _verdict(broken: str, status: Status, text: str, net: NetSnapshot, notes: tuple[str, ...] = ()) -> Verdict:
    return Verdict(broken, status, text, _numbers(net), notes)


def _pings(hop: HopStats) -> str:
    return f"{hop.sent - hop.received} of {hop.sent} pings"


def _has_data(net: NetSnapshot) -> bool:
    """True when at least one hop was really measured; with none, the answer is unknown, never healthy."""
    if gateway_status(net.gateway) is not Status.UNKNOWN or internet_status(net.internet) is not Status.UNKNOWN:
        return True
    if net.proxy_mode:
        echo = net.echo
        return (
            (net.vps is not None and net.vps.sent > 0)
            or (echo is not None and server_status(echo.server_ms) is not Status.UNKNOWN)
            or (echo is not None and ajax_cloud_status(echo.ajax) is not Status.UNKNOWN)
        )
    return net.ajax_direct_ok is not None or net.ajax_direct_ms is not None


def _later_evidence(net: NetSnapshot) -> bool:
    """True when something further out answered this minute, so a silent hop is filtered rather than down."""
    echo = net.echo
    if echo is not None and echo.state in _ANSWERED:
        return True
    if net.vps is not None and net.vps.received > 0:
        return True
    return net.ajax_direct_ok is True


def _silent(hop: HopStats | None) -> bool:
    return hop is not None and hop.sent > 0 and hop.received == 0


def gateway_filtered(net: NetSnapshot) -> bool:
    """The router answered nothing, yet later hops answered: it just ignores pings (or connections)."""
    return _silent(net.gateway) and _later_evidence(net)


def internet_filtered(net: NetSnapshot) -> bool:
    """The internet anchor answered nothing, yet later hops answered: it ignores pings (or connections)."""
    return _silent(net.internet) and _later_evidence(net)


def _filtered_note(noun: str, hop: HopStats | None) -> str:
    return f"{noun} does not answer {'connections' if hop is not None and hop.method == 'tcp' else 'pings'}"


def blame(net: NetSnapshot) -> Verdict:
    """Name the first broken hop, from Home Assistant outward. Later hops are simply not evaluated."""
    if net.loop_lag_ms is not None and net.loop_lag_ms > LOOP_LAG_MS:
        return _verdict(
            "ha_host",
            Status.DEGRADED,
            f"Home Assistant itself stalled for {net.loop_lag_ms:.0f} ms, "
            "so network readings this minute are unreliable.",
            net,
        )
    notes: tuple[str, ...] = ()
    gateway = gateway_status(net.gateway)
    if gateway_filtered(net):
        gateway = Status.HEALTHY
        notes = (*notes, _filtered_note("your router", net.gateway))
    if gateway in _BAD and net.gateway is not None:
        if net.gateway.received == 0:
            text = "Your router did not answer. Check your local network."
        elif net.gateway.loss_pct >= LOSS_DEGRADED_PCT and net.gateway.method == "icmp":
            text = f"Packets to your router were lost ({_pings(net.gateway)}). Check your local network."
        else:
            text = f"Your router is slow to answer ({net.gateway.rtt_median_ms:.0f} ms). Check your local network."
        return _verdict("gateway", gateway, text, net)
    internet = internet_status(net.internet)
    if internet_filtered(net):
        internet = Status.HEALTHY
        notes = (*notes, _filtered_note("the internet address", net.internet))
    if internet in _BAD and net.internet is not None:
        if net.internet.received == 0:
            text = "Your internet connection is down: nothing outside your router answered."
        else:
            text = f"Your internet connection is losing packets ({_pings(net.internet)})."
        return _verdict("internet", internet, text, net)

    if net.proxy_mode:
        echo = net.echo
        server_ms = echo.server_ms if echo else None
        answered = f" Alarmio itself answered in {server_ms:.0f} ms." if server_ms is not None else ""
        vps = net.vps
        if vps is not None and vps.received == 0 and vps.sent > 0 and echo is not None and echo.state in _ANSWERED:
            # The server just answered us: silent VPS pings are filtered, not a dead route.
            if vps.method == "icmp":
                notes = (*notes, "pings to Alarmio are blocked")
            vps = None
        if vps is not None and vps.received == 0 and vps.sent > 0:
            text = "Nothing reached Alarmio. Either Alarmio is down or the route to it is."
            return _verdict("route", Status.DOWN, text, net, notes)
        if vps is not None and vps.method == "icmp" and vps.loss_pct >= LOSS_DEGRADED_PCT:
            return _verdict(
                "route", Status.DEGRADED, f"Packets to Alarmio were lost ({_pings(vps)}).{answered}", net, notes
            )
        if vps is not None and vps.rtt_median_ms is not None and vps.rtt_median_ms > VPS_ROUND_TRIP_MS:
            return _verdict(
                "route",
                Status.DEGRADED,
                f"The route to Alarmio is slow ({vps.rtt_median_ms:.0f} ms round trip).{answered}",
                net,
                notes,
            )
        connect = echo.timings.connect_ms if echo else None
        if (
            connect is not None
            and connect >= SYN_RETRANSMIT_MS
            and (server_ms is None or server_ms <= SERVER_DEGRADED_MS)
        ):
            return _verdict(
                "route",
                Status.DEGRADED,
                f"Connecting to Alarmio took {connect:.0f} ms, which suggests a lost packet on the way.{answered}",
                net,
                notes,
            )
        if echo is not None and echo.state == "lost":
            return _verdict(
                "route",
                Status.DEGRADED,
                "Alarmio did not answer in time; the heartbeat was lost on the way or Alarmio is not responding.",
                net,
                notes,
            )
        if echo is not None and echo.state == "unavailable":
            notes = (*notes, "server timing unavailable")
        status = server_status(server_ms)
        if status in _BAD:
            return _verdict("alarmio", status, f"Alarmio is slow to process requests ({server_ms:.0f} ms).", net, notes)
        ajax_status = ajax_cloud_status(echo.ajax if echo else None)
        if ajax_status in _BAD:
            return _verdict(
                "ajax_cloud", ajax_status, "Ajax's cloud is slow or failing, as seen from Alarmio.", net, notes
            )
    elif net.ajax_direct_ok is False:
        text = "Cannot reach Ajax's cloud from your network (approximate)."
        return _verdict("ajax_cloud", Status.DOWN, text, net, notes)
    elif net.ajax_direct_ms is not None and net.ajax_direct_ms > DIRECT_AJAX_SLOW_MS:
        return _verdict(
            "ajax_cloud",
            Status.DEGRADED,
            f"Ajax's cloud is slow to answer ({net.ajax_direct_ms:.0f} ms) (approximate).",
            net,
            notes,
        )

    if not _has_data(net):
        return Verdict(None, Status.UNKNOWN, "", _numbers(net), notes)
    return Verdict(None, Status.HEALTHY, "", _numbers(net), notes)
