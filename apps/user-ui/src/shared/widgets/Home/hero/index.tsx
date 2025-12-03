"use client";
import { MoveRight } from "lucide-react";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import React from "react";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="bg-[#115061] h-[85vh] flex flex-col justify-center w-full">
      <div className="md:w-[80%] w-[90%] m-auto md:flex h-full items-center">
        <div className="md:w-1/2">
          <p className="font-Roboto font-normal text-white pb-2 text-base">
            Starting from 40%
          </p>
          <h1 className="text-white text-6xl font-extrabold font-Roboto">
            The best watch <br /> Collection 2025
          </h1>
          <p className="font-Oregano text-3xl pt-4 text-white">
            Exclusive offer <span className="text-yellow-400">10%</span> This
            week
          </p>
          <br />
          <button
            onClick={() => router.push("/products")}
            className="w-[140px] gap-2 font-semibold h-[40px] flex items-center justify-center bg-yellow-600 text-white rounded-md hover:bg-yellow-500 transition"
          >
            <span className="font-bold text-white">Shop Now</span>
            <MoveRight />
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="https://img.freepik.com/free-photo/stylish-golden-watch-white-surface_181624-27078.jpg?t=st=1764784432~exp=1764788032~hmac=79759ae864dc9f3c3d11ebcc3d65d8c0037edb15d07370dfe857d68a8dc524ac&w=1060"
            alt="Main-Image"
            width={250}
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
