"""
CANONICAL EXAMPLE 4: Incomplete Implementation
Expected: NON_CONVERGED (45-55)
Message: "Intent not fully addressed—major constraints missing from code"
"""

from typing import Dict, List, Any


class DataProcessor:
    """Process data (incomplete implementation)"""
    
    def __init__(self):
        self.data = []
    
    def load_data(self, records: List[Dict[str, Any]]) -> None:
        """Load data into processor"""
        self.data = records
    
    def process(self) -> List[Dict[str, Any]]:
        """Process data"""
        # INCOMPLETE: No filtering, transformation, or validation logic
        return self.data
    
    def count_records(self) -> int:
        """Count total records"""
        return len(self.data)


class ReportGenerator:
    """Generate reports (incomplete)"""
    
    def __init__(self, processor: DataProcessor):
        self.processor = processor
    
    def generate(self) -> Dict[str, Any]:
        """Generate report"""
        # INCOMPLETE: No metrics, no aggregation, no formatting
        return {
            "total": self.processor.count_records()
        }


# ====================== USAGE ======================

if __name__ == "__main__":
    # Create processor
    processor = DataProcessor()
    
    # Load data
    records = [
        {"id": 1, "name": "Alice", "value": 100},
        {"id": 2, "name": "Bob", "value": 200},
    ]
    processor.load_data(records)
    
    # Generate report
    reporter = ReportGenerator(processor)
    result = reporter.generate()
    print("Report:", result)
