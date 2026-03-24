"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { supabase } from "@/lib/supabase";
import { Todo, TodoInsert } from "@/types/todo";
import TodoForm from "./TodoForm";
import SortableItem from "./SortableItem";

const CATEGORIES = ["Work", "Personal", "Health", "Finance", "Learning"];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setTodos(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const addTodo = async (todo: TodoInsert) => {
    const maxOrder = todos.length > 0 ? Math.max(...todos.map((t) => t.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("todos")
      .insert({ ...todo, sort_order: maxOrder })
      .select()
      .single();
    if (!error && data) {
      setTodos((prev) => [...prev, data]);
      setShowForm(false);
    }
  };

  const updateTodo = async (id: string, updates: Partial<TodoInsert>) => {
    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setTodos((prev) => prev.map((t) => (t.id === id ? data : t)));
      setEditingTodo(null);
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed: !completed });
  };

  const addToCalendar = async (todo: Todo) => {
    if (!todo.due_date) return;
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description || "",
          dueDate: todo.due_date,
          priority: todo.priority,
          category: todo.category,
        }),
      });
      const result = await res.json();
      if (result.calendarUrl) {
        window.open(result.calendarUrl, "_blank");
      }
      if (result.eventId) {
        await updateTodo(todo.id, { calendar_event_id: result.eventId });
      }
    } catch (err) {
      console.error("Failed to add to calendar:", err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(todos, oldIndex, newIndex);
    setTodos(reordered);
    const updates = reordered.map((todo, i) => ({
      id: todo.id,
      sort_order: i,
    }));
    for (const u of updates) {
      await supabase.from("todos").update({ sort_order: u.sort_order }).eq("id", u.id);
    }
  };

  const filteredTodos = filterCategory
    ? todos.filter((t) => t.category === filterCategory)
    : todos;

  if (loading) {
    return (
      <div className="text-center py-20" style={{ color: "var(--color-galaxy-lavender)" }}>
        Loading your galaxy...
      </div>
    );
  }

  return (
    <div>
      {/* Category filter bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterCategory(null)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-all"
          style={{
            background: !filterCategory ? "var(--color-galaxy-accent)" : "var(--color-galaxy-card)",
            color: "var(--color-galaxy-silver)",
            border: "1px solid var(--color-galaxy-border)",
          }}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background: filterCategory === cat ? "var(--color-galaxy-accent)" : "var(--color-galaxy-card)",
              color: "var(--color-galaxy-silver)",
              border: "1px solid var(--color-galaxy-border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add todo button / form */}
      {showForm || editingTodo ? (
        <TodoForm
          categories={CATEGORIES}
          initialData={editingTodo || undefined}
          onSubmit={(data) => {
            if (editingTodo) {
              updateTodo(editingTodo.id, data);
            } else {
              addTodo(data);
            }
          }}
          onCancel={() => { setShowForm(false); setEditingTodo(null); }}
        />
      ) : (
        <button onClick={() => setShowForm(true)} className="galaxy-btn w-full mb-6 py-3">
          + Add New Todo
        </button>
      )}

      {/* Todo list with drag-and-drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredTodos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <SortableItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleComplete(todo.id, todo.completed)}
                onEdit={() => setEditingTodo(todo)}
                onDelete={() => deleteTodo(todo.id)}
                onAddToCalendar={() => addToCalendar(todo)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredTodos.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--color-galaxy-lavender)" }}>
          <p className="text-lg mb-2">No todos yet</p>
          <p className="text-sm opacity-60">Add one to start organizing your galaxy</p>
        </div>
      )}
    </div>
  );
}
