import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success?: string | null;
  customerConfig: any;
  error_customer: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,
  customerConfig: null,
  error_customer: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    signupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.success = action.payload;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetPasswordStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    rehydrate: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
    customerConfigSuccess: (state, action: PayloadAction<any>) => {
      state.customerConfig = action.payload;
      state.error_customer = null;
    },
    customerConfigFailure: (state, action: PayloadAction<any>) => {
      state.customerConfig = null;
      state.error_customer = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  signupStart,
  signupSuccess,
  signupFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  customerConfigFailure,
  customerConfigSuccess,
  rehydrate,
  resetError,
} = authSlice.actions;

export default authSlice.reducer;
