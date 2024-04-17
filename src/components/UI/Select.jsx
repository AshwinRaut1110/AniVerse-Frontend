import React from "react";

function Select({ options, value, name, className, ...props }) {
  return (
    <div className="select relative border border-[#ddd] outline-none rounded-md">
      <select
        className={`appearance-none bg-transparent text-white border-none outline-none w-[90%] h-full p-3 ${
          className || ""
        }`}
        value={value}
        name={name}
        {...props}
      >
        {Object.keys(options).map((label) => (
          <option value={options[label]} className="text-black" key={label}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
