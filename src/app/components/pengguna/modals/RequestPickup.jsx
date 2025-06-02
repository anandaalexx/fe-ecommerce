"use client";
import { useState, useEffect } from "react";

const ModalRequestPickup = ({ isOpen, onClose, onSubmit, orderNo }) => {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupVehicle, setPickupVehicle] = useState("Motor");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    setMinDate(todayStr);
  }, []);

  const isValidPickup = () => {
    if (!pickupDate || !pickupTime) return false;

    const now = new Date();
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);

    const diffMs = pickupDateTime - now;
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes >= 90;
  };

  const handleSubmit = () => {
    if (!isValidPickup()) {
      alert("Waktu pickup harus minimal 90 menit dari sekarang.");
      return;
    }

    onSubmit({
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      pickup_vehicle: pickupVehicle,
      orders: [{ order_no: orderNo }],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Request Pickup Komship</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Tanggal Pickup</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded"
              value={pickupDate}
              min={minDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Waktu Pickup</label>
            <input
              type="time"
              className="w-full border border-gray-300 p-2 rounded"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kendaraan</label>
            <select
              className="w-full border border-gray-200 p-2 rounded"
              value={pickupVehicle}
              onChange={(e) => setPickupVehicle(e.target.value)}
            >
              <option value="Motor">Motor</option>
              <option value="Mobil">Mobil</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-5 space-x-2">
          <button
            onClick={onClose}
            className="text-gray-500 text-sm border border-gray-200 cursor-pointer rounded px-3 py-2"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#EDCF5D] hover:brightness-110 cursor-pointer text-sm text-white px-3 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRequestPickup;
