// Saving anything to local db
import axios from "axios";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  instagramLogin: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        proxy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formData = new URLSearchParams();
      formData.append("username", input.email);
      formData.append("password", input.password);
      formData.append("proxy", input.proxy);
      try {
        const response = await axios.post(
          env.REST_API_URL + "/auth/login",
          formData.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw new Error(
          "An error occurred during login. Please try again later.",
        );
      }
    }),
});
