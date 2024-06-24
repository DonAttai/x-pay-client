import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserCredentialsType } from "@/store/auth-store";
import { LogOut, Settings, User } from "lucide-react";

type PropType = {
  user: UserCredentialsType;
  signOut: () => void;
};

export const UserProfile = ({ user, signOut }: PropType) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfilePicture user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {user && `${user.firstName} ${user.lastName}`}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function ProfilePicture({ user }: { user: UserCredentialsType }) {
  const firstNameInitial = user?.firstName[0].toUpperCase();
  const lastNameInitial = user?.lastName[0].toUpperCase();
  return (
    <Avatar>
      <AvatarImage />
      <AvatarFallback className="text-blue-400 font-bold">
        {user && `${firstNameInitial}${lastNameInitial}`}
      </AvatarFallback>
    </Avatar>
  );
}
