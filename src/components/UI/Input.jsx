import React from "react";

function Input({ label, id, className, value, ...props }) {

  console.log(value)

  return (
    <div className="input-container">
      <input type="text" id={id} value={value} {...props} />
      <label className={value ? "active" : ""} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default Input;
