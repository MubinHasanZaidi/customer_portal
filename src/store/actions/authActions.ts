import { createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  resetPasswordStart,
  customerConfigFailure,
  customerConfigSuccess,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "../slices/authSlice";
import { encrypt } from "../../utils/crypto";
import { toast } from "react-toastify";

export const login = createAsyncThunk(
  "auth/login",
  async (
    {
      email,
      password,
      customerId,
      navigate,
    }: { email: string; password: string; navigate: any; customerId: string },
    { dispatch },
  ) => {
    try {
      dispatch(loginStart());
      const userData = await authAPI.login(email, password, customerId);
      let jobId = localStorage.getItem("jobId");
      const { user, access, refresh } = userData?.data;
      const encryptedUser = encrypt(JSON.stringify(user));
      dispatch(signupSuccess(userData.data));
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", encryptedUser);
      navigate(jobId && jobId !== "none" ? `/job-detail/${jobId}` : "/tickets");
      return userData;
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to login");
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  },
);

export const forgotPasswordWithEmail = createAsyncThunk(
  "auth/forgotPassword",
  async (
    { email, customerId }: { email: string; customerId: string },
    { dispatch },
  ) => {
    try {
      dispatch(resetPasswordStart());
      const userData = await authAPI.forgotPassword(email , customerId);
      dispatch(resetPasswordSuccess());
      toast.success(userData.data?.message);
      return userData;
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to forgot password");
      dispatch(signupFailure(errorMessage));
      throw error;
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      previousPassword,
      newPassword,
    }: { previousPassword: string; newPassword: string },
    { dispatch },
  ) => {
    try {
      dispatch(resetPasswordStart());
      await authAPI.resetPassword({ previousPassword, newPassword });
      dispatch(resetPasswordSuccess());
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to reset password");
      dispatch(resetPasswordFailure(errorMessage));
      throw error;
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    { forgetLink, password }: { forgetLink: string; password?: string },
    { dispatch },
  ) => {
    try {
      dispatch(resetPasswordStart());
      await authAPI.updatePassowrd({ forgetLink, password });
      dispatch(resetPasswordSuccess());
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to reset password");
      dispatch(resetPasswordFailure(errorMessage));
      throw error;
    }
  },
);

export const customerConfigFetch = createAsyncThunk(
  "auth/customerConfig",
  async (customerId: string, { dispatch }) => {
    try {
      let res = await authAPI.customerConfig(customerId);
      dispatch(customerConfigSuccess(res?.data));
      return res?.data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch";
      dispatch(customerConfigFailure(errorMessage));
      throw error;
    }
  },
);
