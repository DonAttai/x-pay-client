import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { z } from "zod";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import axiosInstance from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

type FormDataType = z.infer<typeof formSchema>;

export const ForgotPassword = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const credentials = useAuth();
  const navigate = useNavigate();

  const { isPending, mutate, isError } = useMutation({
    mutationFn: async (data: {
      email: string;
    }): Promise<{ message: string }> => {
      const res = await axiosInstance.post("/auth/forgot-password", data);
      return res.data;
    },
    onSuccess: (data) => {
      form.reset();
      toastSuccessMessage(data.message);
    },
    onError: (error) => {
      if (isError) {
        if (error instanceof AxiosError) {
          const errorMessage: string =
            error.response?.data.message || error.message;
          toastErrorMessage(errorMessage);
        }
      }
    },
  });

  useEffect(() => {
    if (credentials?.accessToken && credentials?.isVerified) {
      navigate("/dashboard");
    }
  }, [navigate, credentials?.accessToken, credentials?.isVerified]);

  const onSubmit = (values: FormDataType) => {
    mutate(values);
  };

  return (
    <section className="flex flex-col h-screen items-center justify-center bg-stone-50">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center text-blue-400 animate-bounce">
            X-PAY
          </CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
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
              <Button
                type="submit"
                disabled={isPending}
                className="font-bold text-lg self-center w-full bg-blue-400 hover:bg-blue-500"
              >
                {isPending ? (
                  <Loader className="animate-spin inline-block" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
