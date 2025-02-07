import { supabase } from "./supabase";
import type { Todo, NewTodo } from "../types/todos";

export const todosTable = "todos";

export async function getTodos() {
  const { data, error } = await supabase
    .from(todosTable)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Todo[];
}

export async function addTodo(todo: NewTodo) {
  const { data, error } = await supabase
    .from(todosTable)
    .insert(todo)
    .select()
    .single();

  if (error) throw error;
  return data as Todo;
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from(todosTable)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Todo;
}

export async function deleteTodo(id: string) {
  const { error } = await supabase.from(todosTable).delete().eq("id", id);

  if (error) throw error;
}
