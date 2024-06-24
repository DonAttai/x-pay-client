import React, { useEffect, useRef } from "react";

import { useAuth } from "@/store/auth-store";

import { Link, useNavigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { toastErrorMessage } from "@/lib/utils";
import { useAdminLogin } from "@/hooks/useAdminLogin";

export const AdminLogin = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const credentials = useAuth();

  const { mutate: loginUser, isPending } = useAdminLogin();

  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    if (
      credentials?.accessToken &&
      credentials.roles.includes("admin") &&
      credentials.isActive &&
      credentials.isVerified
    ) {
      navigate("/admin/dashboard");
    }
  }, [
    credentials?.accessToken,
    credentials?.isActive,
    credentials?.isVerified,
    credentials?.roles,
  ]);

  // handle login
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { email, password } = {
      password: formData.get("password") as string,
      email: formData.get("email") as string,
    };

    if (email.trim() && password.trim()) {
      loginUser({ email, password });
    } else {
      toastErrorMessage("email and password are required!");
    }
  };

  return (
    <section className="flex h-screen items-center bg-stone-50">
      <div className=" container mx-auto flex flex-col items-center gap-4 py-4">
        <h2 className="text-2xl text-blue-400">Admin Login</h2>
        <form
          onSubmit={handleLogin}
          className="mx-auto w-5/6 md:w-1/3 p-5 bg-white text-slate-500 py-8 border rounded-md shadow appearance-none"
        >
          <div className="mb-4">
            <label className="font-bold text-sm" htmlFor="email">
              Email
            </label>

            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="email"
              ref={inputRef}
              name="email"
              placeholder="Email"
              // autoComplete="off"
            />
          </div>
          <div className="mb-2">
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
          <div className="text-sm mb-4 underline text-blue-400 duration-600  hover:text-blue-500">
            <Link to="/forgot-password">Forgot password</Link>
          </div>
          <button
            className={`bg-blue-400 mb-4 w-full py-2 rounded-full text-white font-bold disabled:opacity-80 ${
              isPending ? "cursor-not-allowed" : ""
            }`}
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="animate-spin inline-block" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
