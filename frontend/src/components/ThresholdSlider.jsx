
const ThresholdSlider = ({ label, name, value, min=-20, max=20, step=0.1, onChange }) => {

  const displayValue = value !== undefined && value !== null 
    ? parseFloat(value).toFixed(2) 
    : 0;

  return (
    <div className="mb-6">
      {/* Label */}
      <label className="block text-sm font-semibold text-[#EBFFD8] mb-2">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {/* Slider */}
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="
            w-full 
            accent-[#C4E1E6] 
            [&::-webkit-slider-thumb]:bg-[#A4CCD9] 
            [&::-moz-range-thumb]:bg-[#A4CCD9]
            [&::-ms-thumb]:bg-[#A4CCD9]
          "
        />

        {/* Number box */}
        <input
          type="number"
          name={name}
          value={displayValue}
          onChange={onChange}
          className="
            w-24 p-2 rounded 
            bg-[#A4CCD9] 
            border border-[#C4E1E6] 
            text-[#1F2937] font-medium 
            text-center shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#EBFFD8]
          "
        />
      </div>
    </div>
  );
};

export default ThresholdSlider;
