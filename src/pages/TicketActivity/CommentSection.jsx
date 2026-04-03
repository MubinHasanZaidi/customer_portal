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
import useCustomerConfig from "../../hooks/useCustomerConfig";

export function CommentSection({ Id, primaryColor, customerUserId , secondary_color }) {
  const dispatch = useDispatch();
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
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
      <div
        style={{ background: customer?.secondary_color }}
        className="w-full px-4 md:px-6 py-2 md:py-4 mt-4 rounded-2xl flex justify-between"
      >
        <h2 className="text-md font-medium text-[#222222]">Comment Section</h2>
        <button
          type="button"
          className="text-sm text-black px-3 rounded-full cursor-pointer inline-flex items-center py-1 "
          title="Refresh"
          disabled={!commentsFilter?.ticketId}
          onClick={refreshComments}
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>
      {commentsFilter?.ticketId ? (
        <>
          <div
            style={{ background: customer?.secondary_color }}
            className="w-full px-4 md:px-6 py-2 md:py-4 overflow-x-auto h-auto min-h-32 mt-4 rounded-2xl"
          >
            <CommentForm
              onSave={handleSubmit}
              commentForm={commentForm}
              setCommentForm={setCommentForm}
            />
          </div>
          <CommentsList
            commentsFilter={commentsFilter}
            setCommentsFilter={setCommentsFilter}
            setCommentForm={setCommentForm}
            customerUserId={customerUserId}
            primaryColor={primaryColor}
            secondary_color={secondary_color}
          />
        </>
      ) : null}
    </>
  );
}
