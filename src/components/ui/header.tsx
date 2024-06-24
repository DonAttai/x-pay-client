import { useAuth } from "@/store/auth-store";
import { useEffect, useState } from "react";

export const Header = (props: { children: React.ReactNode }) => {
  const [greeting, setGreeting] = useState("");
  // const { data: user } = useUser();

  const credentials = useAuth();

  const navSection = [
    { title: "Transactions", path: "/dashboard/transactions" },
    { title: "Wallet", path: "/dashboard/wallet" },
    { title: "Users", path: "/dashboard/users" },
    { title: "Fund Wallet", path: "/dashboard/wallet/fund-wallet" },
    { title: "Transfer Money", path: "/dashboard/wallet/transfer-money" },
    { title: "Settings", path: "/dashboard/settings" },
  ];

  const greet = () => {
    let today = new Date(),
      hour = today.getHours();

    hour < 12
      ? setGreeting("Good Morning")
      : hour < 18
      ? setGreeting("Good Afternoon")
      : setGreeting("Good Evening");
  };

  useEffect(() => {
    greet();
  }, [greet]);

  return (
    <header className="h-20 sticky top-0 right-0 ml-52 border-l bg-stone-50 z-10 ">
      <nav className="w-full h-full ">
        <div className="w-full h-full flex gap-2 justify-between pl-6 pr-32 items-center relative">
          {location.pathname === "/dashboard" ? (
            <p className="text-lg font-semibold">
              {credentials &&
                `${greeting}, ${credentials?.firstName?.toUpperCase()}`}
            </p>
          ) : (
            navSection.map((section) => {
              return location.pathname === section.path ? (
                <p key={section.title} className="text-lg font-semibold">
                  {section.title}
                </p>
              ) : null;
            })
          )}
          {props.children}
        </div>
      </nav>
    </header>
  );
};
