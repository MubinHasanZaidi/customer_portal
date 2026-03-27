import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppDispatch, RootState } from "../store";
import InputArea from "../components/Inputarea";
import useCustomerConfig from "../hooks/useCustomerConfig";
import { themeImages } from "../data/mockData";
import { updatePassword } from "../store/actions/authActions";
import { generateImageUrl } from "../utils/common";

//  Schema for password + confirmPassword
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordLinkPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;

  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { Id } = useParams<{ Id?: string }>();
  const forgetLink = Id ?? "";

  //  Redirect if no forgetLink in URL
  useEffect(() => {
    if (!forgetLink) {
      navigate("/auth");
    } else {
      // Validate link on mount (without password)
      dispatch(updatePassword({ forgetLink }))
        .unwrap()
        .catch(() => {
          navigate("/auth");
        });
    }
  }, [forgetLink, dispatch, history]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await dispatch(
        updatePassword({
          forgetLink,
          password: data.password,
        }),
      ).unwrap();
      setResetSuccess(true);
    } catch (err) {
      console.error("Reset password failed", err);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${themeImages[customer.color_name || "Default"]})`,
      }}
    >
      <div className="flex flex-1">
        {/* Left side - Empty space */}
        <div className="hidden lg:block lg:w-3/5"></div>

        {/* Right side - Reset password form */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 max-lg:bg-white max-lg:bg-opacity-95">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img
                src={themeImages["logo"]}
                alt={""}
                className="h-12 mx-auto mb-4"
              />
              <h2 className="text-xl font-medium text-[#222222]">
                Welcome to Dynasoft Cloud
              </h2>
              <p className="text-sm text-[#222222]">Customer Portal</p>
            </div>

            <h3 className="text-md text-[#222222] font-medium text-center mb-6">
              Reset Password
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
                  Your password has been reset successfully.
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
                    id="password"
                    type="password"
                    placeholder="New Password"
                    error={errors.password?.message}
                    registration={register("password")}
                  />
                </div>
                <div>
                  <InputArea
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    error={errors.confirmPassword?.message}
                    registration={register("confirmPassword")}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#222222] hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] text-white py-2 rounded-full font-medium transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>

                <div className="text-center">
                  <Link
                    to="/auth"
                    style={{ color: customer?.primary_color }}
                    className={`text-xs hover:underline`}
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

export default ResetPasswordLinkPage;
