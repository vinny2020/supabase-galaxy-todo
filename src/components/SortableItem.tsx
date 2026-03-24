"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types/todo";

interface SortableItemProps {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCalendar: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "var(--color-galaxy-success)",
  medium: "var(--color-galaxy-warning)",
  high: "var(--color-galaxy-urgent)",
  urgent: "#d63031",
};

export default function SortableItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onAddToCalendar,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = PRIORITY_COLORS[todo.priority] || "var(--color-galaxy-lavender)";

  return (
    <div ref={setNodeRef} style={style} className="galaxy-card p-4 flex items-start gap-3">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing opacity-40 hover:opacity-100 transition-opacity"
        style={{ color: "var(--color-galaxy-lavender)", touchAction: "none" }}
        aria-label="Drag to reorder"
      >
        ⠿
      </button>

      {/* Checkbox */}
      <button onClick={onToggle} className="mt-1 flex-shrink-0">
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
          style={{
            borderColor: todo.completed ? "var(--color-galaxy-success)" : priorityColor,
            background: todo.completed ? "var(--color-galaxy-success)" : "transparent",
          }}
        >
          {todo.completed && <span className="text-white text-xs">✓</span>}
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="font-medium"
          style={{
            fontFamily: "var(--font-display)",
            color: todo.completed ? "var(--color-galaxy-lavender)" : "var(--color-galaxy-silver)",
            textDecoration: todo.completed ? "line-through" : "none",
            opacity: todo.completed ? 0.6 : 1,
          }}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-sm mt-1 opacity-60" style={{ color: "var(--color-galaxy-lavender)" }}>
            {todo.description}
          </p>
        )}
        <div className="flex gap-2 mt-2 flex-wrap items-center">
          {/* Priority badge */}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${priorityColor}22`, color: priorityColor }}
          >
            {todo.priority}
          </span>
          {/* Category badge */}
          {todo.category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--color-galaxy-cosmic)",
                color: "var(--color-galaxy-silver)",
              }}
            >
              {todo.category}
            </span>
          )}
          {/* Due date */}
          {todo.due_date && (
            <span className="text-xs opacity-50" style={{ color: "var(--color-galaxy-silver)" }}>
              📅 {new Date(todo.due_date + "T00:00:00").toLocaleDateString()}
            </span>
          )}
          {/* Calendar synced badge */}
          {todo.calendar_event_id && (
            <span className="text-xs opacity-50" style={{ color: "var(--color-galaxy-success)" }}>
              ✓ In calendar
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 flex-shrink-0">
        {todo.due_date && !todo.calendar_event_id && (
          <button
            onClick={onAddToCalendar}
            className="p-1.5 rounded-lg transition-all hover:scale-110 opacity-50 hover:opacity-100"
            title="Add to Google Calendar"
            style={{ color: "var(--color-galaxy-lavender)" }}
          >
            📆
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg transition-all hover:scale-110 opacity-50 hover:opacity-100"
          title="Edit"
          style={{ color: "var(--color-galaxy-lavender)" }}
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg transition-all hover:scale-110 opacity-50 hover:opacity-100"
          title="Delete"
          style={{ color: "var(--color-galaxy-urgent)" }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
