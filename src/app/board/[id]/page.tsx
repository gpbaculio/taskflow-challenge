"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit2,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";

type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
  color?: string;
  tasks: Task[];
}

export default function BoardDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Sorting and Filtering
  const [sortBy, setSortBy] = useState<"created" | "priority">("created");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchBoard = useCallback(async () => {
    try {
      const res = await fetch(`/api/boards/${id}`);
      if (!res.ok) {
        throw new Error(`Board not found (Status: ${res.status})`);
      }
      const data = await res.json();
      setBoard(data);
    } catch (error) {
      console.error("Error fetching board:", error);
      // Only redirect if it's a 404, otherwise we might see a flash of redirect
      // For 500s, we'll just stay on the loading state or show nothing (board is null)
      if (error instanceof Error && error.message.includes("404")) {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, boardId: id }),
      });
      if (res.ok) {
        const task = await res.json();
        setBoard((prev) =>
          prev ? { ...prev, tasks: [task, ...prev.tasks] } : null,
        );
        setIsModalOpen(false);
        setNewTask({
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                tasks: prev.tasks.map((t) =>
                  t.id === taskId
                    ? { ...t, status: newStatus as TaskStatus }
                    : t,
                ),
              }
            : null,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (taskId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });
      if (res.ok) {
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                tasks: prev.tasks.map((t) =>
                  t.id === taskId ? { ...t, title: editTitle } : t,
                ),
              }
            : null,
        );
        setEditingTaskId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                tasks: prev.tasks.filter((t) => t.id !== taskId),
              }
            : null,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-blue-500/10 text-blue-400" },
    {
      id: "in_progress",
      title: "In Progress",
      color: "bg-amber-500/10 text-amber-400",
    },
    { id: "done", title: "Done", color: "bg-emerald-500/10 text-emerald-400" },
  ];

  if (isLoading)
    return (
      <div className="text-center py-20 animate-pulse text-zinc-500">
        Loading board...
      </div>
    );
  if (!board) return null;

  const filteredTasks = board.tasks
    .filter((t) => filterStatus === "all" || t.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "created")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-zinc-500 hover:text-white transition-colors mb-4 group"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-2">
            {board.color && (
              <div
                className="w-4 h-12 rounded-full"
                style={{ backgroundColor: board.color }}
              />
            )}
            <h1
              className="text-5xl font-extrabold tracking-tighter"
              style={{ color: board.color || "white" }}
            >
              {board.name}
            </h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            {board.description || "Project workspace"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-white/5">
            <Filter size={16} className="text-zinc-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-sm focus:ring-0 outline-none text-zinc-300"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-white/5">
            <ArrowUpDown size={16} className="text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "created" | "priority")
              }
              className="bg-transparent border-none text-sm focus:ring-0 outline-none text-zinc-300"
            >
              <option value="created">Newest First</option>
              <option value="priority">High Priority</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 font-medium"
          >
            <Plus size={20} />
            Create Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${col.id === "todo" ? "bg-blue-400" : col.id === "in_progress" ? "bg-amber-400" : "bg-emerald-400"}`}
                />
                <h2 className="font-semibold text-zinc-300">{col.title}</h2>
                <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
                  {filteredTasks.filter((t) => t.status === col.id).length}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-h-[500px] p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              {filteredTasks
                .filter((t) => t.status === col.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="group glass p-4 rounded-xl border border-white/5 transition-all hover:bg-white/[0.05] hover:border-white/10"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      {editingTaskId === task.id ? (
                        <input
                          autoFocus
                          className="flex-1 bg-zinc-800 border-none rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-violet-500"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => saveEdit(task.id)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && saveEdit(task.id)
                          }
                        />
                      ) : (
                        <h3 className="flex-1 font-medium text-zinc-100 group-hover:text-white transition-colors">
                          {task.title}
                        </h3>
                      )}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(task)}
                          className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 mb-4 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </div>

                      <div className="flex items-center gap-1">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value)
                          }
                          className="bg-zinc-800 text-[10px] uppercase font-bold text-zinc-400 border-none rounded-md px-2 py-1 focus:ring-0 cursor-pointer hover:bg-zinc-700 transition-colors"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
            <form onSubmit={createTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Task Title
                  </label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    placeholder="e.g. Design Login Flow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none"
                    placeholder="Details about this task..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value as TaskPriority,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
