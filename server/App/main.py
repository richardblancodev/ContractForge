from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from App.Core.config import settings
from App.Core.exceptions import validation_exception_handler, global_exception_handler
from App.schemas.contract import ContractRequest

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers binding
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint for container monitoring."""
    return {"status": "healthy", "version": settings.VERSION}

@app.post(
    f"{settings.API_V1_STR}/contracts/generate",
    response_class=Response,
    responses={
        200: {
            "content": {"application/pdf": {}},
            "description": "Returns generated PDF file stream directly."
        }
    },
    summary="Generate Contract PDF",
    tags=["Documents"]
)
async def generate_contract(payload: ContractRequest):
    """
    Receives validated client and contract payload, parses template,
    and returns printable binary PDF output.
    """
    from App.services.pdf_service import PDFService

    pdf_service = PDFService()
    pdf_bytes = pdf_service.generate_contract_pdf(payload)

    filename = f"Contract_{payload.client.full_name.replace(' ', '_')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )