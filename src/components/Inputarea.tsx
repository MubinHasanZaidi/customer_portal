import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";

interface InputAreaProps {
  id: string;
  label?: string;
  type?: string;
  error?: string;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  rightIcon?: React.ReactNode;
  max?: any;
  disable?: boolean;
  amountFormat?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  id,
  label,
  type = "text",
  error,
  registration,
  max = "",
  value,
  onChange,
  placeholder,
  className = "",
  disable = false,
  amountFormat = false,
  rightIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handler for CurrencyInput to work with react-hook-form registration
  const handleCurrencyChange = (val: string | undefined) => {
    if (registration && registration.onChange) {
      registration.onChange({ target: { value: val } });
    } else if (onChange) {
      // fallback for non-hook-form usage
      onChange({ target: { value: val } } as any);
    }
  };

  return (
    <div data-title={placeholder} className="relative min-h-[6.28vh]">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {amountFormat ? (
          <CurrencyInput
            id={id}
            value={value}
            onValueChange={handleCurrencyChange}
            maxLength={max}
            disabled={disable}
            onWheel={(e) => {
              if (type === "number") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            allowNegativeValue={false}
            className={`form-input placeholder:text-xs px-1 border border-[#707070] bg-white focus:border-2 focus:ring-0 placeholder:text-gray-400 ${
              disable ? "text-[#6f6f6f]" : "text-[#222222]"
            } ${className} ${rightIcon ? "pr-8" : ""}`}
            style={{
              border: `1px solid #222222`,
              borderRadius: "5px",
              fontSize: "0.75rem",
              lineHeight: "1rem",
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            step={"any" as any}
            decimalsLimit={2}
            {...(registration ? { name: registration.name } : {})}
          />
        ) : (
          <input
            id={id}
            type={type}
            disabled={disable}
            style={{
              border: `1px solid #222222`,
              borderRadius: "5px",
              fontSize: "0.75rem",
              lineHeight: "1rem",
            }}
            className={`form-input placeholder:text-xs px-1 border-x-0 border-t-0 border-b border-b-[#707070] focus:border-y-0 bg-white focus:border-b focus:ring-0 placeholder:text-gray-400 ${
              disable ? "text-[#6f6f6f]" : "text-[#222222]"
            } ${className} ${rightIcon ? "pr-8" : ""}`}
            maxLength={max}
            onFocus={() => setIsFocused(true)}
            placeholder={type === "date" ? "YYYY-MM-DD" : placeholder}
            step={type === "number" ? "any" : undefined}
            {...(registration ? { ...registration } : { value, onChange })}
          />
        )}
        {rightIcon && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="form-error text-left">{error}</p>}
    </div>
  );
};

export default InputArea;
