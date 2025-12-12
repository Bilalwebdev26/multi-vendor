"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Rating from "../Ratings";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import ProductDetail from "../ProductDetail";
import { useStore } from "apps/user-ui/src/store";
import { useLocationTrack } from "apps/user-ui/src/hooks/useLocationTracking";
import { useUser } from "apps/user-ui/src/hooks/useUser";
import { useDeviceTracking } from "apps/user-ui/src/hooks/useDeviceInfo";

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [open, setOpen] = useState(false);
  //zustand state
  const addToCart = useStore((state: any) => state.addToCart);
  const addProductWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const removeProductWishlist = useStore(
    (state: any) => state.removeFromWishlist
  );
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === product.id);
  const isWishlist = wishlist.some((item: any) => item.id === product.id);
  const location = useLocationTrack()
  const user = useUser()
  const deviceInfo = useDeviceTracking()
  useEffect(() => {
    if (isEvent && product?.ending_data) {
      //Live date nikalo
      const interval = setInterval(() => {
        const endTime = new Date(product?.ending_data).getTime();
        const now = Date.now();
        const diff = endTime - now;
        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
        const minutes = Math.floor((diff / (60 * 1000)) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, []);
  return (
    <div className="w-full min-h-[350px] h-max bg-white rounded-lg relative">
      {isEvent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          OFFER
        </div>
      )}
      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-sm">
          Limited Stock
        </div>
      )}
      <Link href={`/product/${product?.slug}`}>
        <img
          src={product?.images[0]?.url}
          alt={`/product/${product?.slug}`}
          width={300}
          height={300}
          className="w-full h-[200px] object-cover mx-auto rounded-t-lg"
        />
      </Link>
      <Link
        href={`/product/${product?.shops?.name}`}
        className="block text-blue-500 text-sm font-medium my-2 px-2"
      >
        {product?.shops?.name}
      </Link>
      <Link
        href={`/product/${product?.slug}`}
        className="text-gray-800 line-clamp-1 text-base font-semibold my-2 px-2"
      >
        {product?.title}
      </Link>
      <div className="mt-2 px-2 ">
        <Rating rating={product?.rattings} />
      </div>
      <div className="mt-2 flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800">
            ${product?.sale_price}
          </span>
          <span className="text-base font-semibold text-gray-500 line-through">
            ${product?.regular_price}
          </span>
        </div>
        <span className="text-green-500 text-sm font-semibold">
          {product?.totalSales} sold
        </span>
      </div>
      {/* IsEvent  */}
      {isEvent && timeLeft && (
        <div className="mt-2">
          <span className="inline-block text-xs bg-orange-100 text-red-500">
            {timeLeft}
          </span>
        </div>
      )}
      <div className="absolute z-10 flex flex-col gap-3 right-3 top-5">
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Heart
            size={22}
            fill={isWishlist?"red":"#4B5563"}
            stroke={isWishlist?"red":"transparent"}
            className="cursor-pointer hover:scale-110 transition"
            onClick={() =>
              isWishlist
                ? removeProductWishlist(product.id, user, location, deviceInfo)
                : addProductWishlist(
                    { ...product, quantity: 1 },
                    user,
                    location,
                    deviceInfo
                  )
            }
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Eye
            size={22}
            className="cursor-pointer hover:scale-110 transition"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <ShoppingBag
            size={22}
            className="cursor-pointer hover:scale-110 transition"
            onClick={()=>!isInCart &&(addToCart({...product,quantity:1},user,location,deviceInfo))}
          />
        </div>
      </div>
      {open && <ProductDetail data={product} setOpen={setOpen} />}
    </div>
  );
};

export default ProductCard;
