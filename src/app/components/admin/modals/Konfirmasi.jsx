"use client";
import { Dialog } from "@headlessui/react";

const ModalKonfirmasi = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus",
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 shadow-md max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-600">
            {message}
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalKonfirmasi;
