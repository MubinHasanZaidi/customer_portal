import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { any } from "zod";

interface JobsState {
  projectDetail: any | null;
  isLoading: boolean;
  error: string | null;
  count: number;
  entities: any[];
  editRecord: any;
}

interface FetchTicketsPayload {
  count: number;
  entities: any[];
}

const initialState: JobsState = {
  projectDetail: {},
  isLoading: false,
  error: null,
  count: 0,
  entities: [],
  editRecord: {},
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    startCall: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProjectDetail: (state, action: PayloadAction) => {
      state.isLoading = false;
      state.projectDetail = action.payload;
      state.error = null;
    },
    fetchTickets: (state, action: PayloadAction<FetchTicketsPayload>) => {
      state.isLoading = false;
      state.count = action.payload.count;
      state.entities = action.payload.entities;
      state.error = null;
    },
    fetchTicketById: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.editRecord = action.payload;
      state.error = null;
    },
    clearEditRecord: (state) => {
      state.editRecord = {};
    },
    catchError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createTicket: (state, action: any) => {
      state.isLoading = false;
      state.error = null;
      const payload = action.payload;
      state.entities = [payload, ...state.entities];
      state.count = state.count + 1;
    },
    updateTicket: (state, action: any) => {
      state.isLoading = false;
      state.error = null;

      const payload = action.payload;

      // Update existing ticket
      const index = state.entities.findIndex(
        (ticket: any) => ticket.Id === payload.Id,
      );
      if (index !== -1) {
        state.entities[index] = { ...state.entities[index], ...payload };
      }
      // Don't increment count for updates
      state.count = state.count;
    },
    deleteTicket: (state, action: any) => {
      state.isLoading = false;
      state.error = null;
      const Id = action.payload;
      state.entities = state.entities.filter((el) => el?.Id !== Id);
      state.count = state.count - 1;
    },
  },
});

export const {
  startCall,
  catchError,
  fetchProjectDetail,
  fetchTickets,
  fetchTicketById,
  clearEditRecord,
  createTicket,
  updateTicket,
  deleteTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;
