import {
  Home,
  ArrowLeftRight,
  Wallet,
  ChevronDown,
  ChevronUp,
  MoveUpRight,
  MoveDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { CreateWallet } from "./create-wallet";
import { useWallet } from "@/hooks/useWallet";
import { Loader } from "lucide-react";

const isActiveStyles = {
  backgroundColor: "skyblue",
  color: "white",
  fontWeight: "bold",
  padding: "8px",
  borderRadius: "8px",
};

type SidebarPropType = {
  isDropDownOpen: boolean;
  toggleDropDown: () => void;
};

export const Sidebar = ({
  isDropDownOpen,
  toggleDropDown,
}: SidebarPropType) => {
  const { data: wallet, isPending } = useWallet();

  if (isPending) {
    return <Loader className="animate-spin inline-block" />;
  }

  return (
    <>
      <ul className="flex flex-col w-full p-4">
        {wallet ? (
          <>
            <NavLink
              to=""
              className="flex gap-2 items-center w-full text-sm p-2 mb-1 hover:bg-gray-300"
              style={({ isActive }) => {
                return isActive ? isActiveStyles : {};
              }}
              end
            >
              <Home size={16} /> Home
            </NavLink>
            <NavLink
              to="transactions"
              className="flex gap-2 items-center w-full text-sm p-2 mb-1 hover:bg-gray-300"
              style={({ isActive }) => {
                return isActive ? isActiveStyles : {};
              }}
              end
            >
              <ArrowLeftRight size={16} />
              Transactions
            </NavLink>
            <div
              className="flex items-center gap-2 text-sm p-2 mb-1 cursor-pointer hover:bg-gray-300"
              onClick={toggleDropDown}
            >
              <Wallet size={16} />
              <span>Wallet</span>
              {isDropDownOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {isDropDownOpen && (
              <div className={`pl-4 duration-300 ease-in-out `}>
                <NavLink
                  to="wallet/fund-wallet"
                  className="flex gap-2 items-center w-full text-sm p-2 mb-1 hover:bg-gray-300"
                  style={({ isActive }) => {
                    return isActive ? isActiveStyles : {};
                  }}
                  end
                >
                  Fund Wallet
                  <MoveDown size={16} />
                </NavLink>
                <NavLink
                  to="wallet/transfer-money"
                  className="flex gap-2 items-center w-full text-sm p-2 hover:bg-gray-300"
                  style={({ isActive }) => {
                    return isActive ? isActiveStyles : {};
                  }}
                  end
                >
                  Transfer Money
                  <MoveUpRight size={16} />
                </NavLink>
              </div>
            )}
          </>
        ) : (
          <CreateWallet />
        )}
      </ul>
    </>
  );
};
