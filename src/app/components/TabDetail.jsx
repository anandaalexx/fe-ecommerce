"use client";
import React, { useState } from "react";
import ReviewList from "./ReviewList";
import RatingSummary from "./RatingSummary";

const TabsDetail = ({ description, reviews }) => {
  const [activeTab, setActiveTab] = useState("detail");

  const calculateRatingSummary = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        ratings: [
          { star: 5, count: 0 },
          { star: 4, count: 0 },
          { star: 3, count: 0 },
          { star: 2, count: 0 },
          { star: 1, count: 0 },
        ],
      };
    }

    const total = reviews.length;
    const ratings = [
      { star: 5, count: reviews.filter((r) => r.rating === 5).length },
      { star: 4, count: reviews.filter((r) => r.rating === 4).length },
      { star: 3, count: reviews.filter((r) => r.rating === 3).length },
      { star: 2, count: reviews.filter((r) => r.rating === 2).length },
      { star: 1, count: reviews.filter((r) => r.rating === 1).length },
    ];

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = (totalRating / total).toFixed(1);

    return {
      average: parseFloat(average),
      total,
      ratings,
    };
  };

  const ratingSummary = calculateRatingSummary(reviews);

  return (
    <div className="mt-10 min-w-[1220px]">
      {/* Tabs Navigation */}
      <div className="flex gap-8 border-b text-base w-full mb-6">
        <button
          onClick={() => setActiveTab("detail")}
          className={`pb-2 border-b-2 transition-colors duration-300 cursor-pointer ${
            activeTab === "detail"
              ? "border-black text-black font-semibold"
              : "border-transparent text-gray-400 hover:text-black"
          }`}
        >
          Detail
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`pb-2 border-b-2 transition-colors duration-300 cursor-pointer ${
            activeTab === "review"
              ? "border-black text-black font-semibold"
              : "border-transparent text-gray-400 hover:text-black"
          }`}
        >
          Review ({reviews?.length || 0})
        </button>
      </div>

      {/* Grid Layout: Tabs + Rating Summary */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Detail or Review Content */}
        <div className="md:w-2/3">
          {activeTab === "detail" && (
            <div>
              <h3 className="font-medium text-lg">Deskripsi Produk</h3>
              <p className="text-md font-normal text-gray-600 mt-2">
                {description}
              </p>
            </div>
          )}

          {activeTab === "review" && (
            <div className="flex items-start">
              {reviews && reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
              ) : (
                <div className="text-center text-gray-500 py-2">
                  <p>Belum ada ulasan untuk produk ini</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Always Visible Rating Summary */}
        <div className="md:w-[25%] ml-20">
          <RatingSummary summary={ratingSummary} />
        </div>
      </div>
    </div>
  );
};

export default TabsDetail;
