"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
type FormData = {
  email: string;
  password: string;
};

const page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); //SubmitHandler rhf
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const loginInMutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log("URI : ", process.env.NEXT_PUBLIC_SERVER_URL);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/login-user`,
         data,{ withCredentials: true }
      );
      console.log("Res : ", response);
      return response.data;
    },
    onSuccess: () => {
      setServerError(null)
      router.push("/");
    },
    onError:(error:AxiosError)=>{
     const errorMessage = (error.response?.data as {message?:string})?.message || "Invalid Credentials"
     setServerError(errorMessage)
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onsubmit = (data: FormData) => {
    console.log(data);
    loginInMutation.mutate(data);
  };
  //setServerError(null)
  return (
    <div className="w-full py-10 min-h-screen bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] bg-white `shadow rounded-lg p-2">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to{" "}
            <span className="text-gray-900 font-Poppins font-extrabold tracking-tight">
              Multi
            </span>
            <span className="text-red-600 font-Poppins font-extrabold tracking-tight">
              Mart
            </span>
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Don't have an account?
            <Link href={"/signup"} className="text-blue-600 font-semibold">
              {" "}
              Sign Up
            </Link>
          </p>
          
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3 ">Or sign in with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>
          {/* form  */}
          <form onSubmit={handleSubmit(onsubmit)}>
            <label htmlFor="" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="support@multimart.com"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(?!.*\.\.)(?!\.)[A-Za-z0-9._%+-]+@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/,
                  message: "Invalid Email Address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}
            {/* Password */}
            <label htmlFor="" className="block text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="**************"
                className="w-full py-2 pl-2 pr-10 border border-gray-300 outline-0 !rounded mb-1 relative"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^[A-Za-z0-9@._\-!#$%^&*]+$/,
                    message: "Creadentials wrong",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be atleast 6 character long",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => {
                  setPasswordVisible(!passwordVisible);
                }}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {String(errors.password.message)}
              </p>
            )}
            <div className="flex justify-between items-center my-4">
              <label htmlFor="" className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link
                href={"/forgot-password"}
                className="text-blue-500 font-semibold text-md"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loginInMutation.isPending}
              className="w-full bg-black text-center transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
            >
              {loginInMutation.isPending ? "Log u In ..." : "Login"}
            </button>
            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
