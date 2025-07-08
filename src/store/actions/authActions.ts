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
  companyConfigSuccess,
  companyConfigFailure,
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
      companyId,
      navigate,
    }: { email: string; password: string; companyId: string; navigate: any },
    { dispatch }
  ) => {
    try {
      dispatch(loginStart());
      const userData = await authAPI.login(email, password, companyId);
      let jobId = localStorage.getItem("jobId");
      const { user, access, refresh } = userData?.data;
      const encryptedUser = encrypt(JSON.stringify(user));
      dispatch(signupSuccess(userData.data));
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", encryptedUser);
      navigate(jobId && jobId !== "none" ? `/job-detail/${jobId}` : "/jobs");
      return userData;
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to login");
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    {
      name,
      email,
      password,
      companyId,
    }: { name: string; email: string; password: string; companyId: string },
    { dispatch }
  ) => {
    try {
      dispatch(signupStart());
      const userData = await authAPI.signup(name, email, password, companyId);
      // const { user, access, refresh } = userData?.data;
      // const encryptedUser = encrypt(JSON.stringify(user));
      dispatch(signupSuccess(userData.data?.message));
      toast.success(userData.data?.message);
      // localStorage.setItem("access", access);
      // localStorage.setItem("refresh", refresh);
      // localStorage.setItem("user", encryptedUser);
      return userData;
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to signup");
      dispatch(signupFailure(errorMessage));
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      previousPassword,
      newPassword,
    }: { previousPassword: string; newPassword: string },
    { dispatch }
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
  }
);

export const companyConfigFetch = createAsyncThunk(
  "auth/companyConfig",
  async (companyId: string, { dispatch }) => {
    try {
      let res = await authAPI.companyConfig(companyId);
      dispatch(companyConfigSuccess(res?.data));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      dispatch(companyConfigFailure(errorMessage));
      throw error;
    }
  }
);
