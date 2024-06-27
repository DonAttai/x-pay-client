import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

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
          <h3 className="mb-4 mt-8 text-center text-xl font-bold">
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
