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

  let currentAccountIndex = 0;
  for (let i = 0; i < targetAccounts.length; i++) {
    const account = accountsInfo[currentAccountIndex % accountsInfo.length];

    await sendMessage(account, message, targetAccounts[i]);

    if ((i + 1) % 50 === 0) {
      currentAccountIndex++;
    }
  }
}

async function sendMessage(
  account: Account | undefined,
  message: string,
  targetAccount: string | undefined,
): Promise<void> {
  if (account)
    console.log(
      `Sending message from ${account.email} to ${targetAccount}: ${message}`,
    );
  // Implement the actual sending logic here.
}
