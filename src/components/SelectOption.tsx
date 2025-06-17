import React, { useState, useRef, useEffect } from "react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";
import { ChevronDown, X } from "lucide-react";

interface SelectOptionProps {
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  registration: UseFormRegisterReturn;
  className?: string;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  error,
  options,
  placeholder,
  registration,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext();
  const currentValue = watch(registration.name);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSelect = (optionValue: string) => {
    setIsOpen(false);
    setSearchTerm("");
    setValue(registration.name, optionValue, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true 
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(registration.name, "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  const selectedLabel =
    options.find((opt) => opt.value === currentValue)?.label ||
    `${placeholder}`;
  return (
    <>
      <div ref={dropdownRef} className="relative m-0">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`form-input mt-[3px] cursor-pointer flex items-center justify-between px-1 border-x-0 border-t-0 border-b-2 border-b-[#707070] focus:border-y-0 bg-transparent focus:border-b-2 focus:border-b-[#0093DD] focus:ring-0 ${className}`}
        >
          <span className="text-sm my-0 text-[#222222]">{selectedLabel}</span>
          <div className="flex my-0 items-center">
            {currentValue && (
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
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                    option.value === currentValue
                      ? "bg-[#E6F8FF] text-[#0093DD]"
                      : "text-[#222222]"
                  }`}
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

export default SelectOption;
