import { ColumnDef } from "@tanstack/react-table";

import { getFullName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { UserDialog } from "@/components/ui/user-dialog";
import { UserCredentialsType } from "@/store/auth-store";
export const columns: ColumnDef<UserCredentialsType>[] = [
  {
    header: "NAME",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return <div>{getFullName(firstName, lastName)}</div>;
    },
  },

  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "roles",
    header: "ROLE",
  },
  {
    accessorKey: "isActive",
    header: "ACTIVE",
  },
  {
    accessorKey: "isVerified",
    header: "VERIFIED",
  },
  {
    accessorKey: "createdAt",
    header: "CREATED",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return <div>{new Date(createdAt as string).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <UserDialog user={user}>
          <Button variant={"outline"} size={"icon"}>
            <Edit size={16} />
          </Button>
        </UserDialog>
      );
    },
  },
];
