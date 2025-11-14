"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingCart } from "lucide-react";
import ProfileIcon from "apps/user-ui/src/assets/Profile-icon";
import HeaderBottom from "./HeaderBottom";
import { useUser } from "apps/user-ui/src/hooks/useUser";

const Header = () => {
  const { user, isLoading } = useUser();
  return (
    <div className="w-full bg-white">
      <div className="w-[90%] py-5 mx-auto flex items-center justify-between">
        <div className="">
          <Link
            href="/"
            className="text-4xl font-Poppins font-extrabold tracking-tight"
          >
            <span className="text-gray-900">Multi</span>
            <span className="text-red-600">Mart</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px]"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0">
            <Search className="text-white" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <Link
                  href={"/profile"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <div style={{ color: "black" }}>
                    <ProfileIcon width={32} height={32} />
                  </div>
                </Link>
                <Link href={"/profile"}>
                  <span className="block font-medium">Hello</span>
                  <span className="block font-semibold">{user.name.split(" ")[0]}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <div style={{ color: "black" }}>
                    <ProfileIcon width={32} height={32} />
                  </div>
                </Link>
                <Link href={"/login"}>
                  <span className="block font-medium">Hello</span>
                  <span className="block font-semibold">{isLoading?"...":"Sign In"}</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Link href={"/wishlist"} className="relative">
              <HeartIcon />
              <div className="w-5 h-5 border-none  bg-red-500 rounded-full flex items-center justify-center absolute top-[-4px] right-[-12px]">
                <span className="text-white font-semibold text-[12px] leading-none">
                  0
                </span>
              </div>
            </Link>
            <Link href={"/cart"} className="relative">
              <ShoppingCart />
              <div className="w-5 h-5 border-none  bg-red-500 rounded-full flex items-center justify-center absolute top-[-4px] right-[-10px]">
                <span className="text-white font-semibold text-[12px] leading-none">
                  0
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-b-slate-200">
        <HeaderBottom />
      </div>
    </div>
  );
};

export default Header;
