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
  disable?: boolean;
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
  disable = false,
  rows = 1,
}) => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;
  const textAreaProps = registration
    ? { ...registration }
    : { value, onChange };
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div data-title={placeholder} className="relative overflow-hidden">
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
          style={{
            borderBottom: `1px solid #222222`,
          }}
          className={`form-input placeholder:text-sm px-1 border-x-0 border-t-0 border-b border-b-[#707070] focus:border-y-0 bg-transparent focus:border-b focus:ring-0 placeholder:text-gray-400 ${
            disable ? "text-[#6f6f6f]" : "text-[#222222]"
          } ${className}`}
          placeholder={placeholder}
          {...textAreaProps}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default TextArea;
