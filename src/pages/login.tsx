// react hooks

// auth-store
import { useAuth } from "@/store/auth-store";

// react-router-dom
import { Link, useNavigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const formSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(3, { message: "Password is required" }),
});

type FormDataType = z.infer<typeof formSchema>;

export const Login = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const credentials = useAuth();

  const { mutate: loginUser, isPending } = useLogin();

  useEffect(() => {
    if (
      credentials?.accessToken &&
      credentials.isActive &&
      credentials.isVerified
    ) {
      navigate("/dashboard");
    }
  }, [
    credentials?.isActive,
    credentials?.isVerified,
    credentials?.accessToken,
  ]);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const onSubmit = (values: FormDataType) => {
    loginUser(values);
  };

  return (
    <section className="flex flex-col h-screen items-center justify-center bg-stone-50">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-300 text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="font-bold text-lg self-center md:w-2/3 sm:w-full"
              >
                {isPending ? (
                  <Loader className="animate-spin inline-block" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          Don't have an account?
          <Link
            to="/register"
            className="underline ml-2  text-blue-400 hover:text-blue-600 duration-500"
          >
            create account!
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
