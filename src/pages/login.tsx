// react hooks
import React, { useEffect, useRef } from "react";

// auth-store
import { useAuth, useAuthActions } from "@/store/auth-store";

// react-router-dom
import { Link, useNavigate } from "react-router-dom";

// react-hot-toast
import toast from "react-hot-toast";

// react-query
import { useMutation } from "@tanstack/react-query";

// custom hooks
import axiosInstance from "@/hooks/axios";

// axios
import { AxiosError } from "axios";
import { Loader } from "lucide-react";

export const Login = () => {
  const userCredentials = useAuth();
  const { setCredentials } = useAuthActions();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // mutation function
  const loginMutation = async (credentials: any) => {
    const res = await axiosInstance.post("/auth/login", credentials);
    return res.data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: loginMutation,
    onSuccess: (data) => {
      setCredentials(data);
    },
    onError: (err) => {
      if (err instanceof AxiosError) toast.error(err?.response?.data.message);
    },
  });

  useEffect(() => {
    if (userCredentials?.accessToken) {
      navigate("/dashboard");
      toast.success("Login Successful!");
    }
  }, [navigate, userCredentials]);

  useEffect(() => {
    inputRef.current?.focus();
  });

  // handle login
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { email, password } = {
      password: formData.get("password") as string,
      email: formData.get("email") as string,
    };

    if (email.trim() && password.trim()) {
      mutate({ email, password }, { onSuccess: () => e.currentTarget.reset() });
    } else {
      toast.error("email and password are required!");
    }
  };

  return (
    <section className="flex h-screen items-center bg-stone-50">
      <div className=" container mx-auto flex flex-col items-center gap-4 py-4">
        <h2 className="text-2xl text-blue-400">X-PAY</h2>
        <form
          onSubmit={handleLogin}
          className="mx-auto w-5/6 md:w-1/3 p-5 bg-white text-slate-500 py-8 border rounded-md shadow appearance-none"
        >
          <h1 className="text-center font-semibold text-xl mb-4">
            Login to your account
          </h1>
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
            <Link to="">Forgot password</Link>
          </div>
          <button
            className="bg-blue-400 mb-4 w-full py-2 rounded-full text-white font-bold disabled:opacity-80"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="animate-spin inline-block" />
            ) : (
              "Sign in"
            )}
          </button>
          <p className="text-sm">
            Don't have an account?
            <Link
              to="/register"
              className="underline ml-2  text-blue-400 hover:text-blue-600 duration-500"
            >
              create account!
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};
