import { FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { useAuth } from "@/store/auth-store";
import { Loader } from "lucide-react";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
export const Register = () => {
  const credentials = useAuth();

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  type CredentialType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  const { isPending, data, mutate, isSuccess, isError, error } = useMutation({
    mutationFn: async (credentials: CredentialType) => {
      const res = await axiosInstance.post("/auth/register", credentials);
      return res.data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/not-verified");
      toastSuccessMessage(data.message);
    }
    if (isError) {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
      }
    }
  }, [isSuccess, isError, error]);

  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    if (credentials?.accessToken && credentials.isVerified) {
      navigate("/dashboard");
    }

    if (credentials?.accessToken && !credentials?.isVerified) {
      navigate("/not-verified");
    }
  }, [credentials?.accessToken, credentials?.isVerified, navigate]);

  // handle regisetr
  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userData = Object.fromEntries(formData);

    const values = [...formData.values()];
    if (values.includes("".trim()))
      return toast.error("All fields are required!");
    mutate(userData as CredentialType);
  };

  return (
    <section className="flex h-screen items-center bg-stone-50">
      <div className=" container mx-auto flex flex-col items-center gap-4 py-4">
        <h2 className="text-2xl text-blue-400">X-PAY</h2>
        <form
          onSubmit={handleRegister}
          className="mx-auto w-5/6 md:w-1/3 p-5 bg-white text-slate-500 py-8 border rounded-md shadow appearance-none"
        >
          <h1 className="text-center font-semibold text-xl mb-4">Sign Up</h1>
          <div className="mb-4">
            <label className="font-bold text-sm" htmlFor="first-name">
              First Name
            </label>

            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="first-name"
              ref={inputRef}
              name="firstName"
              placeholder="First Name"
              // autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-sm" htmlFor="last-name">
              Last Name
            </label>

            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="last-name"
              name="lastName"
              placeholder="Last Name"
              // autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-sm" htmlFor="email">
              Email
            </label>

            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              // autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-sm" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              // autoComplete="new-password"
            />
          </div>

          <button
            className={`bg-blue-400 mb-4 w-full py-2 rounded-full text-white font-bold disabled:opacity-80 ${
              isPending ? "cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="animate-spin inline-block" />
            ) : (
              "Create account"
            )}
          </button>
          <p className="text-sm">
            Already have an account?
            <Link
              to="/login"
              className="underline ml-2  text-blue-400 hover:text-blue-600 duration-500"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};
