import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../store/actions/authActions";
import type { RootState, AppDispatch } from "../store";
import dy_logo_white from "../assets/dy_logo_white.svg";
import InputArea from "../components/Inputarea";
import useCustomerConfig from "../hooks/useCustomerConfig";
import { themeImages } from "../data/mockData";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Signup schema
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    reset: resetSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(
        login({
          email: data.email,
          password: data.password,
          customerId: customer?.customerId,
          navigate,
        }),
      ).unwrap();
    } catch (err) {
      // Error is already handled in the action creator
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white bg-cover bg-center bg-no-repeat lg:bg-none"
      style={{
        backgroundImage: `url(${themeImages[customer?.color_name || "Default"]})`,
      }}
    >
      <div className={"flex mt-4 md:mt-[8%] max-lg:mt-0 max-lg:min-h-screen"}>
        {/* Left side - Empty space */}
        <div className="hidden lg:block lg:w-3/5"></div>

        {/* Right side - Auth forms */}
        <div className="w-full lg:w-2/5 flex flex-col items-center lg:justify-center pt-10 md:pt-[20%] lg:pt-0 p-6 max-lg:bg-white max-lg:bg-opacity-95">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <img
                src={themeImages["logo"]}
                alt={""}
                className="h-12 mx-auto mb-4"
              />
              <h2 className="text-xl font-medium text-[#222222]">
                Welcome to Dynasoft Cloud
              </h2>
              <p className="text-sm font-semibold text-[#222222]">
                Customer Portal
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLoginSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <div className="space-y-4 mb-3">
                <div>
                  <InputArea
                    id="email"
                    type="email"
                    placeholder="Email"
                    error={loginErrors.email?.message}
                    registration={loginRegister("email")}
                  />
                </div>
                <div>
                  <InputArea
                    id="password"
                    type="password"
                    placeholder="Password"
                    error={loginErrors.password?.message}
                    registration={loginRegister("password")}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              <div className="text-center">
                <Link
                  style={{ color: customer?.primary_color }}
                  to="/forget-password"
                  className={`text-xs hover:underline`}
                >
                  Forgot Password
                </Link>
                {/* <div className="text-center">
                  <Link
                    style={{ color: customer?.primary_color }}
                    to="/tickets"
                    className={`text-xs hover:underline`}
                  >
                    View All Jobs
                  </Link>
                </div> */}
              </div>
            </form>
          </div>
          <div>
            <img
              className={"mx-auto h-12 mt-2 md:mt-24 opacity-70"}
              src={dy_logo_white}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
