import type { Todo } from "@/api/generated/model/todo";
import type { TodoStatus } from "@/api/generated/model/todoStatus";
import { TodoCard } from "./TodoCard";

type TodoColumnProps = {
  title: string;
  todos: Todo[];
  isMutating: boolean;
  onStatusChange: (todo: Todo, nextStatus: TodoStatus) => void;
  onDelete: (todo: Todo) => void;
};

export function TodoColumn({
  title,
  todos,
  isMutating,
  onStatusChange,
  onDelete,
}: TodoColumnProps) {
  return (
    <div className=" border border-border bg-card p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">{todos.length} items</span>
      </div>
      <div className="space-y-3">
        {todos.length === 0 && (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            Nothing in this lane yet.
          </p>
        )}
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onStatusChange={(nextStatus) => onStatusChange(todo, nextStatus)}
            onDelete={() => onDelete(todo)}
            disableActions={isMutating}
          />
        ))}
      </div>
    </div>
  );
}


