"""
CANONICAL EXAMPLE 3: Over-Engineered Calculator
Expected: PARTIAL (65-75)
Message: "Too much abstraction for simple task—5 classes for basic arithmetic"
"""

from abc import ABC, abstractmethod
from typing import Protocol, Callable, Any
from functools import wraps
from enum import Enum


class Operation(Enum):
    """Operation types"""
    ADD = "add"
    SUBTRACT = "subtract"
    MULTIPLY = "multiply"
    DIVIDE = "divide"


class NumberValidator(ABC):
    """Abstract validator for numbers"""
    
    @abstractmethod
    def validate(self, value: Any) -> bool:
        """Validate a number"""
        pass


class PositiveNumberValidator(NumberValidator):
    """Validates positive numbers"""
    
    def validate(self, value: Any) -> bool:
        try:
            return float(value) > 0
        except:
            return False


class NumericTypeValidator(NumberValidator):
    """Validates numeric types"""
    
    def validate(self, value: Any) -> bool:
        return isinstance(value, (int, float))


class CompositeValidator:
    """Composite validator combining multiple validators"""
    
    def __init__(self, validators: list[NumberValidator]):
        self.validators = validators
    
    def validate_all(self, value: Any) -> bool:
        """All validators must pass"""
        return all(v.validate(value) for v in self.validators)


class OperationStrategy(ABC):
    """Strategy pattern for operations"""
    
    @abstractmethod
    def execute(self, a: float, b: float) -> float:
        pass


class AddStrategy(OperationStrategy):
    """Addition strategy"""
    def execute(self, a: float, b: float) -> float:
        return a + b


class SubtractStrategy(OperationStrategy):
    """Subtraction strategy"""
    def execute(self, a: float, b: float) -> float:
        return a - b


class MultiplyStrategy(OperationStrategy):
    """Multiplication strategy"""
    def execute(self, a: float, b: float) -> float:
        return a * b


class DivideStrategy(OperationStrategy):
    """Division strategy"""
    def execute(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


class StrategyFactory:
    """Factory for operation strategies"""
    
    _strategies = {
        Operation.ADD: AddStrategy(),
        Operation.SUBTRACT: SubtractStrategy(),
        Operation.MULTIPLY: MultiplyStrategy(),
        Operation.DIVIDE: DivideStrategy(),
    }
    
    @classmethod
    def get_strategy(cls, operation: Operation) -> OperationStrategy:
        return cls._strategies.get(operation)


def logging_decorator(func: Callable) -> Callable:
    """Decorator for operation logging"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Executing {func.__name__} with args {args}")
        result = func(*args, **kwargs)
        print(f"Result: {result}")
        return result
    return wrapper


class Calculator:
    """Main calculator using strategy pattern"""
    
    def __init__(self):
        self.validator = CompositeValidator([
            NumericTypeValidator(),
            PositiveNumberValidator()
        ])
    
    @logging_decorator
    def calculate(self, a: float, b: float, operation: Operation) -> float:
        """Execute calculation with selected operation"""
        
        if not self.validator.validate_all(a):
            raise ValueError(f"Invalid first operand: {a}")
        if not self.validator.validate_all(b):
            raise ValueError(f"Invalid second operand: {b}")
        
        strategy = StrategyFactory.get_strategy(operation)
        if not strategy:
            raise ValueError(f"Unknown operation: {operation}")
        
        return strategy.execute(a, b)


class CalculatorAPI:
    """API interface"""
    
    def __init__(self, calculator: Calculator):
        self.calculator = calculator
    
    def add(self, a: float, b: float) -> dict:
        """Add two numbers"""
        try:
            result = self.calculator.calculate(a, b, Operation.ADD)
            return {"status": "success", "result": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def subtract(self, a: float, b: float) -> dict:
        """Subtract two numbers"""
        try:
            result = self.calculator.calculate(a, b, Operation.SUBTRACT)
            return {"status": "success", "result": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def multiply(self, a: float, b: float) -> dict:
        """Multiply two numbers"""
        try:
            result = self.calculator.calculate(a, b, Operation.MULTIPLY)
            return {"status": "success", "result": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def divide(self, a: float, b: float) -> dict:
        """Divide two numbers"""
        try:
            result = self.calculator.calculate(a, b, Operation.DIVIDE)
            return {"status": "success", "result": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}


# ====================== USAGE ======================

if __name__ == "__main__":
    calc = Calculator()
    api = CalculatorAPI(calc)
    
    # Test: Addition
    result = api.add(10, 5)
    print("Add:", result)
    
    # Test: Subtraction
    result = api.subtract(10, 5)
    print("Subtract:", result)
    
    # Test: Multiplication
    result = api.multiply(10, 5)
    print("Multiply:", result)
    
    # Test: Division
    result = api.divide(10, 5)
    print("Divide:", result)
