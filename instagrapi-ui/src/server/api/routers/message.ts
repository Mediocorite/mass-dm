// Saving anything to local db
import axios from "axios";
import { z } from "zod";
import { env } from "~/env";
import { default as qs } from "qs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
export const messageRouter = createTRPCRouter({
  sendDMtoUser: protectedProcedure
    .input(
      z.object({
        sessionID: z.string(),
        text: z.string(),
        user_ids: z.array(z.string()),
      }),
    )
    .query(async ({ input }) => {
      const formData = qs.stringify({
        username: input.sessionID,
        password: input.text,
        proxy: input.user_ids,
      });
      try {
        const response = await axios<boolean>({
          method: "post",
          url: `${env.REST_API_URL}/user/direct_send`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: formData,
        });
        if (response.status === 200 && response.data) {
          return response.data;
        } else {
          throw new Error("Message failed");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Message Sending error:", error.response.data);
        } else {
          console.error("Message Sending error:", error);
        }
        throw new Error(
          "An error occurred during login. Please try again later.",
        );
      }
    }),
});
