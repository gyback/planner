import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          ownerId: ctx.user.id,
        },
      });
    }),

  getLatestList: protectedProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.db.task.findMany({
      where: { ownerId: ctx.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return tasks ?? [];
  }),
});
