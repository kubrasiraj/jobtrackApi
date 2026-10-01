
from sqlalchemy.orm import Session

from app.core.exceptions import (
    AuthenticationError,
    BusinessError,
)
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class AuthService:
    # Handle authentication business logic.

    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register(
        self,
        user_data: UserCreate,
    ) -> User:
        # Check whether the email already exists.
        existing_user = self.repository.get_by_email(
            user_data.email
        )

        if existing_user:
            raise BusinessError(
                "Email is already registered."
            )

        # Hash the password before storing it.
        password_hash = hash_password(
            user_data.password
        )

        # Create the user with the hashed password.
        return self.repository.create(
            name=user_data.name,
            email=user_data.email,
            password_hash=password_hash,
        )

    def login(
        self,
        email: str,
        password: str,
    ) -> str:
        # Find the user by email.
        user = self.repository.get_by_email(email)

        if not user:
            raise AuthenticationError(
                "Invalid email or password."
            )

        # Check the provided password.
        password_valid = verify_password(
            password,
            user.password_hash,
        )

        if not password_valid:
            raise AuthenticationError(
                "Invalid email or password."
            )

        # Create an access token for the user.
        return create_access_token(user.id)
