"use client";
import { useMutation } from "@tanstack/react-query";
import GoogleButton from "apps/user-ui/src/shared/widgets/Icon/GoogleButton";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
type FormData = {
  name: string;
  email: string;
  password: string;
};

const page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, _] = useState<string | null>(null); //SubmitHandler rhf
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);
  //const timer = 60
  //const canResend = false
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  //const showOtp = false;
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // const router = useRouter();
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
  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/register-user`,
        { data }
      );
      return response.data;
    },
    onSuccess: (_, FormData) => {
      setUserData(FormData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });
  const resendOTP = () => {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onsubmit = (data: FormData) => {
    console.log(data);
    signUpMutation.mutate(data);
  };
  //setServerError(null)
  //setShowOtp(true)
  return (
    <div className="w-full py-10 min-h-[85vh]  bg-[#f1f1f1]">
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
          <div className="flex items-center justify-center">
            <GoogleButton />
          </div>
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
                className="my-3 w-full bg-black text-center transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
              >
                Signup
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
              <div className="flex items-center justify-center w-full">
                <button className="w-[80%] mt-4  text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:scale-95 transition-all duration-200">
                  Verify OTP
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
            </div>
          )}
          {/* form  */}
        </div>
      </div>
    </div>
  );
};

export default page;
