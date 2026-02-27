# Data Validator

## Explicit Requirements (MUST)
- must validate string fields
- must validate email format
- must validate number fields
- must validate boolean fields
- must raise ValidationError on invalid data
- must support required/optional fields
- must validate field length constraints
- must batch validate multiple records

## Implicit Preferences (SHOULD)
- should use dataclasses for schema definition
- should separate field validation from record validation
- should have clear error messages
- should support schema reporting
