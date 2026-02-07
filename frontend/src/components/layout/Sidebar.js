import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  X, 
  Box, 
  LogOut, 
  User, 
  Moon, 
  Sun,
  ChevronUp,
  Mail,
  ClipboardList
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// --- Profile Modal Component ---
// Pure component: Displays user details.
const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header Background - Compact h-20 height */}
        <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="px-6 pb-6 overflow-y-auto">
          {/* Avatar Section - Overlapping Header */}
          <div className="relative -mt-6 mb-6 flex justify-center sm:justify-start">
             <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-lg shrink-0 ring-4 ring-white/20 dark:ring-slate-800/20">
               <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                 {user?.name?.charAt(0) || "U"}
               </div>
             </div>
          </div>
          
          {/* User Details - Read Only */}
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || "User Name"}</h2>
            </div>

            <div className="space-y-4">
               {/* Email Field */}
               <div className="flex items-center gap-3 text-gray-700 dark:text-slate-300 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-transparent transition-colors">
                 <Mail size={18} className="text-indigo-500 shrink-0" />
                 <div className="flex-1">
                   <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Email</p>
                   <p className="text-sm font-medium break-all">{user?.email || "No email provided"}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sidebar Component ---
// Main export: Handles navigation, theme toggle, and profile popup.
export function Sidebar({ isOpen, onClose, isDarkMode, toggleTheme}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Active Link Styling
  const getLinkClass = ({ isActive }) => {
    return isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm border-l-4 border-indigo-600 dark:border-indigo-500"
      : "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white hover:pl-5";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleOpenProfile = () => {
    setIsProfileMenuOpen(false);
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <ProfileModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        user={user}
      />

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Click Outside Handler for Dropdown */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 h-screen w-72 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 flex flex-col border-r border-gray-100 dark:border-slate-800 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:shadow-none
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 rounded-lg">
                   <Box size={24} className="text-indigo-600 dark:text-indigo-400 fill-indigo-600/20" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Planex</span>
            </div>
            
            <button
                onClick={onClose}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>
          
          <NavLink to="/dashboard" className={getLinkClass} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/projects"
            end
            className={getLinkClass}
            onClick={onClose}
          >
            <FolderKanban size={20} />
            <span>Projects</span>
          </NavLink>

          <NavLink to="/projects/assigned" className={getLinkClass} onClick={onClose}>
            <ClipboardList size={20} />
            <span>Assigned Projects</span>
          </NavLink>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 relative">
             {/* Popup Menu */}
             {isProfileMenuOpen && (
               <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-50 overflow-hidden transform origin-bottom animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <button 
                    onClick={handleOpenProfile}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors"
                  >
                     <User size={18} className="text-gray-400" />
                     View Profile
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors"
                  >
                     {isDarkMode ? (
                        <Sun size={18} className="text-orange-500" />
                     ) : (
                        <Moon size={18} className="text-indigo-500" />
                     )}
                     <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                  
                  <div className="h-px bg-gray-100 dark:bg-slate-700 my-1" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
                  >
                     <LogOut size={18} />
                     Sign Out
                  </button>
               </div>
             )}

             {/* Trigger Button */}
             <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border text-left relative z-40
                  ${isProfileMenuOpen 
                    ? 'bg-white dark:bg-slate-800 shadow-md border-gray-100 dark:border-slate-700' 
                    : 'hover:bg-white dark:hover:bg-slate-800 hover:shadow-md border-transparent hover:border-gray-100 dark:hover:border-slate-700'}
                `}
             >
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-700 shrink-0">
                     {user?.name?.charAt(0) || "U"}
                 </div>
                 <div className="flex-1 overflow-hidden">
                     <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "User"}</h4>
                     <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email || "email@example.com"}</p>
                 </div>
                 <ChevronUp 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                 />
             </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
