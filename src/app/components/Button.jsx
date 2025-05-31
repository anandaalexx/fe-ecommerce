export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full font-medium py-2 rounded-md mt-6 transition-all duration-150 cursor-pointer
        ${
          disabled
            ? "bg-[#EDCF5D]/90 cursor-not-allowed"
            : "bg-[#EDCF5D] hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]"
        }
        text-white ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
