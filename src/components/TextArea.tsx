import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import useCompanyConfig from "../hooks/useCompanyConfig";

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
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;
  const textAreaProps = registration
    ? { ...registration }
    : { value, onChange };
  const [isFocused, setIsFocused] = useState(false);

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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`form-input placeholder:text-sm px-1 border-x-0 border-t-0 border-b-2 bg-transparent focus:ring-0 placeholder:text-[#222222] resize-none ${className}`}
          style={{
            borderBottom: `2px solid ${isFocused ? primary_color : "#707070"}`,
          }}
          placeholder={placeholder}
          {...textAreaProps}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default TextArea; 