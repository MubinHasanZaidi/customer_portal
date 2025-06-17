import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  applyBy: string
  description: string
  department: string
  jobType: string
  level: string
  experience: string
  salary: string
  positions: number
  postedAt: string
}

interface JobsState {
  jobs: Job[]
  selectedJob: Job | null
  isLoading: boolean
  error: string | null
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
}

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchJobsSuccess: (state, action: PayloadAction<Job[]>) => {
      state.isLoading = false
      state.jobs = action.payload
      state.error = null
    },
    fetchJobsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchJobDetailStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchJobDetailSuccess: (state, action: PayloadAction<Job>) => {
      state.isLoading = false
      state.selectedJob = action.payload
      state.error = null
    },
    fetchJobDetailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  fetchJobDetailStart,
  fetchJobDetailSuccess,
  fetchJobDetailFailure,
} = jobsSlice.actions

export default jobsSlice.reducer
