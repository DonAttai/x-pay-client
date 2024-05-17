import { ColumnDef } from "@tanstack/react-table";

import { TransactionType } from "@/hooks/use-user";
import { formatted } from "@/lib/utils";

export const columns: ColumnDef<TransactionType>[] = [
  {
    accessorKey: "createdAt",
    header: "DATE",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return <div>{new Date(createdAt as string).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div>{formatted(amount)}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "TYPE",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
];
