import { api } from "~/trpc/server";
import TaskView from "~/app/TaskView.component";

export default async function Dashboard() {
  await api.task.getLatestList.prefetch();

  return (
    <div className="p-4 text-center">
      <h1 className="mb-6 text-4xl font-bold text-gray-800">
        Welcome to the Dashboard
      </h1>
      <div className="mt-6 text-left">
        <TaskView />
      </div>
    </div>
  );
}
