import React from "react";

function TextareaInput({
  label,
  id,
  className,
  value,
  onChange,
  rows,
  ...props
}) {
  return (
    <div className="input-container">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows || 10}
        className={`${className} v${value ? "active" : ""}`}
        {...props}
      />
      <label className={value ? "active" : ""} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default TextareaInput;
