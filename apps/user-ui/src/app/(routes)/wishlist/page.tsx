"use client";
import { useDeviceTracking } from "apps/user-ui/src/hooks/useDeviceInfo";
import { useLocationTrack } from "apps/user-ui/src/hooks/useLocationTracking";
import { useUser } from "apps/user-ui/src/hooks/useUser";
import { useStore } from "apps/user-ui/src/store";
import { Heart, Home, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const [quantity, setQuantity] = useState();
  //zustand state
  const addToCart = useStore((state: any) => state.addToCart);
  const addProductWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const removeProductWishlist = useStore(
    (state: any) => state.removeFromWishlist
  );
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);
  //const isInCart = cart.some((item: any) => item.id === product.id);
  //const isWishlist = wishlist.some((item: any) => item.id === product.id);
  const location = useLocationTrack();
  const user = useUser();
  const deviceInfo = useDeviceTracking();
  const decreaseQuantity = (id: string) => {
    const selectWishlist = wishlist.find((item: any) => item.id === id);
    if (selectWishlist.quantity === 1)
      toast.error("Wishlist product you selected in not present");
    console.log("selectWishlist : ", selectWishlist.quantity);
    // selectWishlist.qunatity -= 1;
    // setQuantity(selectWishlist.qunatity)
    //-----------------------------
    useStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };
  const increaseQunatity = (id: string) => {
    useStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  };
  return (
    <div className={`w-full bg-white`}>
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        {/* Breadcrumbs */}
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-semibold font-Roboto text-[44px] leading-[1px] mb-[16px]">
            Wishlist
          </h1>
          {/* <div className="flex items-center gap-2">
          <Link href={"/"} className="flex items-center justify-center text-[#55585b] hover:underline mt-2">
            <Home />
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 text-black"> / </span>
          <span className="text-[#55585b]">Wishlist</span>
          </div> */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 text-[#55585b] hover:underline"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <span className="text-black" aria-hidden="true">
              /
            </span>

            <span className="text-[#55585b]" aria-current="page">
              Wishlist
            </span>
          </div>
        </div>
        {/* WIshlist products */}
        {wishlist.length < 1 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-gray-100 rounded-full shadow-sm">
              <Heart className="w-12 h-12 text-gray-500" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-gray-700">
              Your Wishlist is Empty
            </h2>

            <p className="mt-2 text-gray-500 max-w-sm">
              Looks like you haven’t added any items yet. Start exploring and
              add products you love!
            </p>

            <Link
              href="/"
              className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* wishlist itme table */}
            <table className="w-full border-collapse">
              <thead className="bg-[#f1f3f4]">
                <tr>
                  <th className="py-3 text-left pl-4">Product</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Qunatity</th>
                  <th className="py-3 text-left">Action</th>
                  <th className="py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {wishlist?.map((item: any) => (
                  <tr key={item.id} className="border-b border-b-[#0000000e]">
                    <td className="flex items-center gap-3 p-4">
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                      <Link
                        href={`/product/${item.slug}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-1 text-lg">
                      ${item.sale_price.toFixed(2)}
                    </td>
                    <td>
                      <div className="flex justify-center items-center gap-2 border border-gray-200 rounded-[20px] w-[90px]">
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => increaseQunatity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 ">
                        <button
                          className="hover:bg-blue-400 cursor-pointer text-white px-5 py-2 rounded-md bg-blue-600 transition-all"
                          onClick={() =>
                            addToCart(item, user, location, deviceInfo)
                          }
                        >
                          Add To Cart
                        </button>
                        <button
                          className="flex items-center hover:bg-red-400 cursor-pointer text-white px-5 py-2 rounded-md bg-red-600 transition-all"
                          onClick={() =>
                            removeProductWishlist(
                              item.id,
                              user,
                              location,
                              deviceInfo
                            )
                          }
                        >
                          <Trash2Icon size={22} className="text-white" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
