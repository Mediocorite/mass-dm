"use client";
import React, { useState } from "react";
import { sendDm } from "./action";

export default function DirectMessage() {
  const [targetAccounts, setTargetAccounts] = useState("");
  const [messageStatus, setMessageStatus] = useState({
    status: "idle",
    text: "",
  });
  // Split the second input value by comma and trim spaces to create badges
  const accounts = targetAccounts
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("directMessage") as string;
    setMessageStatus({ status: "pending", text: "Sending..." });

    try {
      await sendDm({ targetAccounts: accounts, message });
      setMessageStatus({
        status: "success",
        text: "Messages sent successfully!",
      });
    } catch (error) {
      setMessageStatus({ status: "error", text: "Failed to send messages." });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
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
        {messageStatus.status !== "idle" && (
          <div
            className={`mt-4 text-sm font-semibold ${messageStatus.status === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {messageStatus.text}
          </div>
        )}
      </form>
    </div>
  );
}
