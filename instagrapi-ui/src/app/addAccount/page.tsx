"use client";
import Link from "next/link";
import { api } from "~/trpc/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-indigo-500",
];

export default function AddAccount() {
  const {
    data: accounts,
    isLoading,
    refetch,
  } = api.database.listAllExternalAcc.useQuery();

  const { mutateAsync: instagramLogin } =
    api.account.instagramLogin.useMutation({
      onSuccess: () => {
        toast.success("Account successfully added!");
      },
      onError: (error) => {
        toast.error(
          error?.message || "An error occurred while adding the account.",
        );
      },
    });

  const { mutate: addAccount } = api.database.addExternalAcc.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Account successfully added!");
    },
    onError: (error) => {
      toast.error(
        error?.message || "An error occurred while adding the account.",
      );
    },
  });

  const { mutate: deleteAccount } = api.database.removeAccByID.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const proxy = formData.get("proxy") as string;
    try {
      const sessionID = await instagramLogin({ username, password, proxy });
      addAccount({ username, password, proxy, sessionID });
    } catch (error) {
      console.error("Failed to login:", error);
      toast.error(
        JSON.stringify(error) || "An error occurred while adding the account.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-screen space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Add Accounts
            </h2>
          </div>
          <div className="flex p-16">
            <div className="w-3/4 p-24">
              {!isLoading && accounts?.length == 0 && (
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-4 text-4xl font-bold">No Accounts Found</h1>
                  <p className="mb-8 text-lg text-gray-600">
                    Please add some accounts for sending your
                  </p>
                  <a href="/" className="text-blue-500 hover:underline">
                    Go back to home
                  </a>
                </div>
              )}
              {!isLoading &&
                accounts?.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-4 hover:border-blue-500"
                  >
                    <div className="flex">
                      <div className="flex items-center justify-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${colors[index % colors.length]}`}
                        >
                          <span className="text-4xl">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-center p-4">
                        <span className="font-semibold">{data.username}</span>
                        <span>Proxy: {data.proxy}</span>
                      </div>
                    </div>
                    <span
                      onClick={() => deleteAccount({ id: data?.id })}
                      className="cursor-pointer text-4xl"
                    >
                      ❌
                    </span>
                  </div>
                ))}
            </div>
            <div className="mt-8 flex w-1/4 items-center justify-center  ">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Email address or Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Username or Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                  <div>
                    <label htmlFor="proxy" className="sr-only">
                      Proxy Details
                    </label>
                    <input
                      id="proxy"
                      name="proxy"
                      type="proxy"
                      autoComplete="current-proxy"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Proxy Details"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M4 8V7a5 5 0 0110 0v1h2a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1h2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Add Account Details
                  </button>
                  <Link
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    href={"/directmessage"}
                  >
                    Send direct message
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
