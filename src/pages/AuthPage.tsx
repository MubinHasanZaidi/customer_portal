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
    <div className={"grid grid-cols-1 md:grid-cols-2 min-h-screen"}>
      {/* Left side - Empty space */}
      <div className="bg-white flex items-center justify-center hidden md:block py-5">
        <div className="text-center space-y-2 lg:space-y-5">
          <img src={themeImages["logo"]} alt={""} className="h-12 mx-auto" />
          <h2 className="text-xl font-medium text-[#222222]">
            Customer Portal
          </h2>
          <img
            src={`${themeImages[customer?.color_name || "Default"]}`}
            alt={""}
            className="mx-0 md:mx-2 mb-0 md:mb-2 hidden md:block "
          />
          <p className="hidden md:block text-sm font-semibold text-[#222222]">
            Powered by Dynasoft Cloud
          </p>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div
        style={{
          background: customer?.secondary_color,
        }}
        className="w-full flex items-center justify-center"
      >
        <div className="min-w-96 mx-auto">
          <div className="text-center mb-8 md:hidden block">
            <img
              src={themeImages["logo"]}
              alt={""}
              className="h-12 mx-auto mb-4"
            />
            <h2 className="text-xl font-medium text-[#222222]">
              Customer Portal
            </h2>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-[#222222]">
              Login to your account
            </h2>
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
            </div>
            <p className="block text-center md:hidden text-sm font-semibold text-[#222222]">
              Powered by Dynasoft Cloud
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
