import { ColumnDef } from "@tanstack/react-table";

import { UserType } from "@/hooks/use-user";
import { getFullName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { UserDetails } from "@/components/ui/user-details";
export const columns: ColumnDef<UserType>[] = [
  {
    header: "NAME",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return <div>{getFullName(firstName, lastName)}</div>;
    },
  },

  {
    accessorKey: "email",
    header: "Email",
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
        <UserDetails user={user}>
          <Button variant={"outline"} size={"icon"}>
            <Edit size={16} />
          </Button>
        </UserDetails>
      );
    },
  },
];
