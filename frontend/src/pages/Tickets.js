import { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

import { fetchTickets, createTicket } from "../api/tickets";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectSelector from "../components/ProjectSelector";
import KanbanBoard from "../components/KanbanBoard";
import EditTicketModal from "../components/EditTicketModal";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Tickets() {
  const { projectId } = useParams();
  const { user: loggedInUser } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);

  /* CREATE MODAL */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createPriority, setCreatePriority] = useState("medium");

  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [assigneeId, setAssigneeId] = useState(null);
  const [members, setMembers] = useState([]);

  const location = useLocation();
  const assignedOnly = location.state?.assignedOnly === true;

  /* FILTERS */
  const [status, setStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [search, setSearch] = useState("");

  /* FETCH TICKETS */
  useEffect(() => {
    if (!projectId || !loggedInUser?._id) return;

    fetchTickets(projectId, {
      status,
      priority: filterPriority,
      search,
      ...(assignedOnly ? { assignee: loggedInUser._id } : {})
    }).then(setTickets);
  }, [
    projectId,
    status,
    filterPriority,
    search,
    assignedOnly,
    loggedInUser?._id
  ]);

  /* FETCH PROJECT MEMBERS */
  useEffect(() => {
    if (!projectId || !loggedInUser) return;

    api.get(`/projects/${projectId}/members`).then(res => {
      setMembers(res.data);
      // no default assignee
    });
  }, [projectId, loggedInUser]);

  /* DRAG & DROP */
  const STATUS = ["todo", "in-progress", "done"];

  const onDragEnd = async ({ active, over }) => {
    if (!over) return;

    const ticketId = active.id;

    let newStatus = null;

    // Case 1: dropped on a column
    if (STATUS.includes(over.id)) {
      newStatus = over.id;
    }

    // Case 2: dropped on another ticket → inherit its status
    else {
      const targetTicket = tickets.find(t => t._id === over.id);
      newStatus = targetTicket?.status;
    }

    if (!newStatus) return;

    // Optimistic UI update
    setTickets(prev =>
      prev.map(t =>
        t._id === ticketId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
    } catch (err) {
      console.error("Update ticket failed", err);
    }
  };

  /* CREATE TICKET */
  const submit = async () => {
    if (!title.trim()) return;

    const ticket = await createTicket({
      title,
      description,
      priority: createPriority,
      projectId,
      assigneeEmail   // ✅ SEND EMAIL
    });

    setTickets(prev => [...prev, ticket]);

    setTitle("");
    setDescription("");
    setCreatePriority("medium");
    setAssigneeEmail("");
    setAssigneeId(null);
    setIsCreateOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignedOnly ? "My Assigned Tickets" : "Tickets"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {assignedOnly
                ? "Tickets assigned to you in this project"
                : "Manage and track work across your project"}
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Create Ticket
          </button>
        </div>

        {/* PROJECT SELECTOR */}
        <ProjectSelector />

        {/* FILTER BAR */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
            />
          </div>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* KANBAN */}
        <KanbanBoard
          tickets={tickets}
          onDragEnd={onDragEnd}
          onEdit={setEditingTicket}
          onDelete={async (ticketId) => {
            if (!window.confirm("Delete this ticket?")) return;
            await api.delete(`/tickets/${ticketId}`);
            setTickets(tickets.filter(t => t._id !== ticketId));
          }}
        />
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCreateOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border p-6">
            <h3 className="text-lg font-bold mb-4 dark:text-white">
              Create Ticket
            </h3>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ticket title"
              className="w-full mb-3 px-4 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
            />

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full mb-3 px-4 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
            />

            <label className="block text-sm font-medium mb-1">
                Priority
              </label>
            <select
              value={createPriority}
              onChange={e => setCreatePriority(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* ASSIGNEE */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Assignee
              </label>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter assignee email"
                  value={assigneeEmail}
                  onChange={(e) => {
                    const email = e.target.value;
                    setAssigneeEmail(email);

                    const matched = members.find(m => m.email === email);
                    setAssigneeId(matched?._id || null);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800"
                />

                <button
                  type="button"
                  onClick={() => {
                    setAssigneeEmail(loggedInUser.email);
                    setAssigneeId(loggedInUser._id);
                  }}
                  className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm"
                >
                  Assign to me
                </button>
              </div>
            </div>

            {/* REPORTER */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Reporter
              </label>
              <input
                value={loggedInUser?.email}
                disabled
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/70"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsCreateOpen(false)}>Cancel</button>
              <button
                onClick={submit}
                disabled={!title.trim()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onUpdated={(updated) =>
            setTickets(tickets.map(t =>
              t._id === updated._id ? updated : t
            ))
          }
        />
      )}
    </DashboardLayout>
  );
}
