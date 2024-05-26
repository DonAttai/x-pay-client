import { useUser } from "@/hooks/use-user";
import { useAuthActions } from "@/store/auth-store";
import { Link, useNavigate } from "react-router-dom";
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
import { capitalizeFirstLetter } from "@/lib/utils";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = () => {
    setIsOpen(false);
  };
  const { logOut } = useAuthActions();
  const { data: user } = useUser();

  const navigate = useNavigate();

  const signOut = () => {
    logOut();
    navigate("/login");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="rounded-full text-blue-400 w-10 h-10 font-bold border-none outline-none focus-visible:ring-0"
        >
          {user &&
            `${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <UserCheck size={16} className=" inline-block mr-2" />
          {`${capitalizeFirstLetter(user?.firstName!)} ${capitalizeFirstLetter(
            user?.lastName!
          )}`}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings size={16} className="mr-2" />
            <Link to="settings" onClick={handleSelect}>
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem className="text-red-600" onClick={signOut}>
          <LogOut size={16} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
