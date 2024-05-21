import { useUser } from "@/hooks/use-user";
import { useAuthActions } from "@/store/auth-store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, UserCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [greeting, setGreeting] = useState("");

  const { logOut } = useAuthActions();
  const { data: user } = useUser();
  console.log(user);

  const location = useLocation();
  const navigate = useNavigate();

  const navSection = [
    { title: "Transactions", path: "/dashboard/transactions" },
    { title: "Wallet", path: "/dashboard/wallet" },
    { title: "Users", path: "/dashboard/users" },
    { title: "Fund Wallet", path: "/dashboard/wallet/fund-wallet" },
    { title: "Transfer Money", path: "/dashboard/wallet/transfer-money" },
  ];

  const signOut = () => {
    logOut();
    navigate("/login");
  };

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
              {`${greeting}, ${user?.firstName?.toUpperCase()}`}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className="p-2 text-base rounded-full text-blue-400"
                style={{ wordSpacing: "-4px" }}
              >
                {user &&
                  `${user?.firstName[0].toUpperCase()}   ${user?.lastName[0].toUpperCase()}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <UserCheck size={16} className=" inline-block mr-2" />
                {/* {`${capitalizeFirstLetter(
                  user?.firstName!
                )} ${capitalizeFirstLetter(user?.lastName!)}`} */}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings size={16} className="mr-2" />
                  Profile Setting
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem className="text-red-600" onClick={signOut}>
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};
