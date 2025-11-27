"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "apps/seller-ui/src/utils/axiosInstance";
import { ChevronRight, Plus, Trash2Icon, X } from "lucide-react";
// import { Cinzel_Decorative } from "next/font/google";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Input from "packages/components/input";
import { AxiosError } from "axios";
import DeleteDiscountCodeModel from "apps/seller-ui/src/shared/modules/Discount/DeleteDiscount";

const page = () => {
  const [showModel, setShowModel] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();
  console.log("selectedDiscount : ",selectedDiscount)
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });

  const { data: discountCodes, isLoading: discountCodeLoadig } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/v1/find-discount-codes"
      );
      return res.data || [];
    },
  });
  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(
        "/product/api/v1/create-discount-code",
        data
      );
      console.log("Res create discount code : ", res.data);
      //return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      reset();
      setShowModel(false);
    },
  });
  const DeleteDiscountCodeMutation = useMutation({
    mutationFn: async (discountId) => {
      const res = await axiosInstance.post(
        `/product/api/v1/delete-discount-code/${discountId}`
      );
      console.log("Res delete discount code : ", res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      setShowDeleteModel(false)
    },
  });
  const handleDeleteClick = (code: any) => {
    setSelectedDiscount(code);
    setShowDeleteModel(true);
  };
  console.log("discountCodes : ", discountCodes?.discountCodeExist);
  const onSubmit = (data: any) => {
    if (discountCodes?.discountCodeExist.length >= 8) {
      toast.error("You Can only create upto 8 discount code");
      return;
    }
    //create discount code mutation
    createDiscountCodeMutation.mutate(data);
  };
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
        {!discountCodeLoadig &&
          discountCodes?.discountCodeExist.length === 0 && (
            <p className="text-gray-400 text-center mt-2">
              No Discount codes Available!
            </p>
          )}
      </div>
      {/* Create discount model */}
      {/* sTART FROM SHOWMOADL 11:08:38 */}
      {showModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-45 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h3 className="text-xl text-white">Create Discount Code</h3>
              <button
                onClick={() => {
                  setShowModel(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <Input
                label="Title(Public Name)"
                {...register("public_name", {
                  required: "Title is required",
                })}
              />
              {errors.public_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.public_name.message}
                </p>
              )}
              <div className="mt-2">
                <label className="block font-semibold text-white mb-1">
                  Discount Type
                </label>
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none text-white p-2 border-gray-700 bg-transparent"
                    >
                      <option value="percentage" className="text-black">
                        Percentage (%)
                      </option>
                      <option value="flat" className="text-black">
                        Flat Amount($)
                      </option>
                    </select>
                  )}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Discount Value"
                  min={1}
                  type="number"
                  {...register("discountValue", {
                    required: "discount Value is required",
                  })}
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Discount Code"
                  type="text"
                  {...register("discountCode", {
                    required: "discount Code is required",
                  })}
                />
                {errors.discountCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountCode.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={createDiscountCodeMutation.isPending}
                className="my-2 bg-blue-600 w-full hover:bg-blue-700 text-white p-2 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                {createDiscountCodeMutation.isPending ? (
                  <p>Creating Code</p>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Create</span>
                  </>
                )}
              </button>
              {createDiscountCodeMutation.isError && (
                <p className="text-red-500 text-sm my-1">
                  {(
                    createDiscountCodeMutation.error as AxiosError<{
                      message: string;
                    }>
                  )?.response?.data?.message || "Something wen't wrong."}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
      {showDeleteModel && selectedDiscount && (
        <DeleteDiscountCodeModel
          discount={selectedDiscount}
          onClose={() => setShowDeleteModel(false)}
          onConfrim={()=>DeleteDiscountCodeMutation.mutate(selectedDiscount?.id)}
        />
      )}
    </div>
  );
};

export default page;
