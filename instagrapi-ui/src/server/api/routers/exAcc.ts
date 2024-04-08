// This is the file for interacting with external accounts

import axios from "axios";
import { z } from "zod";
import { env } from "~/env";

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
      const checkValidity = await axios.post(env.REST_API_URL + "/auth/login");
      console.log("This is the checkValidity");
      console.log(JSON.stringify(checkValidity));
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
