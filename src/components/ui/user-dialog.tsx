import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import {
  getFullName,
  toastErrorMessage,
  toastSuccessMessage,
} from "@/lib/utils";
import { UserCredentialsType } from "@/store/auth-store";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

const updateUserSchema = z.object({
  firstName: z.string().min(1, { message: "required" }),
  lastName: z.string().min(1, { message: "required" }),
  isActive: z.boolean(),
  roles: z.string(),
});

type UserType = z.infer<typeof updateUserSchema>;

export function UserDialog({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserCredentialsType;
}) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  const [isActive, setIsActive] = useState(user.isActive);
  const [roles, setRole] = useState(user.roles[0]);

  const queryClient = useQueryClient();

  const { isSuccess, mutate, isPending } = useMutation({
    mutationFn: async (userData: UserType) => {
      const res = await axiosInstance.patch(`/users/${user.id}`, userData);
      return res.data;
    },
    onSuccess: (data) => {
      toastSuccessMessage(data.message);

      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
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

  // toast success message
  useEffect(() => {
    if (isSuccess) {
      setFormData({ firstName: "", lastName: "" });
      setRole("");
    }
  }, [setFormData, setRole]);

  // handle sub mit
  const handleSubmit = () => {
    const validatedData = updateUserSchema.safeParse({
      ...formData,
      isActive,
      roles,
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit {getFullName(user?.firstName, user?.lastName)}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              First Name
            </Label>
            <Input
              id="name"
              name="firstName"
              defaultValue={formData.firstName}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Last Name
            </Label>
            <Input
              id="username"
              name="lastName"
              defaultValue={formData.lastName}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={roles} onValueChange={(role) => setRole(role)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Active
            </Label>
            <Checkbox
              id="active"
              checked={isActive}
              onCheckedChange={(value: boolean) => setIsActive(value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader className="animate-spin inline-block" />
            ) : (
              " Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
