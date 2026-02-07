import { Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
      <button
        onClick={onMenuClick}
        className="p-2 rounded hover:bg-gray-700"
        >
        <Menu size={24} />
        </button>
      <span className="font-semibold">Jira Clone</span>
    </header>
  );
}
