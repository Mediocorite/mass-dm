"use server";

import { api } from "~/trpc/server";

interface Account {
  proxy: string;
  email: string;
  password: string;
}

interface DMinfo {
  message: string;
  targetAccounts: string[];
}

export async function sendDm(dmInfo: DMinfo) {
  const accountsInfo = await api.exAcc.listAllExternalAcc();
  const { message, targetAccounts } = dmInfo;

  const { sessionIDs, targetAccountsIds } = await processAccounts(
    accountsInfo,
    targetAccounts,
  );

  let currentAccountIndex = 0;
  for (let i = 0; i < targetAccountsIds.length; i++) {
    const account = sessionIDs[currentAccountIndex % sessionIDs.length];

    await sendMessage(account, message, targetAccountsIds[i]);

    if ((i + 1) % 50 === 0) {
      currentAccountIndex++;
    }
  }
}
async function processAccounts(
  accountsInfo: Account[],
  targetAccounts: string[],
) {
  const sessionIDs = await Promise.all(
    accountsInfo.map(async (details) => await getSessionId(details)),
  );

  // Filter out any potential undefined values
  const validSessionIDs = sessionIDs.filter(
    (id): id is string => id !== undefined,
  );

  let targetAccountsIds: number[] = []; // No need for | undefined since we're always assigning an array
  if (validSessionIDs.length > 0) {
    const accountSession = validSessionIDs[0]; // Using the first session ID
    const potentialIds = await Promise.all(
      targetAccounts.map(async (name) => {
        if (accountSession)
          return await getAccountIDbyName(accountSession, name);
      }),
    );

    // Filter out undefined values after resolving Promises
    targetAccountsIds = potentialIds.filter(
      (id): id is number => id !== undefined,
    );
  } else {
    // Handle the case where no valid session IDs are found
    console.error("No valid session IDs found.");
  }

  return { sessionIDs, targetAccountsIds };
}

async function sendMessage(
  account: string | undefined,
  message: string,
  targetAccount: number | undefined,
): Promise<void> {
  if (account)
    console.log(
      `Sending message from ${account} to ${targetAccount}: ${message}`,
    );
  // Implement the actual sending logic here.
}

async function getAccountIDbyName(
  accountSession: string,
  targetAccount: string,
): Promise<number> {
  // Logic for getting account id
  return 15;
}

async function getSessionId(accountDetails: Account): Promise<string> {
  return "something";
}
