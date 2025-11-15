"use client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { categories } from "apps/seller-ui/src/utils/categories";
const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const createShopMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/create-seller-shop`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });
  const onsubmit = (data: any) => {
    console.log("Data : ", data);
    const shopData = { ...data, sellerId };
    console.log("Shop Data",shopData)
    createShopMutation.mutate(shopData);
  };
  const countWords = (text: string) => text.trim().split(/\s+/).length;
  return (
    <div>
      <form action="" onSubmit={handleSubmit(onsubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-3">
          Setup New Shop
        </h3>
        <label htmlFor="" className="block text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          placeholder="username"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: /^[A-Za-z][A-Za-z0-9. ]*[A-Za-z0-9]$/,
              message: "Invalid Username",
            },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
        <label htmlFor="" className="block text-gray-700 mb-1">
          Shop Bio
        </label>
        <input
          placeholder="Enter your Shop Bio"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("bio", {
            required: "Bio is required",
            validate: (value: any) => {
              return countWords(value) <= 100 || "Bio can't exceed 100 words";
            },
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}
        {/* address */}
        <label htmlFor="" className="block text-gray-700 mb-1">
          Shop Address
        </label>
        <input
          type="text"
          placeholder="New York USA"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("address", {
            required: "Address is required",
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}
        {/* Opening hours */}
        <label htmlFor="" className="block text-gray-700 mb-1">
          Opening hours
        </label>
        <input
          type="text"
          placeholder="eg Mon-Fri 9AM-6PM"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("opening_hours", {
            required: "Opening hours is required",
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}
        {/* website */}
        <label htmlFor="" className="block text-gray-700 mb-1">
          Website Link
        </label>
        <input
          type="text"
          placeholder="https://google.com"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("website", {
            required: "website is required",
            //valid url ->TODO
          })}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}
        {/* categories */}
        <label htmlFor="" className="block text-gray-700 mb-1">
          Country
        </label>
        <select
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
          {...register("category", { required: "category is required." })}
        >
          <option value="">Select your counrty</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}
        {/* Button */}
        <button
          type="submit"
          disabled={createShopMutation.isPending}
          className="my-3 w-full bg-black text-center transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
        >
          {createShopMutation.isPending ? "Registering shop..." : "Create Shop"}
        </button>
        {/* {serverError && (
          <p className="text-red-500 text-sm mt-2">{serverError}</p>
        )} */}
      </form>
    </div>
  );
};
export default CreateShop;
