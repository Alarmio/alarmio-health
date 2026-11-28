"""Default-gateway discovery from /proc/net/route, and validation of user-supplied hosts."""

from __future__ import annotations

import ipaddress
import re
import socket
import struct

_HOSTNAME = re.compile(
    r"^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$"
)
_RTF_GATEWAY = 0x2


def parse_default_gateway(text: str) -> str | None:
    """The gateway of the default route with the lowest metric, as dotted quad, or None."""
    best: tuple[int, str] | None = None
    for line in text.splitlines()[1:]:
        parts = line.split()
        if len(parts) < 4:
            continue
        try:
            if parts[1] != "00000000" or not int(parts[3], 16) & _RTF_GATEWAY:
                continue
            raw = int(parts[2], 16)
            metric = int(parts[6]) if len(parts) > 6 else 0
        except ValueError:
            continue
        if not 0 < raw <= 0xFFFFFFFF:
            continue
        address = socket.inet_ntoa(struct.pack("<L", raw))
        if best is None or metric < best[0]:
            best = (metric, address)
    return best[1] if best else None


def read_default_gateway(path: str = "/proc/net/route") -> str | None:
    """Read the routing table; None if it cannot be read. Blocking (tiny file): run it in an executor."""
    try:
        with open(path, encoding="ascii") as handle:
            return parse_default_gateway(handle.read())
    except (OSError, UnicodeDecodeError):
        return None


def is_valid_host(value: str) -> bool:
    """True for an IP address or a plain hostname (no scheme, port or path)."""
    candidate = value.strip()
    if not candidate:
        return False
    try:
        ipaddress.ip_address(candidate)
    except ValueError:
        return bool(_HOSTNAME.match(candidate))
    return True
