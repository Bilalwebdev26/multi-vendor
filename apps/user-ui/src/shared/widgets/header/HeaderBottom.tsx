// "use client";
// import { AlignLeft, ChevronDown } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const HeaderBottom = () => {
//   const [show, setShow] = useState(false);
//   const [stciky, setSticky] = useState(false);
//   //track scroll position
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 100) {
//         setSticky(true);
//       } else {
//         setSticky(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   return (
//     <div
//       className={`w-full transition-all duration-300 ${
//         stciky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
//       }`}
//     >
//       <div
//         className={`w-[80%] relative mx-auto flex items-center justify-between ${
//           stciky ? "pt-3" : "py-0"
//         }`}
//       >
//         {/* All dropdown */}
//         <div
//           className={`w-[260px] ${
//             stciky && "-mb-2"
//           } cursor-pointer flex items-center justify-center px-5 h-[50px] bg-[#3489ff]`}
//           onClick={() => setShow(!show)}
//         >
//             <div className="flex items-center gap-2">
//                 <AlignLeft color="white"/>
//                 <span className="text-white font-medium">All Departments</span>
//             </div>
//             <ChevronDown color="white"/>
//         </div>
//         {/* DropDown menu */}
//         {show && (
//             <div className={`absolute left-0 ${stciky?"top-[70px]":"top-[50px]"} w-[260px] h-[400px] bg-[#f5f5f5]`}></div>
//         )}
//       </div>
//     </div>
//   );
// };

//  export default HeaderBottom;
"use client";
import ProfileIcon from "apps/user-ui/src/assets/Profile-icon";
import { navItems } from "apps/user-ui/src/configs/constants";
import { useUser } from "apps/user-ui/src/hooks/useUser";
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeaderBottom = () => {
    const { user, isLoading } = useUser();
  const [show, setShow] = useState(false);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // const { user } = useUser();
  // console.log("User : ", user);
  return (
    <div
      className={`w-full transition-all duration-300 ${
        sticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative mx-auto flex items-center justify-between ${
          sticky ? "py-3" : "py-0"
        }`}
      >
        {/* All dropdown button */}
        <div
          className={`w-[260px] ${
            sticky && "-mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown color="white" />
        </div>

        {/* DropDown menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              sticky ? "top-[70px]" : "top-[50px]"
            } w-[260px] bg-[#f5f5f5] shadow-md rounded-b-md`}
          >
            {/* Dropdown content here */}
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-200">Electronics</li>
              <li className="px-4 py-2 hover:bg-gray-200">Clothing</li>
              <li className="px-4 py-2 hover:bg-gray-200">Home & Garden</li>
            </ul>
          </div>
        )}
        {/* Navihation Links */}
        <div className="flex items-center">
          {navItems.map((nav: NavItemsTypes, index: number) => (
            <Link
              href={`/${nav.href}`}
              key={index}
              className="px-5 font-medium text-lg"
            >
              {nav.title}
            </Link>
          ))}
        </div>
        <div className="">
          {sticky && (
            // <div className="flex items-center gap-8">
            //   <div className="flex items-center gap-2">
            //     <Link
            //       href={"/login"}
            //       className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
            //     >
            //       <div style={{ color: "black" }}>
            //         <ProfileIcon width={32} height={32} />
            //       </div>
            //     </Link>
            //     <Link href={"/login"}>
            //       <span className="block font-medium">Bilal</span>
            //       <span className="block font-semibold">Sign In</span>
            //     </Link>
            //   </div>
            //   <div className="flex items-center gap-5">
            //     <Link href={"/wishlist"} className="relative">
            //       <HeartIcon />
            //       <div className="w-5 h-5 border-none  bg-red-500 rounded-full flex items-center justify-center absolute top-[-4px] right-[-12px]">
            //         <span className="text-white font-semibold text-[12px] leading-none">
            //           0
            //         </span>
            //       </div>
            //     </Link>
            //     <Link href={"/cart"} className="relative">
            //       <ShoppingCart />
            //       <div className="w-5 h-5 border-none  bg-red-500 rounded-full flex items-center justify-center absolute top-[-4px] right-[-10px]">
            //         <span className="text-white font-semibold text-[12px] leading-none">
            //           0
            //         </span>
            //       </div>
            //     </Link>
            //   </div>
            // </div>
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
                      <span className="block font-semibold">
                        {user.name.split(" ")[0]}
                      </span>
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
                      <span className="block font-semibold">
                        {isLoading ? "..." : "Sign In"}
                      </span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
