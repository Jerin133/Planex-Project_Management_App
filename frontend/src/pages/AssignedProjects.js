import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { FolderKanban, Search } from "lucide-react";
import { fetchAssignedProjects } from "../api/projects";

export default function AssignedProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedProjects().then(setProjects);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold dark:text-white">
          Assigned Projects
        </h1>

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

        {projects.length === 0 ? (
          <p className="text-gray-500">
            No projects assigned to you yet
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <div
                key={p._id}
                onClick={() =>
                navigate(`/projects/${p._id}`, {
                    state: { assignedOnly: true }
                })
                }
                className="cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FolderKanban />
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {p.key}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                  {p.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
