import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-4"
    >
      {/* Home */}
      <Link
        to="/dashboard"
        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300 font-medium"
      >
        <Home size={14} />
        Home
      </Link>

      {parts.map((part, i) => {
        const path = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-gray-400 dark:text-slate-500" />

            {isLast ? (
              <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-semibold capitalize">
                {part.replace("-", " ")}
              </span>
            ) : (
              <Link
                to={path}
                className="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors capitalize"
              >
                {part.replace("-", " ")}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
