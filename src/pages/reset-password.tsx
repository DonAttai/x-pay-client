import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useAuth } from "@/store/auth-store";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(1, { message: "New password is required" }),
});

type FormDataType = z.infer<typeof formSchema>;

type DataType = FormDataType & {
  token: string;
  id: string;
};

export const ResetPassword = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const [searchParams] = useSearchParams();
  const { id, token } = Object.fromEntries(searchParams);

  const navigate = useNavigate();
  const credentials = useAuth();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: DataType): Promise<{ message: string }> => {
      const res = await axiosInstance.post("/auth/reset-password", data);
      return res.data;
    },
    onSuccess: (data) => {
      form.reset();
      navigate("/login");
      toastSuccessMessage(data.message);
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
      }
    },
  });

  useEffect(() => {
    if (credentials?.accessToken && credentials?.isVerified) {
      navigate("/dashboard");
    }
  }, [navigate, credentials?.accessToken, credentials?.isVerified]);

  const onSubmit = (values: FormDataType) => {
    const data = { ...values, token, id };
    console.log(data);
    mutate(data);
  };

  return (
    <section className="flex flex-col h-screen items-center justify-center bg-stone-50">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center text-blue-400 animate-bounce">
            X-PAY
          </CardTitle>
          <CardDescription>Enter new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New Password"
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
