"use client";
import React, { useState } from "react";

const TabsDetail = ({ description, specification }) => {
  const [activeTab, setActiveTab] = useState("detail");

  return (
    <div className="mt-10">
      <div className="flex gap-8 border-b text-lg">
        <button
          onClick={() => setActiveTab("detail")}
          className={`pb-2 cursor-pointer ${
            activeTab === "detail"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-400"
          }`}
        >
          Detail
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`pb-2 cursor-pointer ${
            activeTab === "review"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-400"
          }`}
        >
          Review
        </button>
      </div>

      {activeTab === "detail" && (
        <div className="mt-4">
          <h3 className="font-medium text-lg">Deskripsi Produk</h3>
          <p className="text-md font-normal text-gray-600 mt-2">
            {description}
          </p>

          <h3 className="font-medium text-md mt-6">Spesifikasi</h3>
          <p className="text-sm font-normal text-gray-600 mt-2">
            {specification}
          </p>
        </div>
      )}
    </div>
  );
};

export default TabsDetail;
