import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetAllQueryKey,
  useDelete,
  useGetAll,
  useUpdate,
} from "@/api/generated/todoClient";
import type { Todo } from "@/api/generated/model/todo";
import { TodoStatus } from "@/api/generated/model/todoStatus";
import { AddTodoDialog } from "@/components/todos/AddTodoDialog";
import { TodoColumn } from "@/components/todos/TodoColumn";

const STATUS_SECTIONS = [
  { label: "Open", value: TodoStatus.OPEN },
  {
    label: "In Progress",
    value: TodoStatus.IN_PROGRESS,
  },
  { label: "Done", value: TodoStatus.DONE },
] as const;

export function TodosPage() {
  const queryClient = useQueryClient();
  const todosQuery = useGetAll();

  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: getGetAllQueryKey() });

  const deleteTodo = useDelete({
    mutation: {
      onSuccess: invalidateTodos,
    },
  });

  const updateTodo = useUpdate({
    mutation: {
      onSuccess: invalidateTodos,
    },
  });

  const todosByStatus = useMemo(() => {
    const currentTodos = todosQuery.data?.data ?? [];
    return STATUS_SECTIONS.reduce<Record<TodoStatus, Todo[]>>(
      (acc, section) => {
        acc[section.value] = currentTodos.filter(
          (todo) => todo.status === section.value
        );
        return acc;
      },
      {
        [TodoStatus.OPEN]: [],
        [TodoStatus.IN_PROGRESS]: [],
        [TodoStatus.DONE]: [],
      }
    );
  }, [todosQuery.data]);

  const handleStatusChange = (todo: Todo, nextStatus: TodoStatus) => {
    if (todo.status === nextStatus) {
      return;
    }
    updateTodo.mutate({
      id: todo.id,
      data: {
        ...todo,
        status: nextStatus,
      },
    });
  };

  return (
    <div className="space-y-8 text-foreground">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Todo Board
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AddTodoDialog />
            {todosQuery.isLoading && (
              <span className="text-sm text-muted-foreground">Loading…</span>
            )}
            {todosQuery.isError && (
              <span className="text-sm text-destructive">
                Failed to load todos.
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {STATUS_SECTIONS.map((section) => (
            <TodoColumn
              key={section.value}
              title={section.label}
              todos={todosByStatus[section.value] ?? []}
              isMutating={deleteTodo.isPending || updateTodo.isPending}
              onStatusChange={handleStatusChange}
              onDelete={(todo) => deleteTodo.mutate({ id: todo.id })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
