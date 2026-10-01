
class BusinessError(Exception):
    """
    Base exception for business-level errors.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class AuthenticationError(Exception):
    """
    Raised when authentication fails.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

