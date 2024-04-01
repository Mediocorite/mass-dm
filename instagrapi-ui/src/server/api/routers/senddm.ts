import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sendDmRouter = createTRPCRouter({
  sendDm: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        targetAccount: z.number(),
        accountSession: z.string(),
      }),
    )
    .query(async (input) => {
      try {
        const response = await axios.post(""); // Making the API call
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch external data: ${error}`);
      }
    }),

  getAccountIDByName: protectedProcedure
    .input(
      z.object({
        targetAccount: z.string(),
        accountSession: z.string(),
      }),
    )
    .query(async (input) => {
      try {
        const response = await axios.post(""); // Making the API call
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch external data: ${error}`);
      }
    }),
});
