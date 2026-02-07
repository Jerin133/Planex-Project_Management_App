import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderKanban, ChevronDown } from "lucide-react";
import { fetchProjects } from "../api/projects";

export default function ProjectSelector() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const currentProject = projects.find(p => p._id === projectId);

  return (
    <div className="relative w-72">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-xl border bg-white dark:bg-slate-900 hover:shadow-sm transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <FolderKanban size={18} className="text-indigo-600" />
          </div>

          <div className="text-left">
            <p className="text-xs text-gray-400">Project</p>
            <p className="font-medium text-sm truncate">
              {currentProject?.name || "Select project"}
            </p>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 rounded-xl border shadow-lg overflow-hidden">
          {projects.map(p => (
            <button
              key={p._id}
              onClick={() => {
                navigate(`/projects/${p._id}`);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 dark:hover:bg-slate-800 ${
                p._id === projectId
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : ""
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
