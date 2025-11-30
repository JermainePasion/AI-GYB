
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
            <input
                type="number"
                name={name}
                value={displayValue}
                onChange={onChange}
                className="
                    w-24 p-2 rounded-md
                    bg-white/10 backdrop-blur-md
                    border border-white/20
                    text-gray-200 font-medium
                    text-center shadow-sm
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]/50
                "
            />
      </div>
    </div>
  );
};

export default ThresholdSlider;
