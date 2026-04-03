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
          className="text-xs bg-white line-clamp-1 overflow-hidden  border border-[#222222] text-black px-3 rounded-[5px] w-full cursor-pointer inline-flex items-center py-2 "
          title={fileName || ""}
        >
          {fileName ? (
            <a
              href={fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-blue-700 underline"
            >
              {fileName}
            </a>
          ) : (
            "Browse"
          )}
        </label>
      </div>
      {error && <p className="form-error text-left">{error?.file}</p>}
    </div>
  );
};

export default FileUpload;
