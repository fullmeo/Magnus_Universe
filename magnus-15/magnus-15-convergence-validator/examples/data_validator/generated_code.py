"""
CANONICAL EXAMPLE 2: Data Validator
Expected: CONVERGED (88+)
Message: "Well-structured utility—every function validates a constraint"
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum


class ValidationError(Exception):
    """Base validation error"""
    pass


class FieldType(Enum):
    """Supported field types"""
    STRING = "string"
    EMAIL = "email"
    NUMBER = "number"
    BOOLEAN = "boolean"
    DATE = "date"


@dataclass
class FieldSchema:
    """Field definition"""
    name: str
    field_type: FieldType
    required: bool = True
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    pattern: Optional[str] = None


class FieldValidator:
    """Validate individual fields"""
    
    @staticmethod
    def validate_string(value: Any, schema: FieldSchema) -> str:
        """Validate string field"""
        if not isinstance(value, str):
            raise ValidationError(f"{schema.name} must be string")
        
        if schema.required and len(value.strip()) == 0:
            raise ValidationError(f"{schema.name} cannot be empty")
        
        if schema.min_length and len(value) < schema.min_length:
            raise ValidationError(f"{schema.name} minimum length {schema.min_length}")
        
        if schema.max_length and len(value) > schema.max_length:
            raise ValidationError(f"{schema.name} maximum length {schema.max_length}")
        
        return value
    
    @staticmethod
    def validate_email(value: Any, schema: FieldSchema) -> str:
        """Validate email field"""
        if not isinstance(value, str):
            raise ValidationError(f"{schema.name} must be string")
        
        if '@' not in value or '.' not in value.split('@')[1]:
            raise ValidationError(f"{schema.name} invalid email format")
        
        return value
    
    @staticmethod
    def validate_number(value: Any, schema: FieldSchema) -> float:
        """Validate number field"""
        try:
            num = float(value)
        except (ValueError, TypeError):
            raise ValidationError(f"{schema.name} must be number")
        
        return num
    
    @staticmethod
    def validate_boolean(value: Any, schema: FieldSchema) -> bool:
        """Validate boolean field"""
        if isinstance(value, bool):
            return value
        
        if isinstance(value, str):
            if value.lower() in ('true', 'yes', '1'):
                return True
            elif value.lower() in ('false', 'no', '0'):
                return False
        
        raise ValidationError(f"{schema.name} must be boolean")


class RecordValidator:
    """Validate entire records"""
    
    def __init__(self, schema: List[FieldSchema]):
        self.schema = {field.name: field for field in schema}
    
    def validate_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Validate complete record"""
        validated = {}
        
        for field_name, field_schema in self.schema.items():
            if field_name not in record:
                if field_schema.required:
                    raise ValidationError(f"Missing required field: {field_name}")
                continue
            
            value = record[field_name]
            
            if field_schema.field_type == FieldType.STRING:
                validated[field_name] = FieldValidator.validate_string(value, field_schema)
            
            elif field_schema.field_type == FieldType.EMAIL:
                validated[field_name] = FieldValidator.validate_email(value, field_schema)
            
            elif field_schema.field_type == FieldType.NUMBER:
                validated[field_name] = FieldValidator.validate_number(value, field_schema)
            
            elif field_schema.field_type == FieldType.BOOLEAN:
                validated[field_name] = FieldValidator.validate_boolean(value, field_schema)
            
            else:
                raise ValidationError(f"Unknown field type: {field_schema.field_type}")
        
        return validated
    
    def validate_batch(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Validate multiple records"""
        validated_records = []
        
        for record in records:
            try:
                validated = self.validate_record(record)
                validated_records.append(validated)
            except ValidationError as e:
                raise ValidationError(f"Record validation failed: {e}")
        
        return validated_records


class ValidationReport:
    """Generate validation report"""
    
    def __init__(self, validator: RecordValidator):
        self.validator = validator
    
    def report_schema(self) -> Dict[str, Any]:
        """Report schema"""
        return {
            "fields": [
                {
                    "name": field.name,
                    "type": field.field_type.value,
                    "required": field.required
                }
                for field in self.validator.schema.values()
            ]
        }
    
    def report_validation(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Report validation results"""
        try:
            validated = self.validator.validate_batch(records)
            return {
                "status": "success",
                "records_processed": len(validated),
                "records": validated
            }
        except ValidationError as e:
            return {
                "status": "error",
                "error": str(e)
            }


# ====================== USAGE ======================

if __name__ == "__main__":
    # Define schema
    schema = [
        FieldSchema(
            name="id",
            field_type=FieldType.NUMBER,
            required=True
        ),
        FieldSchema(
            name="name",
            field_type=FieldType.STRING,
            required=True,
            min_length=1,
            max_length=100
        ),
        FieldSchema(
            name="email",
            field_type=FieldType.EMAIL,
            required=True
        ),
        FieldSchema(
            name="active",
            field_type=FieldType.BOOLEAN,
            required=False
        ),
    ]
    
    # Create validator
    validator = RecordValidator(schema)
    
    # Test data
    records = [
        {
            "id": 1,
            "name": "Alice",
            "email": "alice@example.com",
            "active": True
        },
        {
            "id": 2,
            "name": "Bob",
            "email": "bob@example.com",
            "active": False
        }
    ]
    
    # Validate
    reporter = ValidationReport(validator)
    result = reporter.report_validation(records)
    print("Validation result:", result)
