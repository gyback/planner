"use client";

import { api } from "~/trpc/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";

type CreateTaskInput = {
  title: string;
};

export default function TaskView() {
  const { register, handleSubmit, reset } = useForm<CreateTaskInput>();
  const apiUtils = api.useUtils();

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      reset();
      void apiUtils.task.getLatestList.invalidate();
    },
  });
  const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
    await createTaskMutation.mutateAsync({ title: data.title });
  };

  return (
    <div>
      <p className="mb-4 text-lg text-gray-600">Create a new task:</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <input
          {...register("title")}
          className="mr-2 rounded border border-gray-300 p-2"
          disabled={createTaskMutation.isPending}
        />
        <Button
          type="submit"
          disabled={createTaskMutation.isPending}
          variant="default"
        >
          Add Task
        </Button>
      </form>
      <h2 className="mb-4 text-xl font-semibold">Your Latest Tasks:</h2>
      <LatestTasks />
    </div>
  );
}

function LatestTasks() {
  const latestTasks = api.task.getLatestList.useQuery();

  if (latestTasks.isLoading) {
    return <div>Loading...</div>;
  }

  if (latestTasks.error) {
    return <div>Error: {latestTasks.error.message}</div>;
  }

  return (
    <ul className="list-inside list-disc">
      {latestTasks.data?.map((task) => (
        <li
          key={task.id}
          className="border-muted-foreground mb-2 flex items-center justify-between rounded border p-2"
        >
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }: { task: { id: string; title: string } }) {
  const apiUtils = api.useUtils();
  const deleteTaskMutation = api.task.delete.useMutation({
    onSuccess: () => {
      void apiUtils.task.getLatestList.invalidate();
    },
  });

  return (
    <>
      {task.title}
      <Button
        onClick={() => deleteTaskMutation.mutate({ id: task.id })}
        variant="destructive"
        disabled={deleteTaskMutation.isPending}
      >
        Delete
      </Button>
    </>
  );
}
