"use client";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "apps/seller-ui/src/utils/axiosInstance";
import { ChevronRight, Plus, Trash2Icon } from "lucide-react";
import { Cinzel_Decorative } from "next/font/google";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const [showModel, setShowModel] = useState(false);
  const { data: discountCodes, isLoading: discountCodeLoadig } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/v1/find-discount-codes"
      );
      return res.data || [];
    },
  });
  const handleDeleteClick = async (code: any) => {
    try {
    } catch (error) {}
  };
  console.log("discountCodes : ", discountCodes?.discountCodeExist);
  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Discount Codes</h2>
        <button
          onClick={() => setShowModel(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} /> Create Discound
        </button>
      </div>
      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={15} className="opacity-[.8] text-white" />
        <span className="text-white font-semibold text-sm">Discount Codes</span>
      </div>
      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          Your Discount Code
        </h3>
        {discountCodeLoadig ? (
          <p className="text-gray-400 text-center">
            Loading Discount codes....
          </p>
        ) : (
          <table className="text-white w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes?.discountCodeExist?.map(
                (code: any, index: number) => (
                  <tr
                    key={code?.id}
                    className="border-b border-gray-800 hover:bg-gray-800 transition"
                  >
                    <td className="p-3">{code?.public_name}</td>
                    <td className="p-3 capitalize">
                      {code?.discountType === "percentage"
                        ? "Percent (%)"
                        : "Flat ($)"}
                    </td>
                    <td className="p-3">
                      {code?.discountType === "percentage"
                        ? `${code.discountValue}%`
                        : `$${code.discountValue}`}
                    </td>
                    <td className="p-3">{code?.discountCode}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteClick(code)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2Icon size={18} />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {!discountCodeLoadig && discountCodes?.discountCodeExist.length === 0 && (
          <p className="text-gray-400 text-center mt-2">
            No Discount codes Available!
          </p>
        )}
      </div>
    {/* Create discount model */}
    {/* sTART FROM SHOWMOADL 11:08:38 */}
    </div>
  );
};

export default page;
