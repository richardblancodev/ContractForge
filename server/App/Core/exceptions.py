import logging

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger("uvicorn.error")


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Formats standard Pydantic validation errors into readable JSON feedback.
    """
    errors = []
    for error in exc.errors():
        field_path = " -> ".join(str(loc) for loc in error.get("loc", ("unknown",)))
        errors.append({
            "field": field_path,
            "message": error.get("msg", "Validation error"),
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Validation failed for incoming payload parameters.",
            "errors": errors,
        },
    )


async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches unhandled exceptions across application routes.
    """
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An unexpected error occurred while generating the document. Please verify inputs and try again.",
        },
    )