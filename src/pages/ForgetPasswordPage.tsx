import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppDispatch, RootState } from "../store";
import InputArea from "../components/Inputarea";
import useCustomerConfig from "../hooks/useCustomerConfig";
import { themeImages } from "../data/mockData";
import { forgotPasswordWithEmail } from "../store/actions/authActions";
import { generateImageUrl } from "../utils/common";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgetPasswordPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [resetSuccess, setResetSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    console.log("dataaa", data);
    await dispatch(
      forgotPasswordWithEmail({
        email: data.email,
        customerId: customer?.customerId,
      }),
    ).unwrap();
    // Mock successful password reset
    setResetSuccess(true);
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
          <h2 className="text-xl text-center mb-6 font-medium text-[#222222]">
            Forgot Password
          </h2>

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
                Password reset instructions have been sent to your email. Please
                check your inbox.
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
                className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset instructions"}
              </button>

              <div className="text-center">
                <Link
                  to="/auth"
                  style={{ color: customer.primary_color }}
                  className={`text-xs hover:underline`}
                >
                  Back to Login
                </Link>
              </div>
              <p className="block text-center md:hidden text-sm font-semibold text-[#222222]">
                Powered by Dynasoft Cloud
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
