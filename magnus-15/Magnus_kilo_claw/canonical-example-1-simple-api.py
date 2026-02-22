"""
CANONICAL EXAMPLE 1: Simple REST API
Expected: CONVERGED (90+)
Message: "Clean, intentional code—every function serves the intent"
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    """User model"""
    id: int
    name: str
    email: str
    created_at: datetime


class UserValidator:
    """Validate user input before persistence"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email or '@' not in email:
            raise ValueError("Invalid email format")
        return True
    
    @staticmethod
    def validate_name(name: str) -> bool:
        """Validate name is not empty"""
        if not name or len(name.strip()) == 0:
            raise ValueError("Name cannot be empty")
        return True


class UserDatabase:
    """In-memory user storage"""
    
    def __init__(self):
        self.users: Dict[int, User] = {}
        self.next_id = 1
    
    def create_user(self, name: str, email: str) -> User:
        """Create and store a new user"""
        UserValidator.validate_name(name)
        UserValidator.validate_email(email)
        
        user = User(
            id=self.next_id,
            name=name,
            email=email,
            created_at=datetime.now()
        )
        self.users[self.next_id] = user
        self.next_id += 1
        return user
    
    def get_user(self, user_id: int) -> Optional[User]:
        """Retrieve user by ID"""
        return self.users.get(user_id)
    
    def list_users(self) -> List[User]:
        """List all users"""
        return list(self.users.values())


class UserAPI:
    """REST API interface for user management"""
    
    def __init__(self, db: UserDatabase):
        self.db = db
    
    def handle_create_user(self, name: str, email: str) -> Dict:
        """Handle user creation request"""
        try:
            user = self.db.create_user(name, email)
            return {
                "status": "success",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            }
        except ValueError as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def handle_get_user(self, user_id: int) -> Dict:
        """Handle user retrieval request"""
        try:
            user = self.db.get_user(user_id)
            if not user:
                return {
                    "status": "error",
                    "message": f"User {user_id} not found"
                }
            return {
                "status": "success",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def handle_list_users(self) -> Dict:
        """Handle list users request"""
        try:
            users = self.db.list_users()
            return {
                "status": "success",
                "users": [
                    {
                        "id": u.id,
                        "name": u.name,
                        "email": u.email
                    }
                    for u in users
                ]
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }


# ====================== USAGE ======================

if __name__ == "__main__":
    # Initialize components
    db = UserDatabase()
    api = UserAPI(db)
    
    # Test: Create user
    result = api.handle_create_user("Alice", "alice@example.com")
    print("Create user:", result)
    
    # Test: Get user
    result = api.handle_get_user(1)
    print("Get user:", result)
    
    # Test: List users
    result = api.handle_list_users()
    print("List users:", result)
    
    # Test: Invalid email
    result = api.handle_create_user("Bob", "invalid-email")
    print("Invalid email:", result)
