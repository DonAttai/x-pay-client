import axiosInstance from "@/hooks/axios";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader } from "lucide-react";

const fetchUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const Users = () => {
  const {
    data: users,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl animate-spin">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {isSuccess && users.length ? (
        <div className="bg-stone-50 rounded-md p-10">
          <DataTable columns={columns} data={users} />
        </div>
      ) : (
        <p>No Users available</p>
      )}
    </div>
  );
};
