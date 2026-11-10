from datetime import datetime

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models.snippet import Snippet
from app.schemas.snippet import SnippetCreate, SnippetUpdate


def list_snippets(session: Session, published_only: bool = True) -> list[Snippet]:
    query = select(Snippet)
    if published_only:
        query = query.where(Snippet.status == "published")
    return list(session.exec(query.order_by(Snippet.created_at.desc(), Snippet.id.desc())).all())


def create_snippet(session: Session, data: SnippetCreate) -> Snippet:
    snippet = Snippet(**data.model_dump())
    session.add(snippet)
    session.commit()
    session.refresh(snippet)
    return snippet


def update_snippet(session: Session, snippet_id: int, data: SnippetUpdate) -> Snippet:
    snippet = session.get(Snippet, snippet_id)
    if snippet is None:
        raise HTTPException(status_code=404, detail="碎片不存在")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(snippet, key, value)
    snippet.updated_at = datetime.now()
    session.add(snippet)
    session.commit()
    session.refresh(snippet)
    return snippet


def delete_snippet(session: Session, snippet_id: int) -> None:
    snippet = session.get(Snippet, snippet_id)
    if snippet is None:
        raise HTTPException(status_code=404, detail="碎片不存在")
    session.delete(snippet)
    session.commit()
