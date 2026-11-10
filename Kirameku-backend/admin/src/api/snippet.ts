import { http } from "@/utils/http";

export type SnippetCategory = "游戏" | "生活" | "随记";
export type SnippetStatus = "draft" | "published";
export type SnippetItem = {
  id: number;
  content: string;
  category: SnippetCategory;
  status: SnippetStatus;
  created_at: string;
  updated_at: string;
};
export type SnippetInput = {
  content: string;
  category: SnippetCategory;
  status: SnippetStatus;
};

export const getSnippets = () =>
  http.request<SnippetItem[]>("get", "/api/snippets/admin");
export const createSnippet = (data: SnippetInput) =>
  http.request<SnippetItem>("post", "/api/snippets", { data });
export const updateSnippet = (id: number, data: Partial<SnippetInput>) =>
  http.request<SnippetItem>("put", `/api/snippets/${id}`, { data });
export const deleteSnippet = (id: number) =>
  http.request<{ ok: boolean }>("delete", `/api/snippets/${id}`);
