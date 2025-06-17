import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
} from "../store/slices/authSlice";
import type { RootState } from "../store";
import loginIllustration from "../assets/login-illustration.png";
import logo from "../assets/logo.png";
import InputArea from "../components/Inputarea";

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
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = (data: LoginFormData) => {
    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      try {
        // Mock successful login
        const userData = {
          id: "1",
          name: "John Doe",
          email: data.email,
        };
        dispatch(loginSuccess(userData));
        // Store user data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/jobs");
      } catch (err) {
        dispatch(loginFailure("Invalid email or password"));
      }
    }, 1000);
  };

  const onSignupSubmit = (data: SignupFormData) => {
    dispatch(signupStart());

    // Simulate API call
    setTimeout(() => {
      try {
        // Mock successful signup
        const userData = {
          id: "1",
          name: data.name,
          email: data.email,
        };
        dispatch(signupSuccess(userData));
        // Store user data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/jobs");
      } catch (err) {
        dispatch(signupFailure("Failed to create account"));
      }
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginIllustration})` }}
    >
      <div className="flex mt-[10%] max-lg:mt-0 max-lg:min-h-screen">
        {/* Left side - Empty space */}
        <div className="hidden lg:block lg:w-3/5"></div>

        {/* Right side - Auth forms */}
        <div className="w-full lg:w-2/5 flex flex-col items-center lg:justify-center pt-[20%] lg:pt-0 p-6 max-lg:bg-white max-lg:bg-opacity-95">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img
                src={logo}
                alt="Dynasoft Cloud"
                className="h-16 mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/200x60?text=Dynasoft+Cloud";
                }}
              />
              <h2 className="text-xl font-medium text-gray-900">
                Welcome to Dynasoft Cloud
              </h2>
              <p className="text-sm text-gray-600">Careers Portal</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <button
                className={`py-4 px-10 text-md rounded-full font-medium ${
                  isLogin
                    ? "bg-[#0093DD] text-white"
                    : "bg-[#E6F8FF] text-[#0093DD]"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </button>
              <button
                className={`py-4 px-10 text-md rounded-full font-medium ${
                  !isLogin
                    ? "bg-[#0093DD] text-white"
                    : "bg-[#E6F8FF] text-[#0093DD]"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                className="space-y-6"
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
                  className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
                <div className="text-center">
                  <Link
                    to="/forget-password"
                    className="text-sm text-[#0093DD] hover:underline"
                  >
                    Forgot Password
                  </Link>
                </div>
              </form>
            ) : (
              // Signup Form
              <form
                onSubmit={handleSignupSubmit(onSignupSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4 mb-3">
                  <div>
                    <InputArea
                      id="name"
                      type="text"
                      placeholder="Name"
                      error={signupErrors.name?.message}
                      registration={signupRegister("name")}
                    />
                  </div>
                  <div>
                    <InputArea
                      id="email"
                      type="email"
                      placeholder="Email"
                      error={signupErrors.email?.message}
                      registration={signupRegister("email")}
                    />
                  </div>
                  <div>
                    <InputArea
                      id="password"
                      type="password"
                      placeholder="Password"
                      error={signupErrors.password?.message}
                      registration={signupRegister("password")}
                    />
                  </div>
                  <div>
                    <InputArea
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      error={signupErrors.confirmPassword?.message}
                      registration={signupRegister("confirmPassword")}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>
                <div className="text-center">
                  <Link
                    to="/forget-password"
                    className="text-sm text-[#0093DD] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
