import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { CreateUserDialog } from "@/components/ui/create-user-dialog";

export const ManageUsers = () => {
  const { data: users, isPending, isSuccess } = useUsers();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl animate-spin">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isSuccess && users.length ? (
        <div className="rounded-md p-10">
          <div className="text-right">
            <CreateUserDialog />
          </div>
          <h3 className="mb-4 mt-4 text-center text-xl font-bold">
            Account Management
          </h3>
          <DataTable columns={columns} data={users} />
        </div>
      ) : (
        <p>No Users available</p>
      )}
    </>
  );
};
