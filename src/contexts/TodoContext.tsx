import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Todo, TodoFilter, TodoUpdate } from "../types/todos";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../lib/todos";
import { supabase } from "../lib/supabase";

type TodoContextType = {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: TodoFilter;
  isLoading: boolean;
  error: Error | null;
  addTodo: (title: string) => Promise<void>;
  updateTodo: (id: string, updates: TodoUpdate) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
  clearError: () => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch todos"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();

    const channel = supabase
      .channel("todos-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        fetchTodos,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTodos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleAddTodo = async (title: string) => {
    try {
      await addTodo({ title, completed: false });
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to add todo"));
    }
  };

  const handleUpdateTodo = async (id: string, updates: TodoUpdate) => {
    try {
      await updateTodo(id, updates);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to update todo"));
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await handleUpdateTodo(id, { completed: !todo.completed });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to delete todo"));
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.completed);
      await Promise.all(completedTodos.map((todo) => deleteTodo(todo.id)));
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to clear completed todos"),
      );
    }
  };

  const clearError = () => setError(null);

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        filter,
        isLoading,
        error,
        addTodo: handleAddTodo,
        updateTodo: handleUpdateTodo,
        toggleTodo: handleToggleTodo,
        deleteTodo: handleDeleteTodo,
        clearCompleted: handleClearCompleted,
        setFilter,
        clearError,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
