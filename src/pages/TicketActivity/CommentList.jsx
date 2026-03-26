import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircleIcon, Trash2, Paperclip, Edit } from "lucide-react";
import {
  deleteComment,
  fetchTicketComments,
} from "../../store/actions/ticketActivityActions";
import { generateImageUrl } from "../../utils/common";
import CommentDeleteDialog from "./CommentDeleteDialog";

const CommentsList = ({
  commentsFilter,
  setCommentForm,
  setCommentsFilter,
  customerUserId,
  primaryColor,
}) => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(null);
  const { commentsList, actionsLoading } = useSelector((state) => {
    return {
      commentsList: state?.ticket_activity?.commentsList,
      actionsLoading: state?.ticket_activity?.isLoading,
    };
  });
  useEffect(() => {
    const shouldFetch = commentsFilter?.ticketId;

    if (shouldFetch) {
      dispatch(fetchTicketComments(commentsFilter));
    }
  }, [commentsFilter?.ticketId, dispatch]);

  return (
    <>
      <div className="flex flex-col gap-2 max-h-[520px] overflow-y-scroll scrollbar-fancy">
        {commentsList?.map((e, i) => {
          return (
            <div
              className={
                e?.customerUserId == customerUserId
                  ? "flex justify-start"
                  : "flex justify-end"
              }
            >
              <div className={"max-w-[60%]"}>
                <CommentCard
                  data={e}
                  key={e?.Id}
                  userId={customerUserId}
                  primaryColor={primaryColor}
                  onEdit={(val) => {
                    setCommentForm(val);
                  }}
                  onDelete={(e) => {
                    setDeleteModal(e?.Id);
                  }}
                />
              </div>
            </div>
          );
        })}
        {commentsList?.length / Number(commentsFilter?.page) == 10 ? (
          <div className="flex justify-center items-center">
            <button
              type="button"
              className="px-4 w-fit disabled:opacity-50 h-fit hover:bg-transparent text-xs hover:text-[#222222] border-2 border-[#222222] bg-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors flex"
              title="Refresh"
              disabled={!commentsFilter?.ticketId || actionsLoading}
              onClick={() => {
                setCommentsFilter({
                  ...commentsFilter,
                  page: commentsFilter.page + 1,
                });
                dispatch(
                  actions.fetchTicketComments({
                    ...commentsFilter,
                    page: commentsFilter.page + 1,
                  }),
                );
              }}
            >
              Load More <LoaderCircleIcon className="w-3 h-3 ml-1 mt-1" />
            </button>
          </div>
        ) : null}
      </div>
      <CommentDeleteDialog
        onClose={() => setDeleteModal(null)}
        onDelete={() => {
          dispatch(deleteComment(deleteModal)).then(() => setDeleteModal(null));
        }}
        open={deleteModal}
        isLoading={actionsLoading}
      />
    </>
  );
};

export default CommentsList;

function CommentCard({ data, onEdit, onDelete, userId }) {
  const employee = data?.Employee;
  const employeeName = employee
    ? `${employee?.firstName || ""}${
        employee?.middleName ? " " + employee.middleName : ""
      }${employee?.lastName ? " " + employee.lastName : ""}`.trim()
    : data?.customerUserId
      ? `${data?.CustomerUser?.name} `
      : "Unknown";

  const employeeCode = employee?.employeeCode || "";
  const createdAt = data?.createdAt ? new Date(data.createdAt) : null;
  const updatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;
  const createdText = createdAt ? formatDateTime(createdAt) : "-";
  const updatedText = updatedAt ? formatDateTime(updatedAt) : "-";
  const isEdited =
    createdAt && updatedAt && createdAt.getTime() !== updatedAt.getTime();
  const fileName = data?.file || "";
  const fileHref = fileName ? `/${fileName}` : null;

  return (
    <div
      style={
        data?.customerUserId == userId
          ? { border: "2px solid black" }
          : { border: "0.5px solid black" }
      }
      className={`group w-full max-w-3xl rounded-xl transition-all duration-200 bg-gray-200 text-white`}
    >
      <div className="p-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Avatar */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-black text-sm">
                  {employeeName}
                </span>

                {employeeCode && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs text-black font-medium border border-black `}
                  >
                    {employeeCode}
                  </span>
                )}
              </div>

              <div className="mt-1 text-xs text-black">{createdText}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center duration-200">
            {fileHref && (
              <a
                href={generateImageUrl(fileHref)}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md`}
                title="Attachment"
              >
                <Paperclip className="h-3.5 w-3.5 text-black" />
              </a>
            )}

            {data?.customerUserId == userId && (
              <>
                <button
                  onClick={() => onEdit?.(data)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md`}
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5 text-black" />
                </button>

                <button
                  onClick={() => onDelete?.(data)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md`}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-black" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Comment Body */}
        <div className="mt-1">
          <div
            className={` p-1 rounded-xl text-xs text-black leading-relaxed bg-white
             `}
          >
            {data?.comment || "-"}
          </div>
        </div>

        {/* Footer */}
        {isEdited && (
          <div className="mt-2 flex justify-end text-xs text-black">
            {isEdited ? `Edited ${updatedText}` : "-"}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= Helpers ================= */

function formatDateTime(date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
