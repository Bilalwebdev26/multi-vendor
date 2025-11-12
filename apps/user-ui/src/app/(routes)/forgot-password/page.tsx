"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
type FormData = {
  email: string;
  password: string;
};
const page = () => {
  const [serverError, setServerError] = useState<string | null>(null); //SubmitHandler rhf
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
   const [passwordVisible, setPasswordVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState<number>(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  //const [password, setPassword] = useState<string | null>(null);
  const router = useRouter();
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
  const requestOTPMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/forgot-user-password`,
        {email}
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP.Try again!";
      setServerError(errorMessage);
    },
  });
  const verifyOTPMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) {
        return;
      }
      console.log("URI : ", process.env.NEXT_PUBLIC_SERVER_URL);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/verify-forgot-password`,
        { email: userEmail, otp: otp.join("") },
        { withCredentials: true }
      );
      console.log("Res : ", response);
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      setStep("reset");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP";
      setServerError(errorMessage);
    },
  });
  //reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!userEmail) {
        return;
      }
      console.log("URI : ", process.env.NEXT_PUBLIC_SERVER_URL);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/api/v1/reset-user-password`,
        { email: userEmail, newPassword: password },
        { withCredentials: true }
      );
      console.log("Res : ", response);
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      toast.success("Password reset successfully,Please login");
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid Password";
      setServerError(errorMessage);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onsubmitEmail = ({ email }: { email: string }) => {
    console.log(email);
    requestOTPMutation.mutate({ email });
  };
  //   const onsubmitOTP = () => {
  //     verifyOTPMutation.mutate();
  //   };
  const onsubmitPassword = ({ password }: { password: string }) => {
    console.log(password);
    resetPasswordMutation.mutate({ password });
  };
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
  const resendOTP = () => {
    // if(userData){
    //   signUpMutation.mutate(userData)
    // }
  };
  //setServerError(null)
  return (
    <div className="w-full py-10 min-h-[85vh]  bg-[#f1f1f1]">
      <div className="">
        <h1 className="text-center font-bold font-Roboto text-3xl">
          Forgot Password
        </h1>
        <p className="text-center font-semibold font-Poppins mb-2">
          Enter email and get OTP
        </p>
      </div>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] bg-white `shadow rounded-lg p-2">
          {step === "email" && (
            <>
              <h3 className="text-3xl font-semibold text-center mb-2">
                <span className="text-gray-900 font-Poppins font-extrabold tracking-tight">
                  Multi
                </span>
                <span className="text-red-600 font-Poppins font-extrabold tracking-tight">
                  Mart
                </span>
              </h3>
              <p className="text-center text-gray-500 mb-4">
                Go Back to?
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
              {/* form  */}
              <form onSubmit={handleSubmit(onsubmitEmail)}>
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

                <button
                  type="submit"
                  disabled={requestOTPMutation.isPending}
                  className="w-full bg-black text-center mb-2 mt-3 transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
                >
                  {requestOTPMutation.isPending ? "Verifing..." : "Submit"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
          {step === "otp" && (
            <>
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
                    verifyOTPMutation.isPending
                      ? "cursor-not-allowed bg-gray-800"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => verifyOTPMutation.mutate()}
                    className="w-[80%] mt-4  text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:scale-95 transition-all duration-200"
                  >
                    {verifyOTPMutation.isPending ? "Verifing..." : "Verify OTP"}
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
                {verifyOTPMutation?.isError &&
                  verifyOTPMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {(
                        verifyOTPMutation.error.response?.data as {
                          message?: string;
                        }
                      )?.message ||
                        verifyOTPMutation.error.message ||
                        "Something went wrong"}
                    </p>
                  )}
              </div>
            </>
          )}
          {step === "reset" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                Reset Password
              </h3>
              <form action="" onSubmit={handleSubmit(onsubmitPassword)}>
                {/* <label htmlFor="" className="block text-gray-700 mb-1">
                  Add New Password
                </label>
                <input
                  type="password"
                  placeholder="**********"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?!.*\.\.)(?!\.)[A-Za-z0-9._%+-]+@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/,
                      message: "Invalid Email Address",
                    },
                  })}
                /> */}
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
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-black text-center mb-2 mt-3 transition-all duration-200 hover:scale-95 cursor-pointer text-lg text-white py-2 rounded-lg"
                >
                  {resetPasswordMutation.isPending ? "Verifing..." : "Submit"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
