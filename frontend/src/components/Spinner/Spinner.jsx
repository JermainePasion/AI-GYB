const Spinner = ({
  size = "xl",          // sm | md | lg | xl | 2xl
  variant = "primary", // primary | white | gray
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-14 h-14 border-4",
    xl: "w-20 h-20 border-[6px]",
    "2xl": "w-32 h-32 border-[8px]",
  };

  const colorStyles = {
    primary: "border-gray-300 border-t-[#ebffd8]",
    white: "border-white/30 border-t-white",
    gray: "border-gray-300 border-t-gray-700",
  };

  return (
    <div
      className={`
        rounded-full
        animate-spin
        ${sizeStyles[size]}
        ${colorStyles[variant]}
        ${className}
      `}
    />
  );
};

export default Spinner;