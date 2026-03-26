import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface JobsState {
  isLoading: boolean;
  error: string | null;
  count: number;
  commentsList: any[];
}

const initialState: JobsState = {
  isLoading: false,
  error: null,
  count: 0,
  commentsList: [],
};

const ticketActivitySlice = createSlice({
  name: "ticket_activity",
  initialState,
  reducers: {
    startCall: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    ticketCommentsFetched: (state, action) => {
      state.isLoading = false;
      state.commentsList = action.payload;
    },
    ticketCommentsCreated: (state, action) => {
      state.isLoading = false;
      state.error = null;
      if (action.payload) {
        state.commentsList = [action.payload, ...state.commentsList];
      }
    },
    ticketCommentsUpdated: (state, action) => {
      state.isLoading = false;
      state.error = null;
      if (action.payload) {
        state.commentsList = state.commentsList.map((comment) =>
          comment.Id === action.payload.Id ? action.payload : comment,
        );
      }
    },
    ticketCommentsDeleted: (state, action) => {
      state.isLoading = false;
      state.error = null;
      if (action.payload) {
        state.commentsList = state.commentsList.filter(
          (comment) => comment.Id !== action.payload.Id,
        );
      }
    },
    catchError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startCall,
  catchError,
  ticketCommentsCreated,
  ticketCommentsDeleted,
  ticketCommentsFetched,
  ticketCommentsUpdated,
} = ticketActivitySlice.actions;

export default ticketActivitySlice.reducer;
