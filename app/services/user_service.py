
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessError
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:
    # Handle business logic related to users.

    def __init__(self, db: Session):
        # Create the user repository.
        self.repository = UserRepository(db)

    def get_user_by_id(self, user_id: int) -> User | None:
        # Get a user from the repository.
        return self.repository.get_by_id(user_id)

    def get_user_by_email(self, email: str) -> User | None:
        # Find a user by email.
        return self.repository.get_by_email(email)

    def create_user(
        self,
        user_data: UserCreate,
        password_hash: str,
    ) -> User:
        # Check if the email is already registered.
        existing_user = self.repository.get_by_email(
            user_data.email
        )

        if existing_user:
            raise BusinessError(
                "Email is already registered."
            )

        # Create the user through the repository.
        return self.repository.create(
            name=user_data.name,
            email=user_data.email,
            password_hash=password_hash,
        )

