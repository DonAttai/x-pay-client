import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useAuth } from "@/store/auth-store";
import { Loader } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  email: z.string().email().min(1),
  password: z.string().min(3, { message: "Password is required" }),
});

export type CredentialType = z.infer<typeof formSchema>;

export const Register = () => {
  const form = useForm<CredentialType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const credentials = useAuth();

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useRegister();

  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    if (credentials?.accessToken && credentials.isVerified) {
      navigate("/dashboard");
    }
  }, [credentials?.accessToken, navigate]);

  const onSubmit = (values: CredentialType) => {
    mutate(values);
  };

  return (
    <section className="flex flex-col h-screen items-center justify-center bg-stone-50">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-300 text-center">
            Create Account
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                className="font-semibold text-lg self-center bg-blue-400 w-full hover:bg-blue-500"
              >
                {isPending ? (
                  <Loader className="animate-spin inline-block" />
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          Already have an account?
          <Link
            to="/login"
            className="underline ml-2  text-blue-400 hover:text-blue-600 duration-500"
          >
            Sign in!
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
