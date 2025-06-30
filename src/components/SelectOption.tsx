import React, { useState, useRef, useEffect } from "react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";
import { ChevronDown, X } from "lucide-react";
import useCompanyConfig from "../hooks/useCompanyConfig";
import { createPortal } from "react-dom";

interface SelectOptionProps {
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  registration: UseFormRegisterReturn;
  className?: string;
  disable?: boolean;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  error,
  options,
  placeholder,
  registration,
  className = "",
  disable = false,
}) => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext();
  const currentValue = watch(registration.name);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const filteredOptions =
    options.length > 0
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (disable) return;
    setIsOpen(false);
    setSearchTerm("");
    setValue(registration.name, optionValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    if (disable) return;
    e.stopPropagation();
    setValue(registration.name, "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const selectedLabel =
    options.find((opt) => opt.value === currentValue)?.label ||
    `${placeholder}`;
  return (
    <>
      <div data-title={placeholder} ref={dropdownRef} className="relative m-0">
        <div
          onClick={() => {
            if (!disable) setIsOpen(!isOpen);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`form-input mt-[3px] flex items-center justify-between px-1 border-x-0 border-t-0 border-b-2 bg-transparent focus:ring-0 ${className} ${disable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            borderBottom: `2px solid ${isHovered ? primary_color : ""}`,
          }}
        >
          <span className="text-sm my-0 text-[#222222]">{selectedLabel}</span>
          <div className="flex my-0 items-center">
            {currentValue && !disable && (
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
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-sm border border-gray-100"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              position: "absolute",
            }}
          >
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-2 py-1 text-sm border border-x-0 border-t-0 border-b rounded-lg focus:outline-none ${disable ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  borderBottom: `2px solid ${
                    isFocused ? primary_color : "#222222"
                  }`,
                  borderColor: isFocused ? primary_color : "#222222",
                }}
                disabled={disable}
              />
            </div>
            <div className="max-h-40 sm:max-h-56 overflow-y-auto m-0">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    background:
                      option.value === currentValue ? secondary_color : "",
                    color:
                      option.value === currentValue ? primary_color : "#222222",
                    pointerEvents: disable ? 'none' : 'auto',
                    opacity: disable ? 0.5 : 1,
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 `}
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
          </div>,
          document.body
        )}
      {error && <p className="form-error">{error}</p>}
    </>
  );
};

export default SelectOption;
