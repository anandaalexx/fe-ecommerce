"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";

const typeConfig = {
  success: {
    color: "bg-green-600",
    icon: <CheckCircle className="w-5 h-5 text-white" />,
  },
  error: {
    color: "bg-red-600",
    icon: <XCircle className="w-5 h-5 text-white" />,
  },
  warning: {
    color: "bg-[#EDCF5D]",
    icon: <AlertCircle className="w-5 h-5 text-white" />,
  },
  info: {
    color: "bg-blue-600",
    icon: <Info className="w-5 h-5 text-white" />,
  },
};

export default function ToastNotification({
  message,
  show,
  onClose,
  action,
  type = "success",
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const config = typeConfig[type] || typeConfig.success;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={`fixed top-20 right-4 z-50 text-white px-6 py-4 rounded-xl shadow-xl flex items-center justify-between gap-4 w-fit min-w-[280px] ${config.color}`}
        >
          <div className="flex items-center gap-2">
            {config.icon}
            <span className="font-medium">{message}</span>
          </div>

          <div className="flex items-center gap-3">
            {action && (
              <button
                className="underline hover:text-gray-200 text-sm"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-lg cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
