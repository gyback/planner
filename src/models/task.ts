import { Prisma } from "../../generated/prisma";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export type Task = Prisma.TaskGetPayload<{}>;

export const TaskTypeScheme = z.enum([
  "COURSE",
  "ASSIGNMENT",
  "PROJECT",
  "REPORT",
  "SEMINAR",
  "PERSONAL",
]);
export const TaskType = TaskTypeScheme.enum;

export type TaskType = (typeof TaskType)[keyof typeof TaskType];

export const TaskTypeToInternalTypeMap: Record<TaskType, number> = {
  COURSE: 1,
  ASSIGNMENT: 2,
  PROJECT: 3,
  REPORT: 4,
  SEMINAR: 5,
  PERSONAL: 6,
};

export const InternalTypeToTaskTypeMap: Record<number, TaskType> = {
  1: "COURSE",
  2: "ASSIGNMENT",
  3: "PROJECT",
  4: "REPORT",
  5: "SEMINAR",
  6: "PERSONAL",
};

export const TaskStatusScheme = z.enum([
  "CREATED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
]);
export const TaskStatus = TaskStatusScheme.enum;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const StatusToInternalStatusMap: Record<TaskStatus, number> = {
  CREATED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  ON_HOLD: 4,
  CANCELLED: 5,
};

export const InternalStatusToTaskMap: Record<number, TaskStatus> = {
  1: "CREATED",
  2: "IN_PROGRESS",
  3: "COMPLETED",
  4: "ON_HOLD",
  5: "CANCELLED",
};

export const TaskPriorityScheme = z.enum([
  "LOWEST",
  "LOW",
  "MEDIUM",
  "HIGH",
  "HIGHEST",
]);

export const TaskPriority = TaskPriorityScheme.enum;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const createTaskInputSchema = z.object({
  title: z.string().min(1),
  type: TaskTypeScheme,
  status: TaskStatusScheme,
  startDate: z.date().optional(),
  deadline: z.date().optional(),
  priority: TaskPriorityScheme.optional(),
  notes: z.string().optional(),
  effort: z.number().optional(),
  parentId: z.string().uuid().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
