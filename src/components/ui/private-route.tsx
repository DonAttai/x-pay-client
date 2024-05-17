import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/store/auth-store";

type JwtPayload = {
  roles: string[];
};

export const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const userCredentials = useAuth();
  const deocded = jwtDecode(
    userCredentials?.accessToken as string
  ) as JwtPayload;

  const location = useLocation();

  return deocded?.roles?.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : userCredentials && userCredentials.accessToken ? (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
