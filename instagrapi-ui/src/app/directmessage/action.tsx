"use server";

import { api } from "~/trpc/server";

interface Account {
  id: number;
  proxy: string;
  username: string;
  password: string;
  userId: string | null;
  sessionid: string;
}

interface DMinfo {
  message: string;
  targetAccounts: string[];
}

export async function sendDm(dmInfo: DMinfo) {
  const accounts: Account[] = await api.database.listAllExternalAcc();
  const targetAccountIDs = await Promise.all(
    dmInfo.targetAccounts.map(async (target, index) => {
      const sessionID = accounts[index % accounts.length]?.sessionid;
      if (sessionID) {
        try {
          const userID = await api.account.instagramGetUserID({
            username: target,
            sessionID: sessionID,
          });
          return userID;
        } catch (error) {
          console.error(`Failed to retrieve ID for ${target}:`, error);
          return null;
        }
      }
      return null;
    }),
  ).then((ids) => ids.filter((id): id is string => id !== null));
  const maxUsersPerSession = 50;
  let sessionIndex = 0;
  let userCount = 0;

  for (let i = 0; i < targetAccountIDs.length; i++) {
    if (!accounts[sessionIndex]) {
      sessionIndex = 0; // Reset session index if it goes out of bound
    }

    const sessionID = accounts[sessionIndex]?.sessionid;
    if (!sessionID) {
      console.error(
        `Session ID not available for session index ${sessionIndex}`,
      );
      continue; // Skip this iteration if no valid session ID is found
    }

    const end = Math.min(i + maxUsersPerSession, targetAccountIDs.length);
    const chunk = targetAccountIDs.slice(i, end);
    try {
      await api.message.sendDMtoUser({
        sessionID: sessionID,
        text: dmInfo.message,
        user_ids: chunk,
      });
    } catch (error) {
      console.error(`Failed to send DM using session ${sessionID}:`, error);
    }

    userCount += chunk.length;
    if (userCount >= maxUsersPerSession || i >= targetAccountIDs.length - 1) {
      sessionIndex++;
      userCount = 0;
    }
  }
}
