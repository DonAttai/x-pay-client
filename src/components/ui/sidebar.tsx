import { Home, ArrowLeftRight, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { CreateWallet } from "./create-wallet";
import { useWallet } from "@/hooks/useWallet";
import { Loader } from "lucide-react";

interface MenuItem {
  label: string;
  link: string;
  icon?: React.ComponentType<any>;
  children?: MenuItem[];
}
const menuItems: MenuItem[] = [
  { label: "Home", link: "", icon: Home },
  {
    label: "Transactions",
    link: "transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Wallet",
    link: "wallet",
    icon: Wallet,
    children: [
      { label: "Fund Wallet", link: "wallet/fund-wallet" },
      { label: "Transfer Money", link: "wallet/transfer-money" },
    ],
  },
];

const isActiveStyles = {
  backgroundColor: "skyblue",
  color: "white",
  fontWeight: "bold",
  padding: "4px",
  borderRadius: "8px",
};

export const Sidebar = () => {
  const { data: wallet, isPending } = useWallet();

  if (isPending) {
    return <Loader className="animate-spin inline-block" />;
  }

  return (
    <>
      <ul className="flex flex-col w-full p-4">
        {wallet ? (
          <>
            {menuItems.map((item) => {
              const LinkIcon = item.icon!;
              {
                return item.children ? (
                  <div key={item.label}>
                    <NavLink
                      to={item.link}
                      className="flex gap-2 items-center w-full text-sm mt-3"
                      style={({ isActive }) => {
                        return isActive ? isActiveStyles : {};
                      }}
                      end
                    >
                      <LinkIcon size={16} />
                      {item.label}
                    </NavLink>

                    <ul className="pl-8 mb-0">
                      {item.children.map((subItem) => (
                        <NavLink
                          key={subItem.label}
                          to={subItem.link}
                          className="flex gap-2 items-center w-full text-sm mt-1  "
                          style={({ isActive }) => {
                            return isActive ? isActiveStyles : {};
                          }}
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <NavLink
                    to={item.link}
                    key={item.label}
                    className="flex gap-2 items-center w-full text-sm mt-3"
                    style={({ isActive }) => {
                      return isActive ? isActiveStyles : {};
                    }}
                    end
                  >
                    <LinkIcon size={16} />
                    {item.label}
                  </NavLink>
                );
              }
            })}
          </>
        ) : (
          <CreateWallet />
        )}
      </ul>
    </>
  );
};
