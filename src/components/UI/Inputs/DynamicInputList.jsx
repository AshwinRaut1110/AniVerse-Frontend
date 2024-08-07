import Input from "./Input";

function DynamicInputList({ DynamicInputs, label, setFunction }) {
  const handleValuesChanged = (index, value) => {
    setFunction((prevValue) => {
      const updatedValues = [...prevValue];
      updatedValues[index] = value;
      return updatedValues;
    });
  };

  const handleAddValues = () => {
    setFunction((prevValue) => [...prevValue, ""]);
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

      <div className="w-full space-y-3">
        {DynamicInputs.map((value, index) => (
          <Input
            type="text"
            label={`${label} ${index + 1}`}
            value={value}
            onChange={(e) => handleValuesChanged(index, e.target.value)}
            key={index}
          />
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

export default DynamicInputList;
