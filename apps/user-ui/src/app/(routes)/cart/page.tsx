"use client";
import { useDeviceTracking } from "apps/user-ui/src/hooks/useDeviceInfo";
import { useLocationTrack } from "apps/user-ui/src/hooks/useLocationTracking";
import { useUser } from "apps/user-ui/src/hooks/useUser";
import EmptyCart from "apps/user-ui/src/shared/widgets/Cart/EmptyCart";
import { useStore } from "apps/user-ui/src/store";
import { Home, Loader2, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const router = useRouter();
  const user = useUser();
  const location = useLocationTrack();
  const deviceInfo = useDeviceTracking();
  const cart = useStore((state: any) => state.cart);
  const wishlist = useStore((state: any) => state.wishlist);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const [loading, setLoading] = useState<boolean>(true);
  const [discountProductId, setDiscountProductId] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
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
  //remove from cart
  const removeItem = (id: string) =>
    removeFromCart(id, user, location, deviceInfo);
  //subtotal
  const subTotal = cart.reduce(
    (total: number, item: any) => total + item.quantity * item.sale_price,
    0
  );
  const CouponCodeApply = () => {};
  return (
    <div className="w-full bg-white ">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        {/* Breadcrumbs */}
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-semibold font-Roboto text-[44px] leading-[1px] mb-[16px]">
            Cart
          </h1>
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
              Cart
            </span>
          </div>
        </div>
        {/* Main Content */}
        {cart.length < 1 ? (
          <EmptyCart />
        ) : (
          <div className="flex item-start gap-10">
            <table className="w-full lg:w-[70%] border-collapse">
              <thead className="bg-[#f1f3f4] rounded">
                <tr>
                  <th className="py-3 text-left pl-4">Product</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Qunatity</th>
                  <th className="py-3 text-left">Action</th>
                  <th className="py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((item: any) => (
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
                      {item?.selectedOptions && (
                        <div className="text-sm text-gray-500">
                          {item?.selectedOptions.color && (
                            <span>
                              Color:
                              <span
                                style={{
                                  backgroundColor: item?.selectedOptions.color,
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "100%",
                                  display: "inline-block",
                                }}
                              />
                            </span>
                          )}
                          {item?.selectedOptions.size && (
                            <span>Size:{item?.selectedOptions.size}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-1 text-lg">
                      {/* ----------------------------Here start 2:00 discount code------------------------- */}
                      {item?.id === discountProductId ? (
                        <div className="flex flex-col items-center">
                          <span className="line-through text-gray-500">
                            ${item?.sale_price.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            ${item?.sale_price * (1 - discountPercent / 100)}
                          </span>
                        </div>
                      ) : (
                        <span className="">${item.sale_price.toFixed(2)}</span>
                      )}
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
                    {/* Subtotal */}
                    <td>
                      <div className="">
                        <button
                          className="hover:bg-red-400 cursor-pointer text-white flex items-center gap-2 px-5 py-2 rounded-md bg-[#ff1826] transition-all"
                          onClick={() =>
                            removeFromCart(item.id, user, location, deviceInfo)
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
            <div className="p-6 shadow-md w-full lg:w-[30%] bg-[#f9f9f9] rounded-lg">
              {discountAmount >0 && (
                <div className="flex justify-between items-center text-[#010f1c] text-base font-medium pb-1">
                  <span className="font-Poppins">
                    Discount ({discountPercent}$)
                  </span>
                  <span className="font-Roboto text-green-600">
                    -{discountAmount.toFixed(2)}$
                  </span>
                </div> 
              )}
              <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-semibold pb-3">
                <span className="font-Roboto">SubTotal</span>
                <span className="">
                  ${(subTotal - discountAmount).toFixed(2)}
                </span>
              </div>
              <hr className="my-4 text-slate-200" />
              <div className="mb-4">
                <h4 className="mb-[7px] font-medium text-[15px]">
                  Have a Coupon?
                </h4>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e: any) => setCouponCode(e.target.value)}
                    placeholder="Enter a Coupon Code"
                    className="w-full p-2  transition duration-300 border-2 border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500 focus:border-2"
                  />
                  <button
                    className="bg-blue-500 cursor-pointer text-white transition-all hover:bg-blue-600 rounded-r-md px-4 py-2 "
                    onClick={() => CouponCodeApply}
                  >
                    Apply
                  </button>
                  {/* {error && <p className="text-sm pt-2 text-red-500">{error}</p>} */}
                </div>
                <hr className="my-4 text-slate-200" />
                <h3 className="mb-[7px] font-medium font-Roboto text-[15px]">
                  Select shipping address
                </h3>
                <select
                  name=""
                  id=""
                  className=" w-full p-2 border-2 transition duration-300 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 "
                  value={selectedAddress}
                  onChange={(e: any) => setSelectedAddress(e.target.value)}
                >
                  <option value="123">Home - New York - USA</option>
                </select>
              </div>
              <hr className="my-4 text-slate-200" />
              <div className="mb-4">
                <h3 className="mb-[7px] font-medium font-Roboto text-[15px]">
                  Select Payment method
                </h3>
                <select
                  name=""
                  id=""
                  className=" w-full p-2 border-2 transition duration-300 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 "
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment method</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">Paypal</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>
              <hr className="my-4 text-slate-200" />
              <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-medium pb-3">
                <span className="font-Roboto">Total</span>
                <span>${(subTotal - discountAmount).toFixed(2)}</span>
              </div>
              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 cursor-pointer mt-2 py-2 bg-blue-600 text-white hover:bg-blue-400 transition rounded-lg"
              >
                {loading && <Loader2 className="animate-spin" />}
                {loading ? "" : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
