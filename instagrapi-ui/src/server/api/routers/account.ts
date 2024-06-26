// Saving anything to local db
import axios from "axios";
import { z } from "zod";
import { env } from "~/env";
import { default as qs } from "qs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
interface LoginResponse {
  sessionID: string;
}

interface UserIDResponse {
  pk: string;
}
export const accountRouter = createTRPCRouter({
  instagramLogin: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        proxy: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<string> => {
      const formData = qs.stringify({
        username: input.username,
        password: input.password,
        proxy: input.proxy,
      });
      try {
        const response = await axios.post<LoginResponse>(
          `${env.REST_API_URL}/auth/login`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        if (
          response.status === 200 &&
          response.data &&
          typeof response.data.sessionID === "string"
        ) {
          return response.data.sessionID;
        } else {
          throw new Error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Login error:", error.response.data);
        } else {
          console.error("Login error:", error);
        }
        throw new Error(
          "An error occurred during login. Please try again later.",
        );
      }
    }),
  instagramGetUserID: protectedProcedure
    .input(
      z.object({
        sessionID: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<string> => {
      const formData = qs.stringify({
        sessionid: input.sessionID,
        username: input.username,
      });
      try {
        const response = await axios.post<UserIDResponse>(
          `${env.REST_API_URL}/user/id_from_username`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        if (
          response.status === 200 &&
          response.data &&
          typeof response.data.pk === "string"
        ) {
          return response.data.pk;
        } else {
          throw new Error("Can't retrieve user with the given name.");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("HTTP Request error:", error.response.data);
        } else {
          console.error("HTTP Request error:", error);
        }
        throw new Error(
          "An error occurred during login. Please try again later.",
        );
      }
    }),
});
