import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Todo } from "../../api/generated/model/todo";
import { TodoStatus } from "../../api/generated/model/todoStatus";
import { Trash } from "lucide-react";

type TodoCardProps = {
  todo: Todo;
  onStatusChange: (status: TodoStatus) => void;
  onDelete: () => void;
  disableActions?: boolean;
};

export function TodoCard({
  todo,
  onStatusChange,
  onDelete,
  disableActions,
}: TodoCardProps) {
  return (
    <div className="flex flex-col gap-4 border border-border bg-border/10 px-4 py-3 shadow-sm">
      <p className="font-medium">{todo.description}</p>

      <div className="flex gap-2 self-end ">
        <Select
          defaultValue={todo.status}
          onValueChange={(value) => onStatusChange(value as TodoStatus)}
          disabled={disableActions}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TodoStatus).map((statusValue) => (
              <SelectItem key={statusValue} value={statusValue}>
                {statusValue.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={onDelete}
          disabled={disableActions}
          variant="destructive"
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  );
}
