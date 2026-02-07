import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  FolderKanban,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/* -------------------- STAT CARD -------------------- */

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
        {value}
      </h3>
      <p className="mt-2 text-sm text-emerald-500 flex items-center gap-1">
        <TrendingUp size={14} /> {trend}
      </p>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

/* -------------------- DASHBOARD -------------------- */

export default function Dashboard() {
  
  const [isDarkMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);

  /* 🔥 REAL DARK MODE LOGIC */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, ticketsRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tickets/all")
        ]);

        setProjects(projectsRes.data);
        setTickets(ticketsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  const totalProjects = projects.length;

  const todoCount = tickets.filter(t => t.status === "todo").length;
  const inProgressCount = tickets.filter(t => t.status === "in-progress").length;
  const doneCount = tickets.filter(t => t.status === "done").length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        {/* ---------------- HEADER ---------------- */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Overview of your workspace
            </p>
          </div>
        </header>

        {/* ---------------- CONTENT ---------------- */}
        <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* DATE + ACTION */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <Calendar size={18} />
              {new Date().toLocaleDateString()}
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              New Project
            </button>
          </div>

          {/* INFO CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {user?.name || "User"} 👋
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Here’s a quick overview of your projects and tickets. Everything you need to stay organized is right here.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={totalProjects}
              trend=""
              icon={FolderKanban}
              color="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
            />

            <StatCard
              title="Todo Tickets"
              value={todoCount}
              trend=""
              icon={Clock}
              color="bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
            />

            <StatCard
              title="In Progress"
              value={inProgressCount}
              trend=""
              icon={TrendingUp}
              color="bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
            />

            <StatCard
              title="Done"
              value={doneCount}
              trend=""
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
            />
          </div>

          {/* OVERALL PROGRESS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Ticket Progress
            </h3>

            <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width: `${
                    tickets.length ? (doneCount / tickets.length) * 100 : 0
                  }%`
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mt-2">
              <span>Done: {doneCount}</span>
              <span>Total: {tickets.length}</span>
            </div>
          </div>

          {/* QUICK OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
              <p className="text-sm text-gray-500 dark:text-slate-400">Tickets Created</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {tickets.length}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Across all projects</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
              <p className="text-sm text-gray-500 dark:text-slate-400">Active Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {todoCount + inProgressCount}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Needs attention</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
              <p className="text-sm text-gray-500 dark:text-slate-400">Completion Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {tickets.length
                  ? Math.round((doneCount / tickets.length) * 100)
                  : 0}
                %
              </h3>
              <p className="text-xs text-gray-400 mt-1">Overall progress</p>
            </div>
          </div>

          {/* RECENT TICKETS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recent Tickets
            </h3>

            {tickets.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                No tickets created yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {tickets.slice(0, 5).map(ticket => (
                  <li
                    key={ticket._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Status: {ticket.status}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium
                        ${
                          ticket.status === "todo"
                            ? "bg-blue-100 text-blue-600"
                            : ticket.status === "in-progress"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                    >
                      {ticket.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
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
