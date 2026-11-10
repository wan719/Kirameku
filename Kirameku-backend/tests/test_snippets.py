import unittest

from fastapi import HTTPException
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.pool import StaticPool

from app.models.snippet import Snippet
from app.schemas.snippet import SnippetCreate, SnippetUpdate
from app.services import snippet_service
from app.api.snippets import router
from app.deps import get_current_user, get_session


class SnippetTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        SQLModel.metadata.create_all(self.engine, tables=[Snippet.__table__])
        self.session = Session(self.engine)

    def tearDown(self):
        self.session.close()
        self.engine.dispose()

    def test_draft_is_hidden_until_published_and_hidden_after_unpublish(self):
        item = snippet_service.create_snippet(
            self.session, SnippetCreate(content="今晚的排位：技术很稳定，分数不稳定。", category="游戏")
        )
        self.assertEqual(item.status, "draft")
        self.assertEqual(snippet_service.list_snippets(self.session), [])
        self.assertEqual(len(snippet_service.list_snippets(self.session, False)), 1)
        snippet_service.update_snippet(self.session, item.id, SnippetUpdate(status="published"))
        self.assertEqual([x.id for x in snippet_service.list_snippets(self.session)], [item.id])
        snippet_service.update_snippet(self.session, item.id, SnippetUpdate(status="draft"))
        self.assertEqual(snippet_service.list_snippets(self.session), [])

    def test_validation_and_missing_ids(self):
        for payload in ({"content": "   "}, {"content": "x" * 501},
                        {"content": "ok", "category": "其他"},
                        {"content": "ok", "status": "hidden"}):
            with self.assertRaises(ValidationError):
                SnippetCreate(**payload)
        with self.assertRaises(ValidationError):
            SnippetUpdate(content="   ")
        for field in ("content", "category", "status"):
            with self.assertRaises(ValidationError):
                SnippetUpdate(**{field: None})
        with self.assertRaises(HTTPException) as update_error:
            snippet_service.update_snippet(self.session, 999, SnippetUpdate(content="hello"))
        self.assertEqual(update_error.exception.status_code, 404)
        with self.assertRaises(HTTPException) as delete_error:
            snippet_service.delete_snippet(self.session, 999)
        self.assertEqual(delete_error.exception.status_code, 404)

    def test_delete_removes_item(self):
        item = snippet_service.create_snippet(self.session, SnippetCreate(content="天气不错"))
        snippet_service.delete_snippet(self.session, item.id)
        self.assertEqual(snippet_service.list_snippets(self.session, False), [])

    def test_api_hides_drafts_and_requires_login_for_admin(self):
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_session] = lambda: self.session
        client = TestClient(app)
        self.assertIn(client.get("/api/snippets/admin").status_code, (401, 403))
        app.dependency_overrides[get_current_user] = lambda: {"sub": "test"}
        created = client.post("/api/snippets", json={"content": "hello", "category": "游戏"})
        self.assertEqual(created.status_code, 200)
        item_id = created.json()["id"]
        self.assertEqual(client.get("/api/snippets").json(), [])
        self.assertEqual(len(client.get("/api/snippets/admin").json()), 1)
        self.assertEqual(client.put(f"/api/snippets/{item_id}", json={"status": "published"}).status_code, 200)
        self.assertEqual(len(client.get("/api/snippets").json()), 1)
        self.assertEqual(client.put(f"/api/snippets/{item_id}", json={"status": None}).status_code, 422)


if __name__ == "__main__":
    unittest.main()
