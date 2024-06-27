import { useEffect, useRef } from "react";

import { useAuth } from "@/store/auth-store";

import { useNavigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(3, { message: "Password is required" }),
});

type FormDataType = z.infer<typeof formSchema>;

export const AdminLogin = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onSubmit = (values: FormDataType) => {
    loginUser(values);
  };

  return (
    <section className="flex flex-col h-screen items-center justify-center bg-stone-50">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-300 text-center">
            Admin Login
          </CardTitle>
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
                className="font-bold text-lg self-center bg-blue-400  w-full hover:bg-blue-500"
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
      </Card>
    </section>
  );
};
