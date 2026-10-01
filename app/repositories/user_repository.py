from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    # Create a new repository for user database operations.

    def __init__(self, db: Session):
        # Store the database session.
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        # Find one user by ID.
        return (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    def get_by_email(self, email: str) -> User | None:
        # Find one user by email.
        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

    def create(
        self,
        name: str,
        email: str,
        password_hash: str,
    ) -> User:
        # Create a new User object.
        user = User(
            name=name,
            email=email,
            password_hash=password_hash,
        )

        # Add the user to the database session.
        self.db.add(user)

        # Save the changes to the database.
        self.db.commit()

        # Get the generated ID and other database values.
        self.db.refresh(user)

        return user

    def delete(self, user: User) -> None:
        # Delete the user from the database.
        self.db.delete(user)

        # Save the deletion.
        self.db.commit()