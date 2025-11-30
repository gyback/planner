import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createTaskInputSchema,
  StatusToInternalStatusMap,
  TaskPriorityScheme,
  TaskStatusScheme,
  TaskTypeScheme,
  TaskTypeToInternalTypeMap,
} from "~/models/task";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTaskInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          ownerId: ctx.user.id,
          type: TaskTypeToInternalTypeMap[input.type],
          status: StatusToInternalStatusMap[input.status],
          deadline: input.deadline,
        },
      });
    }),

  getLatestList: protectedProcedure.query(async ({ ctx }) => {
    const taskList = await ctx.db.task.findMany({
      where: { ownerId: ctx.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return taskList ?? [];
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.delete({
        where: {
          id: input.id,
          ownerId: ctx.user.id,
        },
      });
    }),
});
