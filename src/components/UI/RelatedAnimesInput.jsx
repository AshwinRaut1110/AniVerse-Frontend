import React from "react";
import Input from "./Input";

function RelatedAnimesInput({ DynamicInputs, label, setFunction }) {
  const handleValuesChanged = (index, key, value) => {
    setFunction((prevValue) => {
      const updatedValues = [...prevValue];
      updatedValues[index][key] = value;
      console.log(updatedValues);
      return updatedValues;
    });
  };

  const handleAddValues = () => {
    setFunction((prevValue) => [...prevValue, { anime: "", relation: "" }]);
  };

  const handleRemoveValues = () => {
    setFunction((prevValue) => {
      const updatedValues = [...prevValue];
      updatedValues.pop();
      return updatedValues;
    });
  };

  return (
    <div className="flex-grow p-3">
      <h3 className="text-3xl font-bold font-[Lato] text-[#DDDDDD] my-3">
        {label}s
      </h3>

      <div className="space-y-3">
        {DynamicInputs.map((value, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            key={label + index}
          >
            <Input
              type="text"
              label={`${label} ${index + 1}`}
              value={value.anime}
              onChange={(e) =>
                handleValuesChanged(index, "anime", e.target.value)
              }
            />

            <Input
              type="text"
              label="Relation"
              value={value.relation}
              onChange={(e) =>
                handleValuesChanged(index, "relation", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-4 space-x-4">
        <button
          type="button"
          className="bg-white px-7 py-2 text-lg rounded-full active:scale-95"
          onClick={handleAddValues}
        >
          Add
        </button>

        <button
          type="button"
          className="bg-white px-7 py-2 text-lg rounded-full active:scale-95"
          onClick={handleRemoveValues}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default RelatedAnimesInput;
