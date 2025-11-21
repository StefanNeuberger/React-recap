import { useMemo, useState } from "react";
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
import {
  FireworksOverlay,
  type FireworkInstance,
} from "@/components/visuals/FireworksOverlay";

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
  const [fireworks, setFireworks] = useState<FireworkInstance[]>([]);

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

  const launchFireworks = () => {
    const palettes: string[][] = [
      ["#FFE066", "#FFD23F", "#FFBF00", "#FF9F1C", "#FFD700", "#FFF5B7"],
      ["#90E0EF", "#48CAE4", "#00B4D8", "#0096C7", "#ADE8F4", "#CAF0F8"],
      ["#F4A261", "#E76F51", "#E9C46A", "#2A9D8F", "#F4D19B", "#F2CC8F"],
      ["#B5179E", "#F72585", "#7209B7", "#560BAD", "#480CA8", "#4CC9F0"],
      ["#06D6A0", "#1B9AAA", "#118AB2", "#FFD166", "#EF476F", "#073B4C"],
      ["#FF6F91", "#FFC75F", "#F9F871", "#D65DB1", "#845EC2", "#FF9671"],
      ["#90BE6D", "#43AA8B", "#4D908E", "#577590", "#277DA1", "#F9C74F"],
    ];

    palettes.forEach((palette, index) => {
      const id = Date.now() + index;
      const firework: FireworkInstance = {
        id,
        originX: 20 + Math.random() * 80,
        originY: 40 + Math.random() * 20,
        offsetX: -50,
        offsetY: -30 - Math.random() * 20,
        initialY: 60 + Math.random() * 10,
        finalSize: 30 + Math.random() * 20,
        colors: palette,
        delay: index * 150,
      };

      setTimeout(() => {
        setFireworks((prev) => [...prev, firework]);
        setTimeout(
          () => setFireworks((prev) => prev.filter((item) => item.id !== id)),
          2000
        );
      }, firework.delay);
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
            <AddTodoDialog onCreated={launchFireworks} />
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
      <FireworksOverlay items={fireworks} />
    </div>
  );
}
