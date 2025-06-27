import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login, signup } from "../store/actions/authActions";
import type { RootState, AppDispatch } from "../store";
import loginIllustration from "../assets/login-illustration.png";
import dy_logo from "../assets/dy_logo.png";
import InputArea from "../components/Inputarea";
import useCompanyConfig from "../hooks/useCompanyConfig";

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
  const { companyConfig } = useCompanyConfig();
  const { company, themeConfig } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;
  const [isLogin, setIsLogin] = useState(true);
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
        login(
          {
            email: data.email,
            password: data.password,
            companyId: company?.Id,
            navigate
          },
        )
      ).unwrap();

    } catch (err) {
      // Error is already handled in the action creator
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      await dispatch(
        signup({
          name: data.name,
          email: data.email,
          password: data.password,
          companyId: company?.Id,
        })
      ).unwrap();
      navigate("/jobs");
    } catch (err) {
      // Error is already handled in the action creator
    }
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
                src={company?.Logo}
                alt={company?.name}
                className="h-16 mx-auto mb-4"
              />
              <h2 className="text-xl font-medium text-gray-900">
                Welcome to {company?.name}
              </h2>
              <p className="text-sm text-gray-600">Careers Portal</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <button
                style={{
                  background: isLogin ? primary_color : secondary_color,
                  color: isLogin ? "#ffffff" : primary_color,
                }}
                className={`py-4 px-10 text-md rounded-full font-medium`}
                onClick={() => {
                  resetLogin(), setIsLogin(true);
                }}
              >
                Sign in
              </button>
              <button
                className={`py-4 px-10 text-md rounded-full font-medium`}
                style={{
                  background: isLogin ? secondary_color : primary_color,
                  color: isLogin ? primary_color : "#ffffff",
                }}
                onClick={() => {
                  resetSignup(), setIsLogin(false);
                }}
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
                    style={{ color: primary_color }}
                    to="/forget-password"
                    className={`text-sm hover:underline`}
                  >
                    Forgot Password
                  </Link>
                </div>
                <div>
                  <img className="mx-auto mt-10" src={dy_logo} />
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
                    style={{ color: primary_color }}
                    to="/forget-password"
                    className={`text-sm hover:underline`}
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
