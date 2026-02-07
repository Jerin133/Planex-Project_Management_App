import {
  DndContext,
  closestCorners,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import Comments from "./Comments";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" }
];

function Column({ column, tickets, onEdit, onDelete }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 min-h-[420px] min-w-[300px] md:min-w-0 border dark:border-slate-800"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-50 dark:bg-slate-900 z-10">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          {column.title}
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
          {tickets.length}
        </span>
      </div>

      <SortableContext
        items={tickets.map(t => t._id)}
        strategy={verticalListSortingStrategy}
      >
        {tickets.map(ticket => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </div>
  );
}

function TicketCard({ ticket, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: ticket._id,
      animateLayoutChanges: () => false
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white dark:bg-slate-800 p-4 mb-3 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 cursor-grab active:cursor-grabbing transition"
    >
      {/* Title */}
      <p className="font-medium text-gray-900 dark:text-white mb-1">
        {ticket.title}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs mb-3">
        <span
          className={`px-2 py-1 rounded-full font-medium ${priorityColor[ticket.priority]}`}
        >
          {ticket.priority}
        </span>

        {ticket.assignee && (
          <span className="text-gray-500 dark:text-slate-400 truncate">
            @{ticket.assignee.name}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 text-xs opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(ticket);
          }}
          className="text-indigo-600 hover:underline"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ticket._id);
          }}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>

      {/* Comments */}
      <div className="mt-3 border-t pt-3 dark:border-slate-700">
        <Comments ticketId={ticket._id} />
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tickets,
  onDragEnd,
  onEdit,
  onDelete
}) {
    const [activeTicket, setActiveTicket] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
            distance: 8 // 👈 REQUIRED for mobile
            }
        })
        );
  return (
    <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => {
            const ticket = tickets.find(t => t._id === event.active.id);
            setActiveTicket(ticket);
        }}
        onDragEnd={(event) => {
            setActiveTicket(null);
            onDragEnd(event);
        }}
        onDragCancel={() => setActiveTicket(null)}
    >
      <div className="relative">
        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <Column
            key={col.id}
            column={col}
            tickets={tickets.filter(t => t.status === col.id)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      </div>
      <DragOverlay>
        {activeTicket && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl w-64 border">
            <p className="font-medium">{activeTicket.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              Priority: {activeTicket.priority}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
