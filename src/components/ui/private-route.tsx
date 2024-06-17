import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth-store";

export const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const credentials = useAuth();

  const location = useLocation();

  return credentials?.roles?.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : credentials && credentials.accessToken ? (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
