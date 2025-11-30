"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  type CreateTaskInput,
  createTaskInputSchema,
  TaskStatus,
  TaskType,
} from "~/models/task";
import { DatePickerInput } from "~/components/ui/DatePickerInput";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

type CreateTaskFormProps = {
  locale: Intl.LocalesArgument;
  createTaskDictionary: {
    title: string;
    form: {
      title: {
        label: string;
        description: string;
      };
      type: {
        label: string;
        description: string;
        selectItems: {
          course: string;
          assignment: string;
          project: string;
          report: string;
          seminar: string;
          personal: string;
        };
      };
      status: {
        label: string;
        description: string;
        selectItems: {
          created: string;
          inProgress: string;
          completed: string;
          onHold: string;
          cancelled: string;
        };
      };
      submitButton: {
        default: string;
        pending: string;
      };
    };
  };
};

export function CreateTaskDialog({
  locale,
  createTaskDictionary,
}: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTaskInput>({
    defaultValues: {
      title: "",
      type: TaskType.ASSIGNMENT,
      status: TaskStatus.CREATED,
      deadline: undefined,
    },
    resolver: zodResolver(createTaskInputSchema),
  });
  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      form.reset();
      setOpen(false);
      api.useUtils().task.getLatestList.invalidate();
    },
  });

  const onSubmit = async (data: CreateTaskInput) => {
    await createTaskMutation.mutateAsync(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="icon">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{createTaskDictionary.title}</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{createTaskDictionary.form.title.label}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{createTaskDictionary.form.type.label}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      name={field.name}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                    >
                      <SelectTrigger>
                        <SelectValue defaultValue={TaskType.ASSIGNMENT} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskType.COURSE}>
                          {createTaskDictionary.form.type.selectItems.course}
                        </SelectItem>
                        <SelectItem value={TaskType.ASSIGNMENT}>
                          {
                            createTaskDictionary.form.type.selectItems
                              .assignment
                          }
                        </SelectItem>
                        <SelectItem value={TaskType.PROJECT}>
                          {createTaskDictionary.form.type.selectItems.project}
                        </SelectItem>
                        <SelectItem value={TaskType.REPORT}>
                          {createTaskDictionary.form.type.selectItems.report}
                        </SelectItem>
                        <SelectItem value={TaskType.SEMINAR}>
                          {createTaskDictionary.form.type.selectItems.seminar}
                        </SelectItem>
                        <SelectItem value={TaskType.PERSONAL}>
                          {createTaskDictionary.form.type.selectItems.personal}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {createTaskDictionary.form.status.label}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      name={field.name}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                    >
                      <SelectTrigger>
                        <SelectValue defaultValue={TaskStatus.CREATED} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskStatus.CREATED}>
                          {createTaskDictionary.form.status.selectItems.created}
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          {
                            createTaskDictionary.form.status.selectItems
                              .inProgress
                          }
                        </SelectItem>
                        <SelectItem value={TaskStatus.COMPLETED}>
                          {
                            createTaskDictionary.form.status.selectItems
                              .completed
                          }
                        </SelectItem>
                        <SelectItem value={TaskStatus.ON_HOLD}>
                          {createTaskDictionary.form.status.selectItems.onHold}
                        </SelectItem>
                        <SelectItem value={TaskStatus.CANCELLED}>
                          {
                            createTaskDictionary.form.status.selectItems
                              .cancelled
                          }
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <DatePickerInput {...field} locale={locale} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending
                ? createTaskDictionary.form.submitButton.pending
                : createTaskDictionary.form.submitButton.default}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
