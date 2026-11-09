from pydantic import BaseModel, Field


class CredentialUpsert(BaseModel):
    credential: str = Field(min_length=1, max_length=16_384)
    account_identifier: str | None = Field(default=None, max_length=255)


class IntegrationCredentialStatus(BaseModel):
    key: str
    status: str
    connected_account: str | None = None
    credential_configured: bool
