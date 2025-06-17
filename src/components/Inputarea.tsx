import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputAreaProps {
  id: string;
  label?: string;
  type?: string;
  error?: string;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  rightIcon?: React.ReactNode;
}

const InputArea: React.FC<InputAreaProps> = ({
  id,
  label,
  type = "text",
  error,
  registration,
  value,
  onChange,
  placeholder,
  className = "",
  rightIcon,
}) => {
  const inputProps = registration ? { ...registration } : { value, onChange };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          className={`form-input placeholder:text-sm px-1 border-x-0 border-t-0 border-b-2 border-b-[#707070] focus:border-y-0 bg-transparent focus:border-b-2 focus:border-b-[#0093DD] focus:ring-0 placeholder:text-[#222222] ${className} ${
            rightIcon ? "pr-8" : ""
          }`}
          placeholder={type === "date" ? "YYYY-MM-DD" : placeholder}
          step={type === "number" ? "any" : undefined}
          {...inputProps}
        />
        {rightIcon && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default InputArea;
