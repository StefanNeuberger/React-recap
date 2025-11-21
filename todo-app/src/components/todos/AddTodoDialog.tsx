import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TodoStatus } from "../../api/generated/model/todoStatus";
import { getGetAllQueryKey, usePostTodo } from "@/api/generated/todoClient";
import type { Todo } from "@/api/generated/model/todo";

export type AddTodoFormValues = {
  description: string;
  status: TodoStatus;
};

export function AddTodoDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<AddTodoFormValues>({
    defaultValues: {
      description: "",
      status: TodoStatus.OPEN,
    },
  });
  const queryClient = useQueryClient();
  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: getGetAllQueryKey() });

  const createTodo = usePostTodo({
    mutation: {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        invalidateTodos();
        toast.success("Todo created successfully");
      },
      onError: () => {
        toast.error("Could not create the todo. Please try again.");
      },
    },
  });

  const handleCreate = (values: AddTodoFormValues) => {
    const trimmed = values.description.trim();
    if (!trimmed) {
      return;
    }
    createTodo.mutate({
      data: {
        id: "",
        description: trimmed,
        status: values.status,
      } as Todo,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add todo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add todo</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleCreate)}>
          <div className="space-y-2">
            <Label htmlFor="dialog-description">Description</Label>
            <Textarea
              id="dialog-description"
              {...form.register("description")}
              placeholder="Write more tests"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dialog-status">Status</Label>
            <Select
              defaultValue={form.getValues("status")}
              onValueChange={(value) =>
                form.setValue("status", value as TodoStatus)
              }
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
          </div>

          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createTodo.isPending} size="sm">
              {createTodo.isPending ? "Saving…" : "Create todo"}
            </Button>
          </DialogFooter>

          {createTodo.isError && (
            <p className="text-sm text-destructive">
              Could not create the todo. Please try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
