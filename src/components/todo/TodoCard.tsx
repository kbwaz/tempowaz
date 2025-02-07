import { useState } from "react";
import { Todo } from "@/types/todos";
import { useTodos } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface TodoCardProps {
  todo: Todo;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const { toggleTodo, updateTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = async () => {
    if (isEditing && editedTitle.trim() !== todo.title) {
      await updateTodo(todo.id, { title: editedTitle.trim() });
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-lg p-4",
        "bg-background/80 backdrop-blur-sm border shadow-sm",
        "transition-all duration-200 hover:shadow-md",
        todo.completed && "bg-muted/50",
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
        className="h-5 w-5 rounded-full border-2"
      />

      {isEditing ? (
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-background"
          autoFocus
        />
      ) : (
        <span
          className={cn(
            "flex-1 text-sm transition-colors",
            todo.completed && "text-muted-foreground line-through",
          )}
        >
          {todo.title}
        </span>
      )}

      <div
        className={cn(
          "flex items-center gap-2",
          "opacity-0 transition-opacity group-hover:opacity-100",
          isEditing && "opacity-100",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="h-8 w-8"
        >
          {isEditing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>

        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditedTitle(todo.title);
              setIsEditing(false);
            }}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTodo(todo.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
