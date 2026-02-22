# Example 2: Medium API with Auth + DB

## Context

Build a REST API for user authentication and basic user profile management. This extends the simple API with authentication and database persistence.

## Constraints

- must implement JWT-based authentication
- must add rate limiting (100 requests/minute per user)
- must store user data in an in-memory database stub
- must add structured logging (JSON format)

## Technology Stack

- Language: TypeScript
- Runtime: Node.js 18+
- No external database (use in-memory stub)

## Deliverables

- `auth.ts` - Authentication logic (JWT, login, register)
- `db.ts` - In-memory user database stub
- `api.ts` - Express-like router for endpoints

## Expected Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Create new user |
| POST | /auth/login | Authenticate and return JWT |
| GET | /users/:id | Get user profile (auth required) |
| PUT | /users/:id | Update user profile (auth required) |

## Success Criteria

- All endpoints functional
- JWT validation working
- Rate limiting triggered after 100 requests
- Logging output in JSON format
- No external dependencies required
