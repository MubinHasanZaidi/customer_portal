import React, { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useDispatch } from "react-redux";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentList";
import {
  createOrUpdateTicketComments,
  fetchTicketComments,
} from "../../store/actions/ticketActivityActions";
import { authAPI } from "../../services/api";

export function CommentSection({ Id, primaryColor, customerUserId }) {
  const dispatch = useDispatch();
  const [commentsFilter, setCommentsFilter] = useState({
    ticketId: Id,
    page: 1,
  });
  const [commentForm, setCommentForm] = useState({
    Id: null,
    comment: "",
    file: "",
    mentionEmpId: [],
  });
  // extract values from read redux

  /// coment handle submit
  const handleSubmit = async (payload, resetForm) => {
    if (payload?.file && payload.file instanceof File) {
      try {
        const formData = new FormData();
        formData.append("file", payload.file);
        const uploadResponse = await authAPI.uploadFile(formData);

        if (uploadResponse?.data?.filename) {
          payload.file = uploadResponse.data.filename;
        } else {
          // Error handling
          console.error("File upload failed or no filename in response");
          return;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    const finalPayload = {
      ...payload,
      ...commentsFilter,
    };

    dispatch(createOrUpdateTicketComments(finalPayload))
      ?.then(() => {
        resetForm();
        setCommentForm({ Id: null, comment: "", file: "", mentionEmpId: [] });
      })
      .catch((error) => {
        console.error("Error creating/updating comment:", error);
      });
  };

  const refreshComments = () => {
    const shouldFetch = commentsFilter?.ticketId;

    if (shouldFetch) {
      setCommentsFilter({
        ...commentsFilter,
        page: 1,
      });
      dispatch(fetchTicketComments({ ...commentsFilter, page: 1 }));
    }
  };

  return (
    <>
      {commentsFilter?.ticketId ? (
        <div className="w-full overflow-x-auto h-auto min-h-32 px-3 py-2 rounded-lg bg-white mt-2">
          <CommentForm
            onSave={handleSubmit}
            commentForm={commentForm}
            setCommentForm={setCommentForm}
          />
          <hr />
          <div className="flex justify-between items-center">
            <h6
              style={{ color: primaryColor }}
              className="font-bold mb-0  my-2"
            >
              Comments
            </h6>
            <button
              type="button"
              className="text-xs bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] text-white px-3 rounded-full cursor-pointer inline-flex items-center py-1 "
              title="Refresh"
              disabled={!commentsFilter?.ticketId}
              onClick={refreshComments}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          <CommentsList
            commentsFilter={commentsFilter}
            setCommentsFilter={setCommentsFilter}
            setCommentForm={setCommentForm}
            customerUserId={customerUserId}
            primaryColor={primaryColor}
          />
        </div>
      ) : null}
    </>
  );
}
