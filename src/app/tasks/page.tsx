import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { getDictionary, getLocale } from "~/lib/dictionaries";
import { api } from "~/trpc/server";
import type { Task } from "~/models/task";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateTaskDialog } from "~/app/tasks/createTaskDialog";

const locales = {
  en: "en-GB",
  sv: "sv-SE",
};

export default async function Page() {
  const authSession = await auth();

  if (!authSession.isAuthenticated) {
    redirect("/");
  }
  const dataPromise = api.task.getLatestList();
  const localePromise = getLocale();
  const dictionary = await getDictionary();
  const locale = locales[await localePromise];

  const data: Task[] = await dataPromise;
  const createTaskDialogDictionary = dictionary.taskPage.createTaskDialog;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-wrap items-center justify-end">
        <CreateTaskDialog
          locale={locale}
          createTaskDictionary={createTaskDialogDictionary}
        />
      </div>
      <DataTable
        getColumns={getColumns}
        data={data}
        headerDictionary={dictionary.taskPage.columns}
        statusDictionary={dictionary.taskStatus}
        typeDictionary={dictionary.taskType}
      />
    </div>
  );
}
