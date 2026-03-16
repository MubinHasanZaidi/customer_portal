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
  fetchFormOption,
  fetchFormOptionFailure,
  fetchFormOptionStart,
  fetchApplicantData,
  fetchActiveVacancy,
} from "../slices/jobsSlice";
import { encrypt } from "../../utils/crypto";
import { toast } from "react-toastify";

// Add this type above your thunk
interface FetchJobsParams {
  customerId: string;
  currentPage: number;
  jobsPerPage: number;
  searchTerm?: string;
  selectedLocation?: string[];
  selectedDept?: string;
  applicantId?: any;
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
  async (customerId: string, { dispatch }) => {
    try {
      const locations = await jobsAPI.getLocationByCompanyId(customerId);
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
  async (customerId: string, { dispatch }) => {
    try {
      const department = await jobsAPI.getDepartmentByCompanyId(customerId);
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

export const fetchFormOptionAction = createAsyncThunk(
  "job/fetchFormOption",
  async (
    { parentId, key }: { parentId: string; key: string },
    { dispatch }
  ) => {
    try {
      dispatch(fetchFormOptionStart());
      const result = await jobsAPI.getFormOption(parentId);
      dispatch(fetchFormOption({ key, data: result?.data || [] }));
      return result;
    } catch (error) {
      dispatch(fetchFormOptionFailure());
      const errorMessage =
        error instanceof Error ? error.message : `Failed to fetch ${key}`;
      throw error;
    }
  }
);

export const fetchCountryOptionAction = createAsyncThunk(
  "job/fetchCountryOption",
  async ({ key }: { key: string }, { dispatch }) => {
    try {
      dispatch(fetchFormOptionStart());
      const result = await jobsAPI.getCountryOption();
      dispatch(fetchFormOption({ key, data: result?.data || [] }));
      return result;
    } catch (error) {
      dispatch(fetchFormOptionFailure());
      const errorMessage =
        error instanceof Error ? error.message : `Failed to fetch ${key}`;
      throw error;
    }
  }
);

export const fetchCityOptionAction = createAsyncThunk(
  "job/fetchCityOption",
  async (
    { key, countryId }: { key: string; countryId?: number },
    { dispatch }
  ) => {
    try {
      // dispatch(fetchFormOptionStart());
      const result = await jobsAPI.getCityOption(countryId);
      dispatch(fetchFormOption({ key, data: result?.data || [] }));
      return result;
    } catch (error) {
      dispatch(fetchFormOptionFailure());
      const errorMessage =
        error instanceof Error ? error.message : `Failed to fetch ${key}`;
      throw error;
    }
  }
);

export const uploadFiles = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  return await jobsAPI
    .uploadFile(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      error.clientMessage = "File not Uploaded";
      // dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const applicatFormSubmit = createAsyncThunk(
  "job/uploadApplicantForm",
  async (
    {
      data,
      setIsSubmitting,
      setSubmitSuccess,
      setError,
    }: {
      data: any;
      setIsSubmitting?: any;
      setSubmitSuccess: any;
      setError: any;
    },
    { dispatch }
  ) => {
    try {
      const result = await jobsAPI.applicantFormSubmit(data);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setError(null);
      const encryptedUser = encrypt(JSON.stringify(result?.data));
      localStorage.setItem("user", encryptedUser);
      return result;
    } catch (error) {
      const errorMessage =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as any).response?.data?.message) ||
        (error instanceof Error ? error.message : "Failed to submit Form");
      setError(errorMessage);
      toast.error(errorMessage)
      setIsSubmitting(false);
      setSubmitSuccess(true);
      throw error;
    }
  }
);

export const fetchApplicant = createAsyncThunk(
  "job/fetchApplicantData",
  async (_: void, { dispatch }) => {
    try {
      const result = await jobsAPI.getApplicantForm();
      dispatch(fetchApplicantData(result?.data));
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to submit Form`;
      throw error;
    }
  }
);

export const fetchJobMandatorySkills = async (jobId: string) => {
  try {
    const result = await jobsAPI.getJobMandaotrySkills(jobId);
    return result?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchActiveVacancyAction = createAsyncThunk(
  "job/fetchActiveVacancy",
  async (_: void, { dispatch }) => {
    try {
      const result = await jobsAPI.getActiveVacancy();
      dispatch(fetchActiveVacancy(result?.data));
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to submit Form`;
      throw error;
    }
  }
);

export const downloadOfferLetter = () => async () => {
  return jobsAPI
    .downloadOfferLetter()
    .then((res: any) => {
      const pdfBlob = new Blob([res], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "job_offer_letter.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message || "Not found");
    });
};

export const handleJobOffer = createAsyncThunk(
  "job/fetchActiveVacancy",
  async (body: any, { dispatch }) => {
    try {
      const response = await jobsAPI.handleOfferLetter(body);
      if (response) {
        dispatch(fetchActiveVacancy(response?.data));
        toast.success("Vacancy Updated Successfully");
        return response;
      }
    } catch (error) {
      toast.error("Something went wrong");
      throw error; // rethrow so thunk status reflects error
    }
  }
);
