import { Select } from "antd";
import { useState } from "react";

function SelectFiled({ value, setValue, options }: any) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-6">
      {/* Floating Label */}
      <label
        className={`absolute left-3 z-[1] bg-white px-1 text-gray-500 
          pointer-events-none transition-all duration-200
          ${
            focused || value
              ? "-top-2 text-xs !text-blue-600 px-1"
              : "top-3 text-base !text-[#999]"
          }`}
      >
        Select Country
      </label>

      {/* Antd Select */}
      <Select
        value={value}
        onChange={(val) => setValue(val)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-5 pb-1 !text-base !h-12"
        options={options}
      />
    </div>
  );
}

export default SelectFiled;
