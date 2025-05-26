"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ToastNotification({ message, show, onClose, action }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // auto close after 4s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between gap-4"
        >
          <div>{message}</div>
          <div className="flex items-center gap-3">
            {action && (
              <button
                className="underline text-white hover:text-gray-200"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-lg"
            >
              ✖️
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
