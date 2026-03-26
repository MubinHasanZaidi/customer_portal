import React, { useState } from "react";
import { Mention, MentionsInput } from "react-mentions";

const MentionInputField = ({
  name,
  label,
  value = "",
  onBlur,
  error,
  touched,
  mentionData = [],
  placeholder = "Add Comment. Use '@' for mention",
  a11ySuggestionsListLabel = "Suggested mentions",
  setFieldValue,
  onMentionsChange,
  onChangeComplete,
  disabled = false,
  className = "",
  registration,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event, newValue, newPlainTextValue, mentions) => {
    // Handle react-hook-form registration if provided
    if (registration && registration.onChange) {
      registration.onChange({
        target: { name: registration.name, value: newValue },
      });
    }
    // Handle formik setFieldValue
    else if (setFieldValue && name) {
      setFieldValue(name, newValue);
    }

    if (onMentionsChange) {
      onMentionsChange(mentions);
    }

    if (onChangeComplete) {
      onChangeComplete({
        value: newValue,
        plainText: newPlainTextValue,
        mentions,
      });
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    // Handle react-hook-form registration blur
    if (registration && registration.onBlur) {
      registration.onBlur(e);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  // Ensure mentionData is always an array with proper structure
  const validMentionData = Array.isArray(mentionData)
    ? mentionData
        .map((item) => {
          const id = item?.id ?? item?.value;
          const display =
            item?.display ?? item?.newLabel ?? item?.label ?? item?.name ?? "";
          return {
            id: id == null ? "" : String(id),
            display: String(display),
          };
        })
        .filter((item) => item.id && item.display)
    : [];

  // Custom styles matching InputArea design
  const mentionsInputStyle = {
    control: {
      backgroundColor: "transparent",
      fontSize: "inherit",
      border: "none",
      borderRadius: 0,
      minHeight: "auto",
    },
    "&multiLine": {
      control: {
        fontFamily: "inherit",
        minHeight: 70,
      },
      highlighter: {
        padding: "0.27rem 0.5rem",
        border: "none",
      },
      input: {
        padding: "0.27rem 0.5rem",
        margin: 0,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        fontSize: "inherit",
        color: disabled ? "#6f6f6f" : "#222222",
      },
    },
    input: {
      overflow: "auto",
      height: "auto",
      border: "none",
    },
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "0.375rem",
        marginTop: "4px",
        fontSize: "0.875rem",
        zIndex: 9999,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        maxHeight: 220,
        overflowY: "auto",
      },
      item: {
        padding: "8px 12px",
        fontSize: "0.875rem",
        color: "#374151",
        cursor: "pointer",
        borderBottom: "1px solid #f3f4f6",
        "&focused": {
          backgroundColor: "#f3f4f6",
          color: "#111827",
        },
      },
    },
  };

  const mentionStyle = {
    backgroundColor: "rgba(0, 147, 221, 0.18)",
    color: "#111827",
    borderRadius: "4px",
    padding: "0 3px",
    fontWeight: 500,
  };

  return (
    <div className="relative min-h-[6.28vh] text-xs">
      {label && (
        <label htmlFor={name} className="form-label text-xs">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`form-input px-1 text-xs border border-[#707070] border-xl bg-transparent focus:ring-0 placeholder:text-gray-400 ${
            disabled ? "text-[#6f6f6f]" : "text-[#222222]"
          } ${className} ${error && touched ? "border-red-500" : ""}`}
          style={{
            borderBottom:
              error && touched ? "1px solid #ef4444" : "1px solid #222222",
            padding: 0,
          }}
        >
          <MentionsInput
            name={name}
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            a11ySuggestionsListLabel={a11ySuggestionsListLabel}
            style={mentionsInputStyle}
            disabled={disabled}
            {...(registration ? { ...registration } : {})}
          >
            <Mention
              trigger="@"
              markup="@[__display__](__id__)"
              data={validMentionData}
              style={mentionStyle}
              displayTransform={(id, display) =>
                display ? `@${display}` : `@${id}`
              }
            />
          </MentionsInput>
        </div>
      </div>
      {error && touched && <p className="form-error text-left text-xs">{error}</p>}
    </div>
  );
};

export default MentionInputField;
