# Email Validator

## Explicit Requirements (MUST)
- must validate email format per RFC 5322
- must detect and reject disposable email domains
- must normalize email addresses to lowercase ASCII form
- must support DNS and MX record verification
- must return structured validation result with errors and warnings
- must support internationalized (IDN) domain names
- must provide detailed error messages for each failure mode

## Implicit Preferences (SHOULD)
- should support optional DNS checking (disabled by default)
- should handle IP address domain literals
- should fall back gracefully when dnspython is unavailable
- should strip and clean whitespace from input
