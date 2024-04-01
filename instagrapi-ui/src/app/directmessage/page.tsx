"use client";
import React, { useState } from "react";
import { sendDm } from "./action";

export default function DirectMessage() {
  const [targetAccounts, setTargetAccounts] = useState("");

  // Split the second input value by comma and trim spaces to create badges
  const accounts = targetAccounts
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        action={async (formData) => {
          const message = formData.get("directMessage") as string;
          console.log("This is the message " + message);
          await sendDm({ targetAccounts: accounts, message });
        }}
        className="rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="directMessage"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Enter the message
          </label>
          <textarea
            id="directMessage"
            name="directMessage"
            placeholder="Enter something..."
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="accounts"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Add in the accounts
          </label>
          <textarea
            id="accounts"
            placeholder="Enter comma-separated values..."
            className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            value={targetAccounts}
            onChange={(e) => setTargetAccounts(e.target.value)}
          ></textarea>
          <div className="mt-2 flex flex-wrap gap-2">
            {accounts.map((badge, index) => (
              <span
                key={index}
                className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          Button
        </button>
      </form>
    </div>
  );
}
