"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Rating from "../Ratings";
import {
  Heart,
  Info,
  MapPin,
  MessageCircleMore,
  ShoppingCartIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "apps/user-ui/src/store";
import { useLocationTrack } from "apps/user-ui/src/hooks/useLocationTracking";
import { useDeviceTracking } from "apps/user-ui/src/hooks/useDeviceInfo";
import { useUser } from "apps/user-ui/src/hooks/useUser";

const ProductDetail = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [isSelectedSize, setIsSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const cart = useStore((state: any) => state.cart);
  const wishlist = useStore((state: any) => state.wishlist);
  const location = useLocationTrack();
  const deviceInfo = useDeviceTracking();
  const user = useUser();
  const isInCart = cart.some((item: any) => item.id === data.id);
  const isInWishlist = wishlist.some((item: any) => item.id === data.id);
  const addToCart = useStore((state: any) => state.addToCart);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed top-0 left-0 w-full h-screen bg-[#0000001d] bg-opacity-45 z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] md:w-[80%] md:mt-14 2xl:mt-0 h-max overflow-scroll min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg z-200"
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data.images?.[activeImage]?.url}
              alt=""
              height={300}
              width={300}
              className="w-full rounded-lg object-contain"
            />
            <div className="flex items-center justify-center gap-2 mt-4 overflow-x-scroll w-full">
              {data.images?.map((img: any, index: number) => {
                // const newIndex = index === activeImage ? '' : index
                if (index === activeImage) return null; // Skip active image
                return (
                  <div className="">
                    <Image
                      src={data.images?.[index]?.url}
                      alt={`Thumbnail-${index}`}
                      width={80}
                      height={80}
                      className="w-full rounded-lg object-contain"
                      onClick={() => setActiveImage(index)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0 relative">
            {/* Seller Info */}
            <div className="border-b relative pb-3 border-gray-200 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-3  w-full">
                  {/* Shop */}
                  <Link
                    href={`/shop/${data?.shops?.id}`}
                    className="font-bold font-Oregano text-gray-800 text-lg"
                  >
                    {data?.shops?.name}
                  </Link>
                  <span className="flex items-center justify-center relative">
                    <Rating rating={data?.shops?.ratting} />(
                    {data?.shops?.ratting})
                  </span>
                  <span className="text-gray-600 mt-1 flex items-center gap-1 line-clamp-1">
                    <MapPin size={16} />{" "}
                    <p>{data?.shops?.address || "Location Not Available."}</p>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full ">
                <button
                  className="flex cursor-pointer mt-1 hover:scale-105 transition items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                  onClick={() =>
                    router.push(`/inbox?shopId=${data?.shops?.id}`)
                  }
                >
                  <MessageCircleMore size={16} />
                  <span className="font-Roboto text-sm">Chat with Seller</span>
                </button>
                <button className=" cursor-pointer flex justify-end absolute top-[-20px] -right-2">
                  <X size={22} onClick={() => setOpen(false)} />
                </button>
              </div>
            </div>
            {/* Title */}
            <h3 className="text-xl font-semibold font-Poppins mt-2">
              {data?.title}
            </h3>
            <p className="mt-1 w-full text-gray-700 whitespace-pre-wrap">
              {data?.description}
            </p>
            {data?.brand && (
              <p className="mt-1 w-full text-gray-700 whitespace-pre-wrap">
                Brand : {data?.brand}
              </p>
            )}
            <div className="flex flex-col md:flex-row items-start gap-5">
              {data?.colors.length > 0 && (
                <div className="">
                  <strong>Color : </strong>
                  <div className="flex gap-2 mt-1">
                    {data?.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 cursor-pointer rounded-full border-2 transition-all ${
                          isSelected === color
                            ? "border-gray-400 scale-105 transition-all shadow-md"
                            : "border-gray-100 border-1"
                        }`}
                        onClick={() => setIsSelected(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row items-start gap-5">
              {data?.sizes.length > 0 && (
                <div className="">
                  <strong>Size : </strong>
                  <div className="flex gap-2 mt-1">
                    {data?.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 cursor-pointer rounded-md  border-2 transition-all ${
                          isSelectedSize === size
                            ? "border-gray-400 scale-105 transition-all shadow-md bg-gray-500 "
                            : "border-transparent bg-gray-300 "
                        }`}
                        onClick={() => setIsSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Price and add to cart */}
            <div className="flex justify-between items-center">
              <div className="mt-5 flex items-center gap-4">
                <h3 className="text-3xl font-semibold text-gray-900">
                  ${data?.sale_price}
                </h3>
                {data?.regular_price && (
                  <h3 className="text-xl font-semibold text-red-600 line-through ml-1">
                    ${data?.regular_price}
                  </h3>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors font-semibold text-gray-700"
                >
                  -
                </button>

                <span className="text-lg font-semibold min-w-[2rem] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors font-semibold text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
            {/*  */}
            <div className="flex items-center justify-center gap-3">
              <button
                disabled={isInCart}
                onClick={() =>
                  addToCart(
                    {
                      ...data,
                      quantity: 1,
                      selectedOptions: {
                        color: isSelected,
                        size: isSelectedSize,
                      },
                    },
                    user,
                    location,
                    deviceInfo
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition ${
                  isInCart ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <ShoppingCartIcon size={18} />
                <span>Add to Cart</span>
              </button>
              <button className={`opacity-[.7] cursor-pointer`}>
                <Heart
                  size={28}
                  fill={isInWishlist ? "red" : "transparent"}
                  color="black"
                  onClick={() =>
                    isInWishlist
                      ? removeFromWishlist(data.id, user, location, deviceInfo)
                      : addToWishlist(
                          { ...data, quantity: 1 },
                          user,
                          location,
                          deviceInfo
                        )
                  }
                />
              </button>
              <button
                className="bg-emerald-400 px-4 py-2 hover:bg-emerald-600 transition-all text-white font-medium rounded-lg flex items-center justify-center gap-2"
                onClick={() => router.push("/")}
              >
                <Info size={18} />
                More Details
              </button>
            </div>
            <div className="mt-2">
              {data?.stock <= 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping absolute"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  In Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
