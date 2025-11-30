"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  InternalStatusToTaskMap,
  InternalTypeToTaskTypeMap,
  type Task,
} from "~/models/task";
import type {
  StatusDictionary,
  TaskTableHeaderDictionary,
  TypeDictionary,
} from "~/lib/dictionaries";

export function getColumns(
  headerDictionary: TaskTableHeaderDictionary,
  statusDictionary: StatusDictionary,
  typeDictionary: TypeDictionary,
): ColumnDef<Task>[] {
  return [
    {
      accessorKey: "title",
      header: headerDictionary?.title ?? "Title, translation missing",
    },
    {
      accessorKey: "status",
      header: headerDictionary?.status ?? "Status, translation missing",
      cell: ({ getValue }) => {
        const status = getValue<keyof typeof statusDictionary>();
        return statusDictionary[status] ?? InternalStatusToTaskMap[status];
      },
    },
    {
      accessorKey: "type",
      header: headerDictionary?.type ?? "Type, translation missing",
      cell: ({ getValue }) => {
        const type = getValue<keyof typeof typeDictionary>();
        return typeDictionary[type] ?? InternalTypeToTaskTypeMap[type];
      },
    },
    {
      accessorKey: "deadline",
      header: headerDictionary?.deadline ?? "Deadline, translation missing",
      cell: ({ getValue }) => {
        const date = getValue<Date>();
        if (!date) {
          return "";
        }
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "priority",
      header: headerDictionary?.priority ?? "Priority, translation missing",
    },
    {
      accessorKey: "effort",
      header: headerDictionary?.effort ?? "Effort, translation missing",
    },
  ];
}
