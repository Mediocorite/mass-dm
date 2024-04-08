import axios from "axios";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sendDmRouter = createTRPCRouter({
  getSessionIDwithLogin: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        proxy: z.string(),
      }),
    )
    .query(async (input) => {
      try {
        const response = await axios
          .post(env.REST_API_URL + "/auth/login", {
            ...input,
          })
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          }); // Making the API call
        return response;
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
});
