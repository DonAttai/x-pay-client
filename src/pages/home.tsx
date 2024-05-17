import { Link, useNavigate } from "react-router-dom";
import { ArrowDownToLine, LogIn } from "lucide-react";
import { useEffect } from "react";
import { UserCredentialsType } from "@/store/auth-store";

export const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userCredential: UserCredentialsType = JSON.parse(
      localStorage.getItem("userInfo")!
    );

    if (userCredential && userCredential.accessToken) {
      navigate("/login");
    }
  });
  return (
    <>
      <header className="h-16 bg-blue-400 font-bold ">
        <section className="h-full w-full flex items-center justify-between px-10">
          <div className="text-white text-2xl">X-Pay</div>

          <Link
            to="login"
            target="_blank"
            className=" bg-white p-2 rounded-full text-gray-400"
          >
            <LogIn className="inline-block mr-1" />
            Sign in
          </Link>
        </section>
      </header>
      <main className="container mx-auto px-8 py-10 bg-white shadow-md border rounded-md mt-8">
        <section className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Secure and Easy Payments
          </h2>
          <p className="text-gray-600">
            Make transactions with confidence using our secure payment platform.
          </p>
        </section>

        {/* <!-- Key Features Section --> */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* <!-- Feature 1 --> */}
          <div className="p-6 bg-gray-100 rounded-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Transfer Money
            </h3>
            <p className="text-gray-600">Description of feature 1.</p>
          </div>
          {/* <!-- Feature 2 --> */}
          <div className="p-6 bg-gray-100 rounded-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Withdraw Money
            </h3>
            <p className="text-gray-600">Description of feature 2.</p>
          </div>
          {/* <!-- Feature 3 --> */}
          <div className="p-6 bg-gray-100 rounded-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Deposite Money
            </h3>
            <p className="text-gray-600">Description of feature 3.</p>
          </div>
        </section>

        {/* <!-- Call-to-Action Section --> */}
        <section className="mt-8 flex justify-center">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">
              Get started today and experience seamless payments.
            </p>
            <Link
              to="register"
              target="_blank"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-fit font-bold"
            >
              <ArrowDownToLine className="inline-block mr-1" />
              Sign Up
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};
