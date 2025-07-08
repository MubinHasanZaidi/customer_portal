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
  companyConfig: any;
  error_company: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,
  companyConfig: null,
  error_company: null,
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
    companyConfigSuccess: (state, action: PayloadAction<any>) => {
      state.companyConfig = action.payload;
      state.error_company = null;
    },
    companyConfigFailure: (state, action: PayloadAction<any>) => {
      state.companyConfig = null;
      state.error_company = action.payload;
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
  companyConfigFailure,
  companyConfigSuccess,
  rehydrate,
  resetError,
} = authSlice.actions;

export default authSlice.reducer;
