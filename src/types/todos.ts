export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type NewTodo = Omit<Todo, "id" | "created_at" | "updated_at">;

export type TodoUpdate = Partial<
  Omit<Todo, "id" | "created_at" | "updated_at">
>;

export type TodoFilter = "all" | "active" | "completed";
