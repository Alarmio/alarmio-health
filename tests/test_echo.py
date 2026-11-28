"""Echo ids, reply parsing and loss reconciliation."""

import re

from custom_components.alarmio_health.echo import EchoTracker
from custom_components.alarmio_health.models import StageTimings

TIMINGS = StageTimings(connect_ms=120.0, tls_ms=150.0, wait_ms=520.0)


def _reply(req_id: str, **extra) -> dict:
    return {
        "server_ms": 3,
        "queue_ms": 1,
        "seen": [{"id": req_id, "ago_ms": 5}],
        "ajax": {
            "calls": 40,
            "p50_ms": 200,
            "p95_ms": 900,
            "err_5xx": 0,
            "rate_limited": 0,
            "canary_ms": 180,
            "canary_ok": True,
            "canary_age_s": 20,
        },
        "sqs_lag_p95_ms": 120,
        **extra,
    }


def test_ids_are_server_acceptable_and_unique_and_seq_counts() -> None:
    t = EchoTracker()
    a, b = t.begin(), t.begin()
    assert re.fullmatch(r"[A-Za-z0-9_-]{8,64}", a.id) and a.id != b.id
    assert (a.seq, b.seq) == (1, 2)


def test_seq_wraps() -> None:
    t = EchoTracker()
    t._seq = 2**31 - 1
    assert t.begin().seq == 0


def test_ok_reply() -> None:
    t = EchoTracker()
    req = t.begin()
    res = t.complete(req, _reply(req.id), 0.6, TIMINGS)
    assert res.state == "ok" and res.server_ms == 3.0 and res.queue_ms == 1.0
    assert res.round_trip_ms == 517.0 and res.sqs_lag_p95_ms == 120.0
    assert res.ajax is not None and res.ajax["p95_ms"] == 900 and res.ajax["canary_ok"] is True
    assert res.timings == TIMINGS and res.loss == ()


def test_slow_reply_is_slow_not_lost() -> None:
    t = EchoTracker()
    req = t.begin()
    assert t.complete(req, _reply(req.id), 6.2, TIMINGS).state == "slow"


def test_no_reply_is_lost_and_next_reply_says_which_direction() -> None:
    t = EchoTracker()
    first = t.begin()
    assert t.complete(first, None, None, StageTimings()).state == "lost"
    second = t.begin()
    reply = _reply(second.id)
    reply["seen"].append({"id": first.id, "ago_ms": 61000})  # server got it: the reply was lost
    assert t.complete(second, reply, 0.5, TIMINGS).loss == ("reply",)
    third = t.begin()
    assert t.complete(third, None, None, StageTimings()).state == "lost"
    fourth = t.begin()
    assert t.complete(fourth, _reply(fourth.id), 0.5, TIMINGS).loss == ("request",)
    fifth = t.begin()
    assert t.complete(fifth, _reply(fifth.id), 0.5, TIMINGS).loss == ()  # settled ones are not counted twice


def test_garbage_seen_means_unknown_direction() -> None:
    t = EchoTracker()
    first = t.begin()
    t.complete(first, None, None, StageTimings())
    second = t.begin()
    assert t.complete(second, _reply(second.id, seen="nope"), 0.5, TIMINGS).loss == ("unknown",)


def test_unresolved_list_is_bounded() -> None:
    t = EchoTracker(max_unresolved=3)
    for _ in range(10):
        t.complete(t.begin(), None, None, StageTimings())
    assert len(t._unresolved) == 3


def test_unavailable() -> None:
    t = EchoTracker()
    assert t.unavailable(t.begin()).state == "unavailable"


def test_bad_numbers_become_none() -> None:
    t = EchoTracker()
    req = t.begin()
    reply = _reply(req.id, server_ms="x", queue_ms=-4, sqs_lag_p95_ms=True)
    reply["ajax"] = {"calls": "many", "p95_ms": float("nan"), "canary_ok": "yes", "unknown_key": 1}
    res = t.complete(req, reply, 0.5, TIMINGS)
    assert res.server_ms is None and res.queue_ms is None and res.sqs_lag_p95_ms is None
    assert res.round_trip_ms is None
    assert res.ajax == {}


def test_round_trip_never_negative() -> None:
    t = EchoTracker()
    req = t.begin()
    res = t.complete(req, _reply(req.id, server_ms=900), 0.5, StageTimings(wait_ms=100.0))
    assert res.round_trip_ms is None


def test_a_resent_echo_reconciles_as_unknown_not_request_or_reply() -> None:
    t = EchoTracker()
    first = t.begin()
    t.complete(first, None, None, StageTimings())
    t.mark_resent(first.id)  # its payload is queued and will be sent again
    second = t.begin()
    reply = _reply(second.id)
    reply["seen"].append({"id": first.id, "ago_ms": 100})  # seen only because of the resend
    assert t.complete(second, reply, 0.5, TIMINGS).loss == ("unknown",)
    third = t.begin()
    t.complete(third, None, None, StageTimings())  # not marked resent: direction still readable
    fourth = t.begin()
    assert t.complete(fourth, _reply(fourth.id), 0.5, TIMINGS).loss == ("request",)


def test_mark_resent_ignores_unknown_ids() -> None:
    t = EchoTracker()
    t.mark_resent("nope")
    assert t._resent == set()
