# Complex Auth & Payment System

## Hard Constraints
- Must validate user credentials with JWT token generation
- Must handle payments via a processor API (e.g., Stripe-like)
- Must log errors at debug, info, error levels

## Soft Constraints
- Should implement rate limiting on login attempts
- Should use consistent naming conventions (prefer camelCase)
- Should avoid unnecessary abstractions and layers

## Success Criteria
- System must be secure (no plaintext passwords)
- Payments must be atomic (success or rollback)
- Handle at least 3 error types consistently

## Out of Scope
- Real database integration (use stubs)
- Front-end UI

## Edge Cases to Test
- Invalid credentials (throw error)
- Payment failures (return code + log)
- Legacy callback errors (mixed with promises)
- Mixed paradigms (OOP + functional)
