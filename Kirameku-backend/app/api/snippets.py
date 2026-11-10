from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.deps import get_current_user, get_session
from app.schemas.snippet import SnippetCreate, SnippetOut, SnippetUpdate
from app.services import snippet_service


router = APIRouter(prefix="/api/snippets", tags=["碎片"])


@router.get("", response_model=list[SnippetOut])
def list_published(session: Session = Depends(get_session)):
    return snippet_service.list_snippets(session)


@router.get("/admin", response_model=list[SnippetOut])
def list_all(session: Session = Depends(get_session), _: dict = Depends(get_current_user)):
    return snippet_service.list_snippets(session, published_only=False)


@router.post("", response_model=SnippetOut)
def create(data: SnippetCreate, session: Session = Depends(get_session), _: dict = Depends(get_current_user)):
    return snippet_service.create_snippet(session, data)


@router.put("/{snippet_id}", response_model=SnippetOut)
def update(snippet_id: int, data: SnippetUpdate, session: Session = Depends(get_session), _: dict = Depends(get_current_user)):
    return snippet_service.update_snippet(session, snippet_id, data)


@router.delete("/{snippet_id}")
def delete(snippet_id: int, session: Session = Depends(get_session), _: dict = Depends(get_current_user)):
    snippet_service.delete_snippet(session, snippet_id)
    return {"ok": True}
