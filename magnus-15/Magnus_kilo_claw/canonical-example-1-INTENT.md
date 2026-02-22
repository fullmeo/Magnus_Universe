# User Management REST API

## Explicit Requirements (MUST)
- must validate email format before creating user
- must validate name is not empty
- must create user with unique ID
- must handle validation errors gracefully
- must support retrieving user by ID
- must return JSON responses for all operations
- must handle missing users gracefully

## Implicit Preferences (SHOULD)
- should use dataclasses for models
- should separate validation logic from storage
- should have consistent error handling
- should include docstrings on public methods
