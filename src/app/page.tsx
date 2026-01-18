"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Layout } from "lucide-react";

interface Board {
  id: number;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#7c3aed"); // Default to violet

  const colors = [
    { name: "Violet", value: "#7c3aed" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Pink", value: "#ec4899" },
  ];

  const [error, setError] = useState<string | null>(null);

  const fetchBoards = async () => {
    try {
      setError(null);
      const res = await fetch("/api/boards");
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setBoards(data);
      } else {
        throw new Error("Invalid data format from server");
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError(
        "Failed to load dashboards. Please check your database connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, color: selectedColor }),
      });
      if (res.ok) {
        const newBoard = await res.json();
        setBoards([newBoard, ...boards]);
        setName("");
        setDescription("");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const deleteBoard = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure? This will delete all tasks in this board."))
      return;

    try {
      const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBoards(boards.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Boards</h1>
          <p className="text-zinc-400">
            Manage your projects and tasks with ease.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 font-medium"
        >
          <Plus size={20} />
          Create Board
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-red-500/20 bg-red-500/5 rounded-3xl p-8 text-center">
          <p className="text-red-400 font-medium mb-2">Something went wrong</p>
          <p className="text-zinc-500 text-sm max-w-md">{error}</p>
          <button
            onClick={() => fetchBoards()}
            className="mt-4 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-3xl">
          <Layout size={48} className="text-zinc-600 mb-4" />
          <p className="text-zinc-400">No boards yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group relative h-44 p-6 rounded-2xl glass transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => deleteBoard(e, board.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors">
                  {board.name}
                </h3>
                <p className="text-zinc-400 line-clamp-2 text-sm">
                  {board.description || "No description"}
                </p>
              </div>
              <div className="text-xs text-zinc-500">
                Created {new Date(board.createdAt).toLocaleDateString()}
              </div>
              <div
                className="absolute bottom-0 left-0 h-1 w-full opacity-20 group-hover:opacity-100 transition-opacity"
                style={{
                  background: board.color
                    ? `linear-gradient(90deg, ${board.color}, ${board.color}88)`
                    : "linear-gradient(45deg, #7c3aed, #db2777)",
                }}
              />
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Project Board</h2>
            <form onSubmit={createBoard}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Board Name
                  </label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none"
                    placeholder="What's this board about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2.5">
                    Theme Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === c.value
                            ? "scale-110 border-white shadow-lg shadow-white/10"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all font-medium"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
