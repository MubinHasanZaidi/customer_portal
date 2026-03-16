import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordFailure } from "../store/slices/authSlice";
import type { RootState } from "../store";
import InputArea from "../components/Inputarea";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCustomerConfig from "../hooks/useCustomerConfig";
import { resetPassword } from "../store/actions/authActions";
import type { AppDispatch } from "../store";

const resetPasswordSchema = z
  .object({
    previousPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.previousPassword !== data.newPassword, {
    message: "New password must different from current",
    path: ["newPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    // Simulate API call
    try {
      // Mock successful password reset
      dispatch(
        resetPassword({
          previousPassword: data.previousPassword,
          newPassword: data.newPassword,
        }),
      );
      setResetSuccess(true);
      reset();
    } catch (err) {
      dispatch(resetPasswordFailure("Failed to reset password"));
    }
  };

  return (
    <div
      style={{ background: customer.secondary_color }}
      className={`flex flex-col`}
    >
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <div className="w-full flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
              <h3 className="text-lg text-[#222222] font-medium text-center mb-6">
                Reset Password
              </h3>
              <p className="text-sm text-[#222222] font-medium text-center mb-6">
                Update your password below.
              </p>
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}

              {/* Success message */}
              {resetSuccess && !error ? (
                <div className="text-center">
                  <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                    Password has been reset successfully.
                  </div>
                  <Link
                    to="/tickets"
                    className="w-full bg-[#222222] text-white py-2 px-6 text-sm mt-4 rounded-full font-medium hover:bg-black transition-colors"
                  >
                    Go to Jobs
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <InputArea
                      id="previousPassword"
                      type="password"
                      placeholder="Current Password"
                      error={errors.previousPassword?.message}
                      registration={register("previousPassword")}
                    />
                  </div>
                  <div>
                    <InputArea
                      id="newPassword"
                      type="password"
                      placeholder="New Password"
                      error={errors.newPassword?.message}
                      registration={register("newPassword")}
                    />
                  </div>
                  <div>
                    <InputArea
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm New Password"
                      error={errors.confirmPassword?.message}
                      registration={register("confirmPassword")}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
