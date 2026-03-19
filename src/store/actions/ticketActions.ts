import { createAsyncThunk } from "@reduxjs/toolkit";
import { ticketAPI } from "../../services/api";
import {
  catchError,
  fetchProjectDetail,
  fetchTicketById,
  fetchTickets,
  startCall,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../slices/ticketSlice";
import { toast } from "react-toastify";

export const fetchCustomerProjectDetail = createAsyncThunk(
  "ticket/fetchCustomerProject",
  async (_, { dispatch }) => {
    try {
      dispatch(startCall());
      const { data } = await ticketAPI.getProjectDetail();
      dispatch(fetchProjectDetail(data || {}));
      return data;
    } catch (error) {
      console.error("API error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tickets";
      dispatch(catchError(errorMessage));
      throw error;
    }
  },
);

export const ticketFormSubmit = createAsyncThunk(
  "ticket/ticketFormSubmit",
  async (
    {
      data,
      closeModel,
    }: {
      data: any;
      closeModel: any;
    },
    { dispatch },
  ) => {
    try {
      dispatch(startCall());
      const result = await ticketAPI.createOrUpdateTicket(data);
      console.log("resss", result);
      if (data?.Id) {
        dispatch(updateTicket(result?.data));
      } else {
        dispatch(createTicket(result?.data));
      }
      closeModel();
      toast.success(
        data?.Id
          ? "Record Updated Successfully"
          : "Record Created Successfully",
      );
      return result;
    } catch (error) {
      const errorMessage =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as any).response?.data?.message) ||
        (error instanceof Error ? error.message : "Failed to submit Form");
      toast.error(errorMessage);
      dispatch(catchError(errorMessage));
      closeModel();
      throw error;
    }
  },
);

export const getTickets = createAsyncThunk(
  "ticket/getTickets",
  async (payload: any, { dispatch }) => {
    try {
      dispatch(startCall());
      const response = await ticketAPI.getTickets(payload);
      dispatch(
        fetchTickets({
          count: response?.data?.totalResults,
          entities: response?.data?.rows,
        }),
      );
      return response?.data;
    } catch (error) {
      const errorMessage =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as any).response?.data?.message) ||
        (error instanceof Error ? error.message : "Failed to submit Form");
      toast.error(errorMessage);
      dispatch(catchError(errorMessage));
      throw error;
    }
  },
);

export const getTicketById = createAsyncThunk(
  "ticket/getTicketById",
  async (payload: any, { dispatch }) => {
    try {
      dispatch(startCall());
      const response = await ticketAPI.getTicketById(payload);
      dispatch(fetchTicketById(response?.data));
      return response?.data;
    } catch (error) {
      const errorMessage =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as any).response?.data?.message) ||
        (error instanceof Error ? error.message : "Failed to fetch ticket");
      toast.error(errorMessage);
      dispatch(catchError(errorMessage));
      throw error;
    }
  },
);

export const deleteTicketById = createAsyncThunk(
  "ticket/deleteTicketById",
  async (payload: any, { dispatch }) => {
    try {
      dispatch(startCall());
      const response = await ticketAPI.deleteTicketById(payload);
      dispatch(deleteTicket(response?.data?.Id));
      toast.success("Record Deleted Successfully");
      return response?.data;
    } catch (error) {
      const errorMessage =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as any).response?.data?.message) ||
        (error instanceof Error ? error.message : "Failed to delete ticket");
      toast.error(errorMessage);
      dispatch(catchError(errorMessage));
      throw error;
    }
  },
);
