import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface JobsState {
  jobs: any[];
  selectedJob: any | null;
  isLoading: boolean;
  error: string | null;
  locations: any[];
  departments: any[];
  count: number;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  locations: [],
  departments: [],
  count: 0,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchJobsSuccess: (
      state,
      action: PayloadAction<{ raws: any[]; count: number }>
    ) => {
      state.isLoading = false;
      state.jobs = action.payload.raws;
      state.count = action.payload.count;
      state.error = null;
    },
    fetchJobsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchJobDetailStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchJobDetailSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.selectedJob = action.payload;
      state.error = null;
    },
    fetchJobDetailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchLocationList: (state, action: PayloadAction<any[]>) => {
      state.locations = action.payload;
    },
    fetchDepartmentList: (state, action: PayloadAction<any[]>) => {
      state.departments = action.payload;
    },
  },
});

export const {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  fetchJobDetailStart,
  fetchJobDetailSuccess,
  fetchJobDetailFailure,
  fetchLocationList,
  fetchDepartmentList,
} = jobsSlice.actions;

export default jobsSlice.reducer;
