export default function Button({
  children,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`${className} relative w-full bg-[#EDCF5D] text-white font-medium py-2 rounded-md mt-6 transition-all duration-150 cursor-pointer 
      hover:brightness-110 active:translate-y-[2px] active:shadow-sm shadow-[0_4px_0_#d4b84a]`}
    >
      {children}
    </button>
  );
}
