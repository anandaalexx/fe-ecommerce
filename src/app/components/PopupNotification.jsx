"use client";
import React from "react";
import { XCircle, CheckCircle, Info } from "lucide-react";

const iconMap = {
  error: <XCircle className="text-red-500 w-6 h-6" />,
  success: <CheckCircle className="text-green-500 w-6 h-6" />,
  info: <Info className="text-blue-500 w-6 h-6" />,
};

const PopupNotification = ({ show, message, type = "info", onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
        <div className="flex flex-col items-center gap-4">
          <div>{iconMap[type]}</div>
          <p className="text-gray-800 font-medium">{message}</p>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupNotification;
