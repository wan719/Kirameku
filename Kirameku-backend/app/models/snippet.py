from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Snippet(SQLModel, table=True):
    __tablename__ = "snippet"

    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(max_length=500)
    category: str = Field(default="生活", max_length=10)
    status: str = Field(default="draft", max_length=20, index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
