import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { fromError } from "zod-validation-error";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, { message: "required" }),
  lastName: z.string().min(1, { message: "required" }),
  password: z.string().min(1, { message: "required" }),
  role: z.string().min(1),
});
type UserType = z.infer<typeof schema>;

export function CreateUserDialog() {
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData: UserType) => {
      const res = await axiosInstance.post("/auth/register", userData);
      return res.data;
    },
    onSuccess: (data) => {
      toastSuccessMessage(data.message);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      });
      setRole("");
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage = error?.response?.data.message;
        toastErrorMessage(errorMessage);
      } else {
        toastErrorMessage(error.message);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const validatedData = schema.safeParse({
      ...formData,
      role,
    });

    if (!validatedData.success) {
      const error = fromError(validatedData.error);
      toastErrorMessage(error.message);
      return;
    }

    mutate(validatedData.data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant="secondary">Create User</Button> */}
        <p>Create User</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Enter user details. Click create user when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              defaultValue={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={formData.firstName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={formData.lastName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              defaultValue={formData.password}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Role</Label>
            <Select value={role} onValueChange={(role) => setRole(role)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader className="animate-spin inline-block" />
            ) : (
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
