import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500" />
    </div>
  );
};

export default Spinner;
