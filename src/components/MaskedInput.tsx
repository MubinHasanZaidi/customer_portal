import React, { useState } from "react";
// @ts-ignore
import MaskedInput from "react-text-mask";
import { UseFormRegisterReturn } from "react-hook-form";

interface MaskedInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  mask: any;
  registration?: UseFormRegisterReturn;
  error?: string;
  className?: string;
  disabled?: boolean;
  value?: string;
  rightIcon?: React.ReactNode;
  disable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaskedInputField: React.FC<MaskedInputProps> = ({
  id,
  label,
  placeholder,
  mask,
  registration,
  error,
  className = "",
  disabled = false,
  value,
  onChange,
  disable = false,
  rightIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Ensure value is always a string
  const safeValue = (registration as any)?.value ?? value ?? ""; // RHF-controlled or manual

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (registration?.onChange) registration.onChange(e);
    if (onChange) onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (registration?.onBlur) registration.onBlur(e);
  };

  return (
    <div className="relative min-h-[6.28vh]">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      <MaskedInput
        id={id}
        mask={mask}
        disabled={disabled}
        placeholder={placeholder}
        guide={true}
        name={registration?.name}
        value={safeValue} // ✅ Always controlled
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        style={{
          borderBottom: `1px solid #222222`,
        }}
        className={`form-input placeholder:text-sm px-1 border-x-0 border-t-0 border-b border-b-[#707070] focus:border-y-0 bg-transparent focus:border-b focus:ring-0 placeholder:text-gray-400 ${
          disable ? "text-[#6f6f6f]" : "text-[#222222]"
        } ${className} ${rightIcon ? "pr-8" : ""}`}
      />

      {error && <p className="form-error text-left">{error}</p>}
    </div>
  );
};

export default MaskedInputField;
