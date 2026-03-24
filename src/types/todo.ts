export type Priority = "low" | "medium" | "high" | "urgent";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: Priority;
  category: string | null;
  completed: boolean;
  sort_order: number;
  calendar_event_id: string | null;
  created_at: string;
}

export interface TodoInsert {
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority?: Priority;
  category?: string | null;
  completed?: boolean;
  sort_order?: number;
  calendar_event_id?: string | null;
}

export interface TodoUpdate extends Partial<TodoInsert> {
  id: string;
}
