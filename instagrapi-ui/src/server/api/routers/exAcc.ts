// This is the file for interacting with external accounts

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const exAccRouter = createTRPCRouter({
  addExternalAcc: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        proxy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.externalAccount.create({
        data: input,
      });
    }),
  listAllExternalAcc: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.db.externalAccount.findMany();
    return accounts;
  }),
  removeAccByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const removedItem = await ctx.db.externalAccount.delete({
        where: { id },
      });

      return removedItem;
    }),
});
