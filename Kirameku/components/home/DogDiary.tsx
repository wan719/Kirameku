"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Snippet = { id: number; content: string; category: string };
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function loadSnippets(): Promise<Snippet[]> {
  const res = await fetch(`${API}/api/snippets`, { cache: "no-store" });
  if (!res.ok) throw new Error("加载失败");
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error("数据格式错误");
  return data as Snippet[];
}

export default function DogDiary() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [current, setCurrent] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await loadSnippets();
      setSnippets(data);
      setCurrent(data.length ? data[Math.floor(Math.random() * data.length)] : null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSnippet = () => {
    if (error || snippets.length < 2) return fetchSnippets();
    const others = snippets.filter((item) => item.id !== current?.id);
    setCurrent(others[Math.floor(Math.random() * others.length)]);
  };

  useEffect(() => {
    let active = true;
    loadSnippets()
      .then((data) => {
        if (!active) return;
        setSnippets(data);
        setCurrent(data.length ? data[Math.floor(Math.random() * data.length)] : null);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const displayText = error
    ? "加载失败，点击刷新重试"
    : current?.content ?? "这里还没有碎片，过阵子再来看看";

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="w-full h-[160px] md:h-[220px] rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-3 md:p-6 flex flex-col justify-between transition-all duration-700 hover:scale-[1.01] cursor-pointer group overflow-hidden"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-pink-500 dark:text-pink-400 tracking-widest uppercase bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-sm shadow-sm">
              wan 的碎片
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSnippet();
              }}
              title={snippets.length < 2 ? "刷新" : "换一条"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-5 transition-colors duration-700">
            {loading ? "加载中..." : displayText}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 self-end">
          {current ? `${current.category} · 点击查看全文` : ""}
        </p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-card p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  wan 的碎片
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  title="关闭"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
                {loading ? "加载中..." : displayText}
              </p>
              <button
                type="button"
                onClick={nextSnippet}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                {loading ? "加载中..." : error ? "重试" : snippets.length < 2 ? "刷新" : "换一条"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
