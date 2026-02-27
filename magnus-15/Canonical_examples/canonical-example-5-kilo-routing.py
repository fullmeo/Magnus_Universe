"""
CANONICAL EXAMPLE 5: Kilo Claw Integration Pattern
Expected: CONVERGED (85+)
Message: "Production-ready Kilo code—agent routing with proper error handling"
"""

from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass
from enum import Enum


class ModelType(Enum):
    """Available model types"""
    CLAUDE_OPUS = "claude-opus-4.5"
    CLAUDE_SONNET = "claude-sonnet-4.5"
    GPT4 = "gpt-4"
    MISTRAL = "mistral-large"


class TaskPriority(Enum):
    """Task priority levels"""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class AgentTask:
    """Task for agent execution"""
    task_id: str
    prompt: str
    priority: TaskPriority
    model: ModelType
    max_tokens: int = 1024
    temperature: float = 0.7


class ModelRouter:
    """Route tasks to appropriate model based on priority and complexity"""
    
    def __init__(self):
        self.model_costs = {
            ModelType.CLAUDE_OPUS: 0.015,
            ModelType.CLAUDE_SONNET: 0.003,
            ModelType.GPT4: 0.02,
            ModelType.MISTRAL: 0.001,
        }
    
    def select_model(self, priority: TaskPriority, complexity: int) -> ModelType:
        """Select optimal model for task"""
        if priority == TaskPriority.CRITICAL or complexity > 8:
            return ModelType.CLAUDE_OPUS
        
        elif priority == TaskPriority.HIGH or complexity > 5:
            return ModelType.CLAUDE_SONNET
        
        elif complexity > 3:
            return ModelType.GPT4
        
        else:
            return ModelType.MISTRAL
    
    def estimate_cost(self, model: ModelType, tokens: int) -> float:
        """Estimate execution cost"""
        return self.model_costs[model] * tokens


class TaskQueue:
    """Queue and manage agent tasks"""
    
    def __init__(self, router: ModelRouter):
        self.router = router
        self.queue: List[AgentTask] = []
        self.completed: List[Dict[str, Any]] = []
    
    def enqueue(self, task: AgentTask) -> None:
        """Add task to queue"""
        self.queue.append(task)
        self.queue.sort(key=lambda t: t.priority.value, reverse=True)
    
    def dequeue(self) -> Optional[AgentTask]:
        """Get next task"""
        return self.queue.pop(0) if self.queue else None
    
    def process_task(self, task: AgentTask, executor: Callable) -> Dict[str, Any]:
        """Process single task"""
        try:
            result = executor(task)
            
            completed_record = {
                "task_id": task.task_id,
                "model": task.model.value,
                "status": "success",
                "result": result,
                "cost": self.router.estimate_cost(task.model, task.max_tokens)
            }
            
            self.completed.append(completed_record)
            return completed_record
        
        except Exception as e:
            error_record = {
                "task_id": task.task_id,
                "model": task.model.value,
                "status": "error",
                "error": str(e)
            }
            
            self.completed.append(error_record)
            return error_record
    
    def process_batch(self, executor: Callable) -> List[Dict[str, Any]]:
        """Process all tasks in queue"""
        results = []
        
        while self.queue:
            task = self.dequeue()
            if task:
                result = self.process_task(task, executor)
                results.append(result)
        
        return results
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get execution metrics"""
        successful = [r for r in self.completed if r["status"] == "success"]
        failed = [r for r in self.completed if r["status"] == "error"]
        
        total_cost = sum(r.get("cost", 0) for r in successful)
        
        return {
            "total_tasks": len(self.completed),
            "successful": len(successful),
            "failed": len(failed),
            "total_cost": total_cost,
            "avg_cost_per_task": total_cost / len(successful) if successful else 0
        }


class AgentOrchestrator:
    """Orchestrate agent execution across multiple models"""
    
    def __init__(self):
        self.router = ModelRouter()
        self.queue = TaskQueue(self.router)
    
    def add_task(self, task_id: str, prompt: str, priority: TaskPriority, complexity: int) -> None:
        """Add task to orchestrator"""
        model = self.router.select_model(priority, complexity)
        
        task = AgentTask(
            task_id=task_id,
            prompt=prompt,
            priority=priority,
            model=model,
            max_tokens=2048 if priority == TaskPriority.CRITICAL else 1024
        )
        
        self.queue.enqueue(task)
    
    def execute(self, executor: Callable) -> Dict[str, Any]:
        """Execute all tasks"""
        results = self.queue.process_batch(executor)
        metrics = self.queue.get_metrics()
        
        return {
            "results": results,
            "metrics": metrics
        }


# ====================== USAGE ======================

def mock_executor(task: AgentTask) -> str:
    """Mock executor for demonstration"""
    return f"Executed on {task.model.value}: {task.prompt[:50]}..."


if __name__ == "__main__":
    # Create orchestrator
    orchestrator = AgentOrchestrator()
    
    # Add tasks
    orchestrator.add_task(
        "task_1",
        "Analyze user behavior data",
        TaskPriority.HIGH,
        complexity=7
    )
    
    orchestrator.add_task(
        "task_2",
        "Generate summary",
        TaskPriority.LOW,
        complexity=2
    )
    
    orchestrator.add_task(
        "task_3",
        "Critical security analysis",
        TaskPriority.CRITICAL,
        complexity=9
    )
    
    # Execute
    result = orchestrator.execute(mock_executor)
    print("Execution result:", result)
