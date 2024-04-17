import React from "react";

function Input({ label, id, className, value, onChange, ...props }) {
  return (
    <div className="input-container">
      <input
        id={id}
        value={value}
        autoFocus={false}
        className={className}
        onChange={onChange}
        {...props}
      />
      <label className={value ? "active" : ""} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default Input;
