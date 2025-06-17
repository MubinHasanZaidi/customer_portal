import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  id: string;
  label?: string;
  error?: string;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  error,
  registration,
  value,
  onChange,
  placeholder,
  className = "",
  rows = 3,
}) => {
  const textAreaProps = registration
    ? { ...registration }
    : { value, onChange };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          rows={rows}
          className={`form-input placeholder:text-sm px-1 border-x-0 border-t-0 border-b-2 border-b-[#707070] focus:border-y-0 bg-transparent focus:border-b-2 focus:border-b-[#0093DD] focus:ring-0 placeholder:text-[#222222] resize-none ${className}`}
          placeholder={placeholder}
          {...textAreaProps}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default TextArea; 