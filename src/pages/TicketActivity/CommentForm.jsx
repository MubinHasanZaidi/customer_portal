import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FileUpload from "../../components/FileUpload";
import MentionInputField from "../../components/MentionInput";
import { generateImageUrl } from "../../utils/common";

// Zod validation schema
const formSchema = z.object({
  comment: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.trim() !== "", {
      message: "Required",
    }),
  file: z.any().optional(),
  mentionEmpId: z.array(z.any()).optional(),
  Id: z.any().optional(),
});

function CommentForm({ onSave, commentForm, setCommentForm }) {
  const inputFile = useRef(null);

  const initVal = useMemo(
    () => ({
      comment: commentForm?.comment || "",
      file: commentForm?.file || '',
      mentionEmpId: commentForm?.mentionEmpId || [],
      Id: commentForm?.Id || null,
    }),
    [commentForm],
  );

  const { loading } = useSelector((state) => ({
    loading: state?.ticket_activity?.isLoading,
  }));

  // React Hook Form setup
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initVal,
  });

  useEffect(() => {
    reset(initVal);
  }, [initVal, reset]);

  // Watch values for real-time updates
  const watchedComment = watch("comment");
  const watchedFile = watch("file");

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setValue("file", file, { shouldValidate: true });
  };

  // Handle clear form
  const handleClear = () => {
    reset(initVal);
    setCommentForm(initVal);
    if (inputFile.current) {
      inputFile.current.value = "";
    }
  };

  // Handle form submission
  const onSubmit = async (values) => {
    await onSave(values, reset);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form form-label-right">
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3">
          <MentionInputField
            label={
              <span>
                Comment<span style={{ color: "red" }}>*</span>
              </span>
            }
            name="comment"
            value={watchedComment}
            setFieldValue={(name, value) =>
              setValue(name, value, { shouldValidate: true })
            }
            onBlur={() => {}}
            error={errors?.comment?.message}
            touched={!!errors?.comment}
            placeholder=""
            rows={3}
            onMentionsChange={(mentions) => {
              const mentionIds = (mentions || []).map((item) => item.id);
              setValue("mentionEmpId", mentionIds, { shouldValidate: true });
            }}
            mentionData={[]}
            onChangeComplete={() => {}}
          />
        </div>
        <div>
          <FileUpload
            label="Attachment:"
            id="file"
            name="file"
            accept="*/*"
            inputFile={inputFile}
            fileName={
              watchedFile instanceof File ? watchedFile.name : watchedFile
            }
            fileUrl={
              watchedFile instanceof File
                ? URL.createObjectURL(watchedFile)
                : generateImageUrl(watchedFile)
            }
            onChange={handleFileChange}
            error={errors}
            isEdit={false}
          />
          {errors?.file && (
            <div className="invalid-feedback">{errors.file.message}</div>
          )}
        </div>

        <div className="flex gap-2 items-end justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={handleClear}
            className="px-4 w-fit disabled:opacity-50 h-fit hover:bg-transparent text-xs hover:text-[#222222] border-2 border-[#222222] bg-white text-[#222222] py-2 rounded-full font-medium hover:bg-black transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting || loading}
            className="px-4 w-fit disabled:opacity-50 h-fit hover:bg-transparent text-xs hover:text-[#222222] border-2 border-[#222222] bg-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors"
          >
            {commentForm?.Id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
