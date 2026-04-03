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

          <h2 className="text-md text-[#222222] font-medium text-center mb-6">
            Reset Password
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

export default ResetPasswordLinkPage;
