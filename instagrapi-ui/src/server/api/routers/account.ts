// Saving anything to local db
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { env } from "~/env";
import { default as qs } from "qs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
  instagramLogin: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        proxy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<string> => {
      const formData = qs.stringify({
        username: input.username,
        password: input.password,
        proxy: input.proxy,
      });
      try {
        const response = await axios({
          method: "post",
          url: `${env.REST_API_URL}/auth/login`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: formData,
        });
        debugger;
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
        debugger;
        console.error("Login error:", error);

        if (axios.isAxiosError(error)) {
          // Now we know this is an Axios error, and we can access the specific properties
          if (error.response) {
            console.log("Error Data:", error.response.data);
            console.log("Error Status:", error.response.status);
            console.log("Error Headers:", error.response.headers);
          } else if (error.request) {
            console.log("Error Request:", error.request);
          } else {
            console.log("Error Message:", error.message);
          }
          console.log("Error Config:", error.config);
        } else if (error instanceof Error) {
          // Generic error handling if it's not an AxiosError
          console.log("Error", error.message);
        } else {
          // This block handles cases where the error isn't an instance of Error (very rare)
          console.log("An unexpected error occurred");
        }
      }
      debugger;
      throw new Error(
        "An error occurred during login. Please try again later.",
      );
    }),
});
