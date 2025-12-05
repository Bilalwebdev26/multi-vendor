"use client"
import React from "react";
import Hero from "../shared/widgets/Home/hero";
import SectionTitle from "../shared/widgets/Home/hero/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import ProductCard from "../shared/widgets/Products/ProductCard";

const page = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/product/api/v1/get-all-products?page=1&limit=10`
      );
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2, //cahe for 2 sec
  });
  //latest products
  const {
    data: latestProducts,
    isLoading: latestLoading,
    isError: errorLoading,
  } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/product/api/v1/get-all-products?page=1&limit=10&type=latest`
      );
      return res.data.top10Products;
    },
    staleTime: 1000 * 60 * 2, //cahe for 2 sec
  });
  console.log(latestProducts)
  console.log("Products : ",products)
  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <div className="md:w-[80%] w-[90%] my-10 m-auto">
        <div className="mb-8">
          <SectionTitle title="Suggested Products" />
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] bg-gray-300 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
            {products?.map((product:any)=>(
              <ProductCard product={product} key={product.id}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
