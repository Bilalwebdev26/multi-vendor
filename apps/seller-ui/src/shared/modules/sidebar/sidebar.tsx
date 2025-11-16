"use client";
import { useSeller } from "apps/seller-ui/src/hooks/useSeller";
import useSideBar from "apps/seller-ui/src/hooks/useSideBar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Box } from "../Box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import { BadgeCheck, BellPlus, Boxes, CalendarPlus, CreditCard, Package, SquarePlus } from "lucide-react";
import SideBarItems from "./sidebar.items";
import { Home } from "lucide-react";
import SidebarMenu from "./sidebar.menu";

const SideBarWrapper = () => {
  const { activeSideBar, setAciveSideBar } = useSideBar();
  const { seller } = useSeller();
  console.log("Seller from Sidebar : ", seller);
  const pathName = usePathname();
  useEffect(() => {
    setAciveSideBar(pathName);
  }, [pathName, setAciveSideBar]);
  const getIconColor = (route: string) =>
    activeSideBar === route ? "#0085ff" : "#969696";
  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflow: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link
            href="/"
            className="font-Poppins font-semibold tracking-tight flex items-center justify-center gap-2"
          >
            <BadgeCheck />
            <Box>
              <h3 className="text-white">{seller?.shop?.name}</h3>
              <h5 className="font-medium text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SideBarItems
            title="Dashboard"
            icon={<Home />}
            isActive={activeSideBar === "/dashboard"}
            href="/dashboard"
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SideBarItems
                title="Orders"
                icon={<Package color={getIconColor("/dashboard/orders")}/>}
                isActive={activeSideBar === "/dashboard/orders"}
                href="/dashboard/orders"
              />
              <SideBarItems
                title="Payments"
                icon={<CreditCard color={getIconColor("/dashboard/payments")}/>}
                isActive={activeSideBar === "/dashboard/payments"}
                href="/dashboard/payments"
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SideBarItems
                title="Products"
                icon={<Boxes color={getIconColor("/dashboard/products")}/>}
                isActive={activeSideBar === "/dashboard/products"}
                href="/dashboard/products"
              />
              <SideBarItems
                title="Create Products"
                icon={<SquarePlus color={getIconColor("/dashboard/create-products")}/>}
                isActive={activeSideBar === "/dashboard/create-products"}
                href="/dashboard/create-products"
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SideBarItems
                title="Create Events"
                icon={<CalendarPlus color={getIconColor("/dashboard/create-events")}/>}
                isActive={activeSideBar === "/dashboard/create-events"}
                href="/dashboard/create-events"
              />
              <SideBarItems
                title="All Events"
                icon={<BellPlus color={getIconColor("/dashboard/all-events")}/>}
                isActive={activeSideBar === "/dashboard/all-events"}
                href="/dashboard/all-events"
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SideBarItems
                title="Create Events"
                icon={<CalendarPlus color={getIconColor("/dashboard/create-events")}/>}
                isActive={activeSideBar === "/dashboard/create-events"}
                href="/dashboard/create-events"
              />
              <SideBarItems
                title="All Events"
                icon={<BellPlus color={getIconColor("/dashboard/all-events")}/>}
                isActive={activeSideBar === "/dashboard/all-events"}
                href="/dashboard/all-events"
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
