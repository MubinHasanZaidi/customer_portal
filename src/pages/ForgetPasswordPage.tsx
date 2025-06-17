import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "../store/slices/authSlice";
import type { RootState } from "../store";
import loginIllustration from "../assets/login-illustration.png";
import logo from "../assets/logo.png";
import InputArea from "../components/Inputarea";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgetPasswordPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    dispatch(resetPasswordStart());

    // Simulate API call
    setTimeout(() => {
      try {
        // Mock successful password reset
        dispatch(resetPasswordSuccess());
        setResetSuccess(true);
      } catch (err) {
        dispatch(resetPasswordFailure("Failed to reset password"));
      }
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginIllustration})` }}
    >
      <div className="flex flex-1">
        {/* Left side - Empty space */}
        <div className="hidden lg:block lg:w-3/5"></div>

        {/* Right side - Reset password form */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 max-lg:bg-white max-lg:bg-opacity-95">
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

            <h3 className="text-lg text-[#222222] font-medium text-center mb-6">
              Forgot Password
            </h3>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Success message */}
            {resetSuccess ? (
              <div className="text-center">
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                  Password reset instructions have been sent to your email.
                  Please check your inbox.
                </div>
                <Link
                  to="/auth"
                  className="w-full bg-[#222222] text-white py-2 px-6 text-sm mt-4 rounded-full font-medium hover:bg-black transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <InputArea
                    id="email"
                    type="email"
                    placeholder="Email"
                    error={errors.email?.message}
                    registration={register("email")}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </button>

                <div className="text-center">
                  <Link
                    to="/auth"
                    className="text-sm text-[#0093DD] hover:underline"
                  >
                    Back to Login
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

export default ForgetPasswordPage;
