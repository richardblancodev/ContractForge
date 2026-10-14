from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date
from typing import Optional

class ClientInfo(BaseModel):
    """
    Validates client identification and contact metadata.
    """
    full_name: str = Field(..., min_length=2, max_length=100, example="Jane Doe")
    email: EmailStr = Field(..., example="jane.doe@example.com")
    company_name: Optional[str] = Field(None, example="Acme Corporation")
    tax_id: str = Field(..., min_length=5, max_length=30, example="US-987654321")
    address: str = Field(..., min_length=5, max_length=200, example="123 Tech Boulevard, Suite 400, Austin, TX")

class ServiceProviderInfo(BaseModel):
    """
    Validates service provider identification metadata.
    """
    full_name: str = Field(..., min_length=2, max_length=100, example="Richard Blanco")
    email: EmailStr = Field(..., example="richard@developer.io")
    company_name: str = Field(..., example="Blanco Tech Solutions")
    tax_id: str = Field(..., min_length=5, max_length=30, example="US-123456789")
    address: str = Field(..., min_length=5, max_length=200, example="742 Evergreen Terrace, Springfield, OR")

class ContractDetails(BaseModel):
    """
    Validates core financial, temporal, and descriptive contract data.
    """
    contract_title: str = Field(..., min_length=3, max_length=120, example="Software Engineering Services Agreement")
    effective_date: date = Field(..., example="2026-11-01")
    expiration_date: date = Field(..., example="2027-11-01")
    service_description: str = Field(..., min_length=20, max_length=2000, example="Provision of Full Stack Web Development using React and FastAPI.")
    total_amount: float = Field(..., gt=0, example=12500.00)
    currency: str = Field("USD", min_length=3, max_length=3, example="USD")
    payment_terms: str = Field(..., min_length=5, max_length=300, example="50% upfront deposit upon signing, 50% upon final production release.")

    @field_validator("expiration_date")
    def validate_dates(cls, v: date, values):
        if "effective_date" in values.data and v <= values.data["effective_date"]:
            raise ValueError("Expiration date must strictly occur after the effective date.")
        return v

class ContractRequest(BaseModel):
    """
    Master request payload structure combining client, provider, and contract details.
    """
    client: ClientInfo
    provider: ServiceProviderInfo
    contract: ContractDetails