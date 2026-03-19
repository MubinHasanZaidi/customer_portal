import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputDateProps {
  id: string;
  label?: string;
  error?: string;
  placeholder?: string;
  registration?: UseFormRegisterReturn;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disable?: boolean;
  max?: any;
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
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  
  const parseDate = (val: string | Date | null): Date | null => {
    if (!val) return null;

    // If it's already a Date object, just return it
    if (val instanceof Date) return val;

    // Try parsing as 'dd-MMM-yyyy'
    let parsed = parse(val, "dd-MMM-yyyy", new Date());
    if (isValid(parsed)) return parsed;

    // Try parsing as 'yyyy-MM-dd'
    parsed = parse(val, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) return parsed;

    return null;
  };
  const selectedDate = parseDate(value ?? "");

  // Parse max and min dates
  const maxDate = max ? parseDate(max) || new Date(max) : undefined;
  const minDate = min ? parseDate(min) || new Date(min) : undefined;

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
        // style={{
        //   borderBottom: `2px solid ${isFocused ? primary_color : ""}`,
        // }}
        >
          <DatePicker
            id={id}
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="dd-MMM-yyyy"
            disabled={disable}
            placeholderText={placeholder}
            className={`form-input placeholder:text-sm px-1 border-x-0 border-t-0 border-b border-b-[#707070] bg-transparent focus:border-b-1 focus:border-b-[#222222] focus:ring-0 placeholder:text-gray-400 ${
              disable ? "text-[#6f6f6f]" : "text-[#222222]"
            } ${className} ${rightIcon ? "pr-8" : ""}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setTouched(true);
            }}
            maxDate={maxDate}
            minDate={minDate}
            {...(registration ? { name: registration.name } : {})}
            {...(popperClassName ? { popperClassName } : {})}
            {...(portalId ? { portalId } : {})}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            filterDate={(date) => {
              if (maxDate && date > maxDate) return false;
              if (minDate && date < minDate) return false;
              return true;
            }}
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
