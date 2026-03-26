import React from "react";

const FileUpload = ({
  id = "file_input",
  name = "file",
  fileName,
  onChange,
  inputFile,
  accept = "",
  isEdit = false,
  fileUrl,
  error,
}: any) => {
  return (
    <div>
      {/* Field Label */}
      <label className="form-label text-xs">Attachment</label>

      {/* Hidden File Input */}
      <input
        id={id}
        name={name}
        type="file"
        disabled={isEdit}
        accept={accept}
        ref={inputFile}
        onChange={onChange}
        className="hidden"
      />
      <div style={{ position: "relative", width: "100%" }}>
        {/* Visible Upload Label */}
        <label
          htmlFor={id}
          className="text-xs bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] text-white px-3 rounded-full cursor-pointer inline-flex items-center py-1 "
          title={fileName || ""}
        >
          {"Browse"}
        </label>
        {fileName && (
          <a
            href={fileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-blue-700 underline"
          >
            {fileName}
          </a>
        )}
      </div>
      {error && <p className="form-error text-left">{error?.file}</p>}
    </div>
  );
};

export default FileUpload;
