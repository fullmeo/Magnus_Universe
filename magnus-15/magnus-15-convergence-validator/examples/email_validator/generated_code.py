"""
CANONICAL EXAMPLE 6: Email Validator (Kilo Claw Integration)
Expected: PARTIAL (80.5/70.4/80.6)
Source: Kilo Claw OpenClaw Agent via Telegram
Message: "RFC 5322-compliant email validator with IDN, disposable detection, DNS/MX"
"""

import re
import unicodedata
import socket
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum, auto


# ---------------------------------------------------------------------------
# Disposable domain list (extend as needed)
# ---------------------------------------------------------------------------

DISPOSABLE_DOMAINS: frozenset[str] = frozenset({
    "mailinator.com", "guerrillamail.com", "guerrillamail.net",
    "guerrillamail.org", "guerrillamail.biz", "guerrillamail.de",
    "guerrillamailblock.com", "grr.la", "sharklasers.com", "spam4.me",
    "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
    "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr",
    "courriel.fr.nf", "moncourrier.fr.nf", "monemail.fr.nf",
    "monmail.fr.nf", "trashmail.com", "trashmail.at", "trashmail.io",
    "trashmail.me", "trashmail.net", "dispostable.com", "spamgourmet.com",
    "spamgourmet.net", "spamgourmet.org", "maildrop.cc", "throwam.com",
    "tempmail.com", "temp-mail.org", "fakeinbox.com", "mailnull.com",
    "spamcowboy.com", "spamcowboy.net", "spamcowboy.org", "0-mail.com",
    "filzmail.com", "throwam.com", "discard.email", "tempinbox.com",
})


# ---------------------------------------------------------------------------
# Result types
# ---------------------------------------------------------------------------

class ValidationStatus(Enum):
    VALID            = auto()
    INVALID_FORMAT   = auto()
    INVALID_LOCAL    = auto()
    INVALID_DOMAIN   = auto()
    DISPOSABLE       = auto()
    DNS_FAILED       = auto()
    DNS_SKIPPED      = auto()


@dataclass
class ValidationResult:
    """Full report of a single email validation run."""
    raw:              str
    normalized:       Optional[str]       = None
    status:           ValidationStatus    = ValidationStatus.INVALID_FORMAT
    errors:           list[str]           = field(default_factory=list)
    warnings:         list[str]           = field(default_factory=list)
    is_valid:         bool                = False
    is_disposable:    bool                = False
    dns_checked:      bool                = False
    mx_records:       list[str]           = field(default_factory=list)

    def __str__(self) -> str:
        lines = [
            f"Email  : {self.raw}",
            f"Normal : {self.normalized or '—'}",
            f"Valid  : {self.is_valid}",
            f"Status : {self.status.name}",
        ]
        if self.errors:
            lines.append("Errors : " + "; ".join(self.errors))
        if self.warnings:
            lines.append("Warns  : " + "; ".join(self.warnings))
        if self.dns_checked:
            lines.append(f"MX     : {', '.join(self.mx_records) or 'none found'}")
        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Validator
# ---------------------------------------------------------------------------

