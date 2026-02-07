import { useEffect, useMemo, useState } from "react";
import { fetchProjects } from "../api/projects";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { FolderKanban, Search } from "lucide-react";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Projects({ onCreateProject }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { user } = useContext(AuthContext);
  const [projectDesc, setProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  /* 🔍 SEARCH FILTER */
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p?.name.toLowerCase().includes(search.toLowerCase()) ||
        p?.key.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* ---------- HEADER ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Browse and manage all your projects
            </p>
          </div>

          <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              New Project
            </button>
          </div>

        {/* ---------- SEARCH ---------- */}
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search projects by name or key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* ---------- PROJECT GRID ---------- */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-slate-400">
            No projects found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(
              (p) =>
                p && (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/projects/${p._id}`)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <FolderKanban size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {p.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            Project Key: {p.key}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                        {p.key}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                      {p.description || "No description provided"}
                    </p>
                  </div>
                )
            )}
          </div>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCreateOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Create Project
            </h3>

            {/* Project Name */}
            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="h-px bg-gray-100 dark:bg-slate-700 mb-4" />

            <div className="flex items-center justify-between gap-4 mb-4 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700">
              {/* Project Key */}
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-slate-500">
                  Project Key
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Auto-generated
                </span>
              </div>

              {/* Owner */}
              <div className="flex flex-col text-right">
                <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-slate-500">
                  Owner
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  {user?.name}
                </span>
              </div>
            </div>

            {/* Description */}
            <textarea
              placeholder="Project description (optional)"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              rows={3}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                disabled={!projectName || creating}
                onClick={async () => {
                  try {
                    setCreating(true);

                    const res = await api.post("/projects", {
                      name: projectName,
                      description: projectDesc
                    });

                    // 🔥 Update dashboard instantly (Jira-style)
                    setProjects(prev => [res.data, ...prev]);

                    // Reset + close
                    setProjectName("");
                    setProjectDesc("");
                    setIsCreateOpen(false);
                  } catch (err) {
                    console.error("Failed to create project", err);
                  } finally {
                    setCreating(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
