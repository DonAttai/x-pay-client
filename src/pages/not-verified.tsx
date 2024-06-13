import { useAuth } from "@/store/auth-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotVerified = () => {
  const credentials = useAuth()!;

  const navigate = useNavigate();

  useEffect(() => {
    if (credentials?.accessToken && credentials?.isVerified) {
      navigate("/dashboard");
    }
  }, [navigate, credentials?.accessToken, credentials?.isVerified]);

  return (
    <div className="h-screen flex flex-col items-center justify-center  space-y-4">
      <p className="text-5xl text-blue-400 animate-bounce">X-PAY</p>
      <p>
        A link has been sent to your email for verification, click on the link
        to verify your email
      </p>
    </div>
  );
};
