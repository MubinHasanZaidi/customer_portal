import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { UseFormRegisterReturn } from "react-hook-form";
import useCompanyConfig from "../hooks/useCompanyConfig";

interface InputDateProps {
  id: string;
  label?: string;
  error?: string;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disable?: boolean;
  max?: string;
  min?: string;
  rightIcon?: React.ReactNode;
  popperClassName?: string;
  portalId?: string;
}

const InputDate: React.FC<InputDateProps> = ({
  id,
  label,
  error,
  registration,
  value,
  onChange,
  placeholder = "dd-MMM-yyyy",
  className = "",
  disable = false,
  max,
  min,
  rightIcon,
  popperClassName,
  portalId,
}) => {
  const { companyConfig } = useCompanyConfig();
  const { primary_color } = companyConfig.themeConfig;
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  // Convert string value (like "2025-07-02" or "02-Jul-2025") to Date object
  const parseDate = (val: string | null): Date | null => {
    if (!val) return null;
    // Try parsing as 'dd-MMM-yyyy'
    let parsed = parse(val, "dd-MMM-yyyy", new Date());
    if (isValid(parsed)) return parsed;
    // Try parsing as 'yyyy-MM-dd'
    parsed = parse(val, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) return parsed;
    return null;
  };
  const selectedDate = parseDate(value ?? "");

  // Always output 'yyyy-MM-dd' to the form
  const handleChange = (date: Date | null) => {
    const formatted = date ? format(new Date(date), "yyyy-MM-dd") : "";
    if (registration?.onChange) {
      registration.onChange({ target: { value: formatted } });
    } else if (onChange) {
      onChange({ target: { value: formatted } } as any);
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
        <div
          style={{
            borderBottom: `2px solid ${isFocused ? primary_color : ""}`,
          }}
        >
          <DatePicker
            id={id}
            selected={selectedDate}
            onChange={handleChange}
            
            dateFormat="dd-MMM-yyyy"
            disabled={disable}
            placeholderText={placeholder}
            className={`form-input2 placeholder:text-sm px-1 w-full border-x-0 border-t-0  focus:border-y-0 bg-transparent  focus:ring-0 placeholder:text-[#222222] ${
              disable ? "text-[#6f6f6f]" : "text-[#222222]"
            } ${className} ${rightIcon ? "pr-8" : ""}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setTouched(true);
            }}
            maxDate={max ? new Date(max) : undefined}
            minDate={min ? new Date(min) : undefined}
            {...(registration ? { name: registration.name } : {})}
            {...(popperClassName ? { popperClassName } : {})}
            {...(portalId ? { portalId } : {})}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        {rightIcon && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || (touched && !value)) && (
        <p className="form-error">{error || "Required."}</p>
      )}
    </div>
  );
};

export default InputDate;
