import React from "react";

function Input({ label, id, className, value, ...props }) {
  return (
    <div className="input-container">
      <input id={id} value={value} autoFocus={false} {...props} />
      <label className={value ? "active" : ""} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default Input;
