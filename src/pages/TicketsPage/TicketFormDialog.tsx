import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import InputArea from "../../components/Inputarea";
import InputDate from "../../components/InputDate";
import TextArea from "../../components/TextArea";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authAPI } from "../../services/api";
import { generateImageUrl } from "../../utils/common";

type TicketActionType = "Ask Question" | "Report Bug" | "Task";

const ticketCreateSchema = z.object({
  Id: z.union([z.string(), z.number()]).nullable().optional(),
  ticketDescription: z.string().trim().min(1, "Required"),
  ticketSummary: z.string().optional(),
  startDate: z.string().trim().min(1, "Required"),
  file: z.instanceof(File).nullable().optional(),
});

type TicketCreateFormData = z.infer<typeof ticketCreateSchema>;

export interface TicketCreatePayload {
  Id: string | number | null;
  ticketDescription: string;
  ticketSummary: string;
  startDate: string;
  ticketTypeId: number;
  file: any | null;
  isQuestion: boolean | null;
}

interface TicketCreateDialogProps {
  open: boolean;
  selectedTicketType: TicketActionType | null;
  ticketTypeId: number;
  onClose: () => void;
  onSave: (payload: TicketCreatePayload) => void;
  primaryColor?: string;
  secondaryColor?: string;
  projectDetail?: {
    projectName?: string;
    epicTicket?: string;
    reportEmp?: string;
  } | null;
  editRecord?: any;
}

const TicketCreateDialog: React.FC<TicketCreateDialogProps> = ({
  open,
  selectedTicketType,
  ticketTypeId,
  secondaryColor,
  onClose,
  onSave,
  primaryColor,
  projectDetail,
  editRecord,
}) => {
  const currentDate = useMemo(() => {
    const now = new Date();
    const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - timezoneOffsetInMs)
      .toISOString()
      .split("T")[0];
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TicketCreateFormData>({
    resolver: zodResolver(ticketCreateSchema),
    mode: "onBlur",
    defaultValues: {
      Id: null,
      ticketDescription: "",
      ticketSummary: "",
      startDate: currentDate,
      file: null,
    },
  });
  const [fileName, setFileName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const isEditMode = Boolean(editRecord?.Id);

  useEffect(() => {
    if (open) {
      let editStartDate = currentDate;
      if (editRecord?.startDate) {
        const parsedDate = new Date(editRecord.startDate);
        if (!Number.isNaN(parsedDate.getTime())) {
          editStartDate = parsedDate.toISOString().split("T")[0];
        }
      }

      reset({
        Id: editRecord?.Id ?? null,
        ticketDescription: editRecord?.ticketDescription || "",
        ticketSummary: editRecord?.ticketSummary || "",
        startDate: editStartDate,
        file: null,
      });
      setFileName(editRecord?.file || "");
      setFileUrl(editRecord?.file ? generateImageUrl(editRecord.file) : "");
      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  }, [open, reset, currentDate, ticketTypeId, editRecord]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const projectName = projectDetail?.projectName;
  const epicTicket = projectDetail?.epicTicket;
  const reportEmp = projectDetail?.reportEmp;

  const submitHandler: SubmitHandler<TicketCreateFormData> = async (
    data: any,
  ) => {
    let fileData = data.file || null;

    if (data?.file && typeof data?.file === "object") {
      const formData = new FormData();
      formData.append("file", data.file);

      // Use await instead of .then() for better flow control
      const response = await authAPI.uploadFile(formData);
      fileData = response?.data?.filename;
    }

    onSave({
      Id: data?.Id ?? editRecord?.Id ?? null,
      ticketDescription: data.ticketDescription,
      ticketSummary: data.ticketSummary || "",
      startDate: data.startDate,
      ticketTypeId,
      isQuestion: !data?.Id
        ? selectedTicketType == "Ask Question"
          ? true
          : false
        : data?.isQuestion,
      file: fileData, // Use the uploaded file name
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        style={{ backgroundColor: secondaryColor }}
        className="sm:max-w-[640px]"
      >
        <DialogHeader className=" rounded-full">
          <DialogTitle>{selectedTicketType ?? "Ticket"}</DialogTitle>
        </DialogHeader>
        <hr />
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="grid grid-cols-1 gap-1 md:gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-4">
            <InputArea
              id="projectName"
              label="Project Name"
              value={projectName}
              disable
            />
            <InputArea
              id="epicTicket"
              label="Epic Ticket"
              value={epicTicket}
              disable
            />
          </div>

          <InputArea
            id="reportEmp"
            label="Assign Employee"
            value={reportEmp}
            disable
          />

          <InputArea
            id="ticketDescription"
            label="Description"
            placeholder="Enter description"
            registration={{ ...register("ticketDescription") }}
            error={errors.ticketDescription?.message}
          />

          <TextArea
            id="ticketSummary"
            label="Summary"
            placeholder="Enter summary"
            registration={{ ...register("ticketSummary") }}
            rows={2}
            error={errors.ticketSummary?.message}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="startDate"
                  label="Start Date"
                  value={field.value}
                  onChange={field.onChange}
                  disable
                  error={errors.startDate?.message}
                />
              )}
            />

            <div className="">
              <label className="form-label">Attachment</label>
              <input
                type="file"
                accept="*.*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setValue("file", file || null);
                  setFileName(file?.name || "");
                  if (localPreviewUrl) {
                    URL.revokeObjectURL(localPreviewUrl);
                  }
                  if (file) {
                    const preview = URL.createObjectURL(file);
                    setLocalPreviewUrl(preview);
                    setFileUrl(preview);
                  } else {
                    setLocalPreviewUrl(null);
                    setFileUrl("");
                  }
                }}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="text-xs bg-white line-clamp-1 overflow-hidden  border border-[#222222] text-black px-3 rounded-[5px] w-full cursor-pointer inline-flex items-center py-2 "
              >
                {fileName ? (
                  <a
                    href={fileUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" text-xs text-blue-700 underline"
                  >
                    {fileName}
                  </a>
                ) : (
                  "Choose File"
                )}
              </label>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-1 py-2 justify-end">
            <button
              type="button"
            className="px-4 w-fit disabled:opacity-50 h-fit hover:bg-transparent text-sm hover:text-[#222222] border-2 border-[#222222] bg-white text-[#222222] py-2 rounded-full font-medium hover:bg-black transition-colors"
              style={{ background: secondaryColor }}
              onClick={() => onClose()}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 w-fit disabled:opacity-50  h-fit hover:bg-transparent text-sm hover:text-[#222222] border-2 border-[#222222] bg-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors"
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketCreateDialog;
