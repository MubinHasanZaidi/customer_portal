import { createAsyncThunk } from "@reduxjs/toolkit";
import { jobsAPI } from "../../services/api";
import {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  fetchJobDetailStart,
  fetchJobDetailSuccess,
  fetchJobDetailFailure,
  fetchLocationList,
  fetchDepartmentList,
} from "../slices/jobsSlice";
import { string } from "zod";

// Add this type above your thunk
interface FetchJobsParams {
  companyId: string;
  currentPage: number;
  jobsPerPage: number;
  searchTerm?: string;
  selectedLocation?: string[];
  selectedDept?: string;
}

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params: FetchJobsParams, { dispatch }) => {
    try {
      dispatch(fetchJobsStart());
      const { data } = await jobsAPI.getJobs(params);
      const raws = data?.jobs.length > 0 ? data?.jobs : [];
      const count = data?.total || 0;
      dispatch(fetchJobsSuccess({ raws, count }));
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch jobs";
      dispatch(fetchJobsFailure(errorMessage));
      throw error;
    }
  }
);

export const fetchJobDetail = createAsyncThunk(
  "jobs/fetchJobDetail",
  async (id: string, { dispatch }) => {
    try {
      dispatch(fetchJobDetailStart());
      const job = await jobsAPI.getJobById(id);
      dispatch(fetchJobDetailSuccess(job?.data || {}));
      return job;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch job details";
      dispatch(fetchJobDetailFailure(errorMessage));
      throw error;
    }
  }
);

export const fetchJobLocations = createAsyncThunk(
  "job/fetchLocationList",
  async (companyId: string, { dispatch }) => {
    try {
      const locations = await jobsAPI.getLocationByCompanyId(companyId);
      dispatch(
        fetchLocationList(locations?.data.length > 0 ? locations?.data : [])
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch location";
      dispatch(fetchLocationList([]));
      throw error;
    }
  }
);

export const fetchJobDepartments = createAsyncThunk(
  "job/fetchDepartmentList",
  async (companyId: string, { dispatch }) => {
    try {
      const department = await jobsAPI.getDepartmentByCompanyId(companyId);
      dispatch(
        fetchDepartmentList(department?.data.length > 0 ? department?.data : [])
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch location";
      dispatch(fetchDepartmentList([]));
      throw error;
    }
  }
);
