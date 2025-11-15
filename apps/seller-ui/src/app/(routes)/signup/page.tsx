"use client";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
//import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { countries } from "apps/seller-ui/src/utils/countries";
import CreateShop from "apps/seller-ui/src/shared/modules/auth/createShop";
import Image from "next/image";
import toast from 'react-hot-toast';


const page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [serverError, _] = useState<string | null>(null); //SubmitHandler rhf
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);
  //const timer = 60
  //const canResend = false
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  //const showOtp = false;
  const [sellerData, setSellerData] = useState<any | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [sellerId, setSellerId] = useState("");
  const router = useRouter();
  const handleOTPChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  //tanstack setup
  //signup mutation
  const signUpMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("URI : ", process.env.NEXT_PUBLIC_SERVER_URL);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/seller-registration`,
        data
      );
      console.log("Res : ", response);
      return response.data;
    },
    onSuccess: (_, data) => {
      setSellerData(data);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });
  //verify otp mutation
  const verifyOTPmutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/verify-seller-registration`,
        {
          ...sellerData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Data in onsucess : ", data);
      setSellerId(data?.seller?.id);
      setActiveStep(2);
    },
  });
  const resendOTP = () => {
    if (sellerData) {
      signUpMutation.mutate(sellerData);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const onsubmit = (data: any) => {
    console.log("Data : ", data);
    setSellerData(data);
    signUpMutation.mutate(data);
  };
  //setServerError(null)
  //setShowOtp(true)
  console.log("sellerData : ", sellerData);
  console.log("sellerData Id : ", sellerId);
  //Payment fn
  const connectStripe = async() => {
    try {
       const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/create-stripe-link`,
        {sellerId}
       )
       if(response.data.url){
        window.location.href=response.data.url
       }
    } catch (error) {
      toast.error("Stripe connection error")
      console.log("Stripe connection error : ",error)
    }
  };
  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute left-0 top-[25%] w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />
        {[1, 2, 3].map((step) => (
          <div className="" key={step}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step <= activeStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {step}
            </div>
            <span className="ml-[-15px]">
              {step === 1
                ? "Create account"
                : step === 2
                ? "Setup Shop"
                : step === 3
                ? "Connect Bank"
                : ""}
            </span>
          </div>
        ))}
      </div>
      {/* Step content */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onsubmit)}>
                <h3 className="text-2xl font-semibold text-center mb-3">
                  Create Seller Account
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
                  <p className="text-red-500 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}

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
                {/* Phone no */}
                <label htmlFor="" className="block text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+102333332113"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("phone_number", {
                    required: "phone Number is required",
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: "Invalid phone Number",
                    },
                    minLength: {
                      value: 8,
                      message: "Phone number must be atleast 8 digits.",
                    },
                    maxLength: {
                      value: 13,
                      message: "Phone number max 13 digits.",
                    },
                  })}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">
                    {String(errors.phone_number.message)}
                  </p>
                )}

                {/* country */}
                <label htmlFor="" className="block text-gray-700 mb-1">
                  Country
                </label>
                <select
                  className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
                  {...register("country", { required: "Country is required." })}
                >
                  <option value="">Select your counrty</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {/* <select
                  className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
                  {...register("country", { required: "Country is required." })}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select> */}

                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {String(errors.country.message)}
                  </p>
                )}

                {/* {errors.counrty && (
                  <p className="text-red-500 text-sm">
                    {String(errors.counrty.message)}
                  </p>
                )} */}

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
                <button
                  type="submit"
                  disabled={signUpMutation.isPending}
                  className="my-3 w-full bg-black text-center transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
                >
                  {signUpMutation.isPending
                    ? "Registering..."
                    : "Create Account"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
                <div className="flex items-center justify-between">
                  <p>Already have a account?</p>
                  <Link href={"/login"} className="text-blue-600 font-semibold">
                    Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Enter Otp
                </h3>
                <div className="flex justify-center gap-6">
                  {otp?.map((digit, index) => (
                    <input
                      type="text"
                      key={index}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      maxLength={1}
                      className="w-12 h-12 text-center !rounded outline-none border bg-gray-200 border-gray-300 "
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <div
                  className={`flex items-center justify-center w-full ${
                    verifyOTPmutation.isPending
                      ? "cursor-not-allowed bg-gray-800"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => verifyOTPmutation.mutate()}
                    className="w-[80%] mt-4  text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:scale-95 transition-all duration-200"
                  >
                    {verifyOTPmutation.isPending ? "Verifing..." : "Verify OTP"}
                  </button>
                </div>
                <p className="text-center text-sm mt-4">
                  {canResend ? (
                    <button
                      onClick={resendOTP}
                      className="text-blue-500 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    `Resend OTP in ${timer}sec`
                  )}
                </p>
                {verifyOTPmutation?.isError &&
                  verifyOTPmutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {verifyOTPmutation.error.response?.data?.message ||
                        verifyOTPmutation.error.message}
                    </p>
                  )}
              </div>
            )}
          </>
        )}
        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}
        {activeStep === 3 && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold">Connect your Bank's Here</h3>
            <br />
            <div className="flex items-center flex-col gap-4">
              <button
                onClick={connectStripe}
                className="w-full m-auto flex items-center justify-center px-3 gap-3 text-lg bg-purple-200 py-3 text-white rounded-lg"
              >
                <Image  src="/logo/stripee.png" alt="Logo" width={100} height={100} color="purple"/>
                 {/* <span>Connect Stripe</span> */}
              </button>
              <button className="w-full m-auto flex items-center justify-center gap-3 text-lg bg-yellow-300  text-white rounded-lg">
                 <Image  src="/logo/paypal.png" alt="Logo" width={100} height={100} color=""/>
                {/* Connect PayPal */}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <div className="w-full py-10 min-h-screen  bg-[#f1f1f1]">
        <div className="w-full flex justify-center">
          <div className="md:w-[480px] bg-white `shadow rounded-lg p-4">
            <h3 className="text-3xl font-semibold text-center mb-2">
              Signup to{" "}
              <span className="text-gray-900 font-Poppins font-extrabold tracking-tight">
                Multi
              </span>
              <span className="text-red-600 font-Poppins font-extrabold tracking-tight">
                Mart
              </span>
            </h3>
            <p className="text-center text-gray-500 mb-4">
              Already hava an account?
              <Link href={"/login"} className="text-blue-600 font-semibold">
                {" "}
                Login
              </Link>
            </p>

            <div className="flex items-center my-5 text-gray-400 text-sm">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3 ">Or sign in with Email</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onsubmit)}>
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
                  <p className="text-red-500 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}

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
                <button
                  type="submit"
                  disabled={signUpMutation.isPending}
                  className="my-3 w-full bg-black text-center transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
                >
                  {signUpMutation.isPending
                    ? "Registering..."
                    : "Create Account"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            ) : (
              <div className="">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Enter Otp
                </h3>
                <div className="flex justify-center gap-6">
                  {otp?.map((digit, index) => (
                    <input
                      type="text"
                      key={index}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      maxLength={1}
                      className="w-12 h-12 text-center !rounded outline-none border bg-gray-200 border-gray-300 "
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <div
                  className={`flex items-center justify-center w-full ${
                    verifyOTPmutation.isPending
                      ? "cursor-not-allowed bg-gray-800"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => verifyOTPmutation.mutate()}
                    className="w-[80%] mt-4  text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:scale-95 transition-all duration-200"
                  >
                    {verifyOTPmutation.isPending ? "Verifing..." : "Verify OTP"}
                  </button>
                </div>
                <p className="text-center text-sm mt-4">
                  {canResend ? (
                    <button
                      onClick={resendOTP}
                      className="text-blue-500 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    `Resend OTP in ${timer}sec`
                  )}
                </p>
                {verifyOTPmutation?.isError &&
                  verifyOTPmutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {verifyOTPmutation.error.response?.data?.message ||
                        verifyOTPmutation.error.message}
                    </p>
                  )}
              </div>
            )}
           
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default page;
