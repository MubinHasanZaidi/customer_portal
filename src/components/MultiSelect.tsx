import React, { useState, useRef, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectProps {
  error?: string;
  options: { value: string; label: string }[];
  registration?: UseFormRegisterReturn;
  value?: string[];
  placeholder?: string;
  onChange?: (values: string[]) => void;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  error,
  options,
  registration,
  placeholder,
  value = [],
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedValues.includes(option.value)
  );

  const handleSelect = (optionValue: string) => {
    const newValues = [...selectedValues, optionValue];
    setSelectedValues(newValues);
    setSearchTerm("");
    onChange?.(newValues);
    if (registration?.onChange) {
      registration.onChange({
        target: { value: newValues },
      } as any);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = selectedValues.filter((v) => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(newValues);
    if (registration?.onChange) {
      registration.onChange({
        target: { value: newValues },
      } as any);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.([]);
    if (registration?.onChange) {
      registration.onChange({
        target: { value: [] },
      } as any);
    }
  };

  return (
    <>
      <div ref={dropdownRef} className="relative m-0">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`form-input mt-[3px] cursor-pointer flex items-center justify-between px-1 border-x-0 border-t-0 border-b-2 border-b-[#707070] bg-transparent focus:border-b-2 focus:border-b-[#0093DD] focus:ring-0 min-h-[38px] ${className}`}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedValues.length > 0 ? (
              selectedValues.map((value) => (
                <div
                  key={value}
                  className="border border-[#222222] rounded-full text-[#222222] px-2 py-0.5 text-sm flex items-center gap-1"
                >
                  {options.find((opt) => opt.value === value)?.label}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-[#0077B3]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                  />
                </div>
              ))
            ) : (
              <span className="text-sm text-[#222222]">
                Select {placeholder}
              </span>
            )}
          </div>
          <div className="flex my-0 items-center">
            {selectedValues.length > 0 && (
              <X
                className="w-4 h-4 text-gray-500 hover:text-gray-700 mr-1"
                onClick={handleClear}
              />
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 text-sm border border-x-0 border-t-0 border-b-[#222222] border-gray-200 rounded-lg focus:outline-none focus:border-[#0093DD]"
              />
            </div>
            <div className="max-h-56 overflow-y-auto m-0">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 text-[#222222]"
                >
                  {option.label}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </>
  );
};

export default MultiSelect;
