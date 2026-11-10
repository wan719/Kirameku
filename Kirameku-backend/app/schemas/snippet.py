from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


Category = Literal["游戏", "生活", "随记"]
Status = Literal["draft", "published"]


class SnippetCreate(BaseModel):
    content: str = Field(min_length=1, max_length=500)
    category: Category = "生活"
    status: Status = "draft"

    @field_validator("content")
    @classmethod
    def nonblank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("内容不能为空")
        return value


class SnippetUpdate(BaseModel):
    content: str | None = Field(default=None, min_length=1, max_length=500)
    category: Category | None = None
    status: Status | None = None

    @model_validator(mode="before")
    @classmethod
    def reject_explicit_null(cls, data):
        if isinstance(data, dict) and any(
            key in data and data[key] is None for key in ("content", "category", "status")
        ):
            raise ValueError("更新字段不能为 null")
        return data

    @field_validator("content")
    @classmethod
    def nonblank(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("内容不能为空")
        return value


class SnippetOut(BaseModel):
    id: int
    content: str
    category: Category
    status: Status
    created_at: datetime
    updated_at: datetime
