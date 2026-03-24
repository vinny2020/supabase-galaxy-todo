"use client";

import { useState } from "react";
import { Priority, Todo, TodoInsert } from "@/types/todo";

interface TodoFormProps {
  categories: string[];
  initialData?: Todo;
  onSubmit: (data: TodoInsert) => void;
  onCancel: () => void;
}

export default function TodoForm({ categories, initialData, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || "medium");
  const [category, setCategory] = useState(initialData?.category || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
      priority,
      category: category || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="galaxy-card p-5 mb-6 space-y-4">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="galaxy-input w-full text-lg"
        style={{ fontFamily: "var(--font-display)" }}
        autoFocus
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="galaxy-input w-full resize-none"
        rows={2}
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--color-galaxy-lavender)" }}>
            Due date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="galaxy-input w-full"
          />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--color-galaxy-lavender)" }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="galaxy-input w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--color-galaxy-lavender)" }}>
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="galaxy-input w-full"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="galaxy-btn flex-1">
          {initialData ? "Update" : "Add"} Todo
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg transition-all"
          style={{
            background: "transparent",
            color: "var(--color-galaxy-lavender)",
            border: "1px solid var(--color-galaxy-border)",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
