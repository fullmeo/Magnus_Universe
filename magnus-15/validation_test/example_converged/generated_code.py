"""
Simple Calculator - Minimal Implementation
Expected: CONVERGED (90+)
"""

def add(a: float, b: float) -> float:
    """Add two numbers"""
    return a + b

def subtract(a: float, b: float) -> float:
    """Subtract two numbers"""
    return a - b

def multiply(a: float, b: float) -> float:
    """Multiply two numbers"""
    return a * b

def divide(a: float, b: float) -> float:
    """Divide two numbers"""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


if __name__ == "__main__":
    print("Add:", add(10, 5))
    print("Subtract:", subtract(10, 5))
    print("Multiply:", multiply(10, 5))
    print("Divide:", divide(10, 5))