class EmailValidator:
    """
    RFC 5322-flavoured email validator with normalization,
    disposable-domain detection, and optional DNS/MX checking.

    Args:
        check_dns:      Perform MX record lookup (default False).
        dns_timeout:    Seconds before DNS lookup times out (default 5).
        allow_ip_domain: Accept IP-address literals like user@[1.2.3.4].
    """

    # Local part: printable ASCII minus specials; quoted strings not expanded.
    _LOCAL_RE  = re.compile(r'^[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~.-]+$')
    # Domain label: letters, digits, hyphens; no leading/trailing hyphen.
    _LABEL_RE  = re.compile(r'^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$')
    # IPv4 literal inside brackets.
    _IP_RE     = re.compile(
        r'^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$'
    )

    def __init__(
        self,
        check_dns: bool = False,
        dns_timeout: float = 5.0,
        allow_ip_domain: bool = False,
    ) -> None:
        self.check_dns       = check_dns
        self.dns_timeout     = dns_timeout
        self.allow_ip_domain = allow_ip_domain

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    def validate(self, email: str) -> ValidationResult:
        """Validate *email* and return a :class:`ValidationResult`."""
        result = ValidationResult(raw=email)

        # 1. Basic sanity + split
        if not self._split(email, result):
            return result
        local, domain = result._local, result._domain   # type: ignore[attr-defined]

        # 2. Validate local part
        if not self._validate_local(local, result):
            result.status = ValidationStatus.INVALID_LOCAL
            return result

        # 3. Normalize + validate domain (handles IDN)
        domain_ascii = self._validate_domain(domain, result)
        if domain_ascii is None:
            result.status = ValidationStatus.INVALID_DOMAIN
            return result

        # 4. Normalize full address
        result.normalized = f"{local.lower()}@{domain_ascii}"

        # 5. Disposable check
        if domain_ascii in DISPOSABLE_DOMAINS:
            result.is_disposable = True
            result.warnings.append(f"'{domain_ascii}' is a known disposable email provider")
            result.status = ValidationStatus.DISPOSABLE
            result.errors.append("Disposable email addresses are not accepted")
            return result

        # 6. Optional DNS / MX check
        if self.check_dns:
            if not self._check_mx(domain_ascii, result):
                result.status = ValidationStatus.DNS_FAILED
                return result
        else:
            result.status = ValidationStatus.DNS_SKIPPED

        result.status   = ValidationStatus.VALID
        result.is_valid = True
        return result

    # ------------------------------------------------------------------
    # Step implementations
    # ------------------------------------------------------------------

    def _split(self, email: str, result: ValidationResult) -> bool:
        """Split into local + domain; populate errors on failure."""
        if not isinstance(email, str):
            result.errors.append("Email must be a string")
            return False

        email = email.strip()
        if not email:
            result.errors.append("Email address is empty")
            return False

        if len(email) > 320:
            result.errors.append(
                f"Email is too long ({len(email)} chars; max 320)"
            )
            return False

        at_count = email.count("@")
        if at_count == 0:
            result.errors.append("Missing '@' symbol")
            return False
        if at_count > 1:
            result.errors.append("Multiple '@' symbols found")
            return False

        local, domain = email.rsplit("@", 1)

        if not local:
            result.errors.append("Local part (before '@') is empty")
            return False
        if not domain:
            result.errors.append("Domain part (after '@') is empty")
            return False

        result._local  = local   # type: ignore[attr-defined]
        result._domain = domain  # type: ignore[attr-defined]
        return True

    def _validate_local(self, local: str, result: ValidationResult) -> bool:
        if len(local) > 64:
            result.errors.append(
                f"Local part is too long ({len(local)} chars; max 64)"
            )
            return False

        if local.startswith(".") or local.endswith("."):
            result.errors.append("Local part must not start or end with a dot")
            return False

        if ".." in local:
            result.errors.append("Local part must not contain consecutive dots")
            return False

        if not self._LOCAL_RE.match(local):
            result.errors.append(
                "Local part contains invalid characters "
                "(only letters, digits, and !#$%&'*+/=?^_`{|}~.- are allowed)"
            )
            return False

        return True

    def _validate_domain(
        self, domain: str, result: ValidationResult
    ) -> Optional[str]:
        """
        Validate and normalize domain. Handles:
        - ASCII domains
        - Internationalized (IDN) domains via IDNA encoding
        - IPv4 literals (if allow_ip_domain is True)

        Returns ASCII domain string, or None on failure.
        """
        # IPv4 literal
        if domain.startswith("["):
            if not self.allow_ip_domain:
                result.errors.append("IP address literals are not allowed as domain")
                return None
            match = self._IP_RE.match(domain)
            if not match:
                result.errors.append(f"Invalid IP address literal: '{domain}'")
                return None
            octets = [int(g) for g in match.groups()]
            if any(o > 255 for o in octets):
                result.errors.append("IP address octet out of range (0-255)")
                return None
            return domain  # keep as-is

        if len(domain) > 253:
            result.errors.append(
                f"Domain is too long ({len(domain)} chars; max 253)"
            )
            return None

        # Normalize unicode to NFC before IDNA
        domain = unicodedata.normalize("NFC", domain)

        # Convert internationalized domain to ACE/ASCII (IDNA 2003 via Python)
        try:
            domain_ascii = domain.encode("idna").decode("ascii").lower()
        except (UnicodeError, UnicodeDecodeError):
            result.errors.append(
                f"Domain '{domain}' contains characters that cannot be IDNA-encoded"
            )
            return None

        labels = domain_ascii.split(".")

        if len(labels) < 2:
            result.errors.append("Domain must have at least two labels (e.g. example.com)")
            return None

        for label in labels:
            if not label:
                result.errors.append("Domain contains an empty label (consecutive dots?)")
                return None
            if not self._LABEL_RE.match(label):
                result.errors.append(
                    f"Domain label '{label}' is invalid "
                    "(1-63 chars, letters/digits/hyphens, no leading/trailing hyphen)"
                )
                return None

        tld = labels[-1]
        if not tld.isalpha():
            result.warnings.append(
                f"TLD '{tld}' is numeric — this is unusual but not disallowed"
            )

        return domain_ascii

    def _check_mx(self, domain: str, result: ValidationResult) -> bool:
        """Resolve MX (falling back to A/AAAA) records for *domain*."""
        result.dns_checked = True
        old_timeout = socket.getdefaulttimeout()
        socket.setdefaulttimeout(self.dns_timeout)
        try:
            try:
                import dns.resolver  # type: ignore
                answers = dns.resolver.resolve(domain, "MX")
                result.mx_records = sorted(
                    str(r.exchange).rstrip(".") for r in answers
                )
                return True
            except ImportError:
                # dnspython not installed — fall back to basic A record check
                socket.getaddrinfo(domain, None)
                result.warnings.append(
                    "dnspython not installed; MX check fell back to A-record lookup"
                )
                result.mx_records = [domain]
                return True
            except Exception as dns_err:
                result.errors.append(f"DNS lookup failed for '{domain}': {dns_err}")
                return False
        except OSError as e:
            result.errors.append(f"Network error during DNS lookup: {e}")
            return False
        finally:
            socket.setdefaulttimeout(old_timeout)
