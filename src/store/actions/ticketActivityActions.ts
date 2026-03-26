import { createAsyncThunk } from "@reduxjs/toolkit";
import { ticketActivityAPI } from "../../services/api";
import {
  catchError,
  startCall,
  ticketCommentsFetched,
  ticketCommentsUpdated,
  ticketCommentsCreated,
  ticketCommentsDeleted,
} from "../slices/ticketActivitySlice";
import { toast } from "react-toastify";

export const fetchTicketComments = createAsyncThunk(
  "ticket_activity/fetchTicketComments",
  async (payload, { dispatch }) => {
    try {
      dispatch(startCall());
      const { data } = await ticketActivityAPI.getAllTicketComments(payload);
      dispatch(ticketCommentsFetched(data || {}));
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

export const createOrUpdateTicketComments = createAsyncThunk(
  "ticket/createOrUpdateTicketComments",
  async (data: any, { dispatch }) => {
    dispatch(startCall());
    try {
      const response = await ticketActivityAPI.createOrUpdateComment(data);
      const ticket = response.data;
      if (data?.Id) {
        dispatch(ticketCommentsUpdated(ticket));
      } else {
        dispatch(ticketCommentsCreated(ticket));
      }
    } catch (error) {
      console.error("API error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tickets";
      dispatch(catchError(errorMessage));
      toast.error(errorMessage || "Can't  comment");
      throw error;
    }
  },
);

export const deleteComment = createAsyncThunk(
  "ticket_activity/deleteComment",
  async (Id: any, { dispatch }) => {
    try {
      await ticketActivityAPI.deleteComment({ Id });
      dispatch(ticketCommentsDeleted({ Id }));
    } catch (error) {
      console.error("API error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tickets";
      dispatch(catchError(errorMessage));
      toast.error(errorMessage || "Can't delete comment");
    }
  },
);
