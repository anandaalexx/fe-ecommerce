"use client";
import React from "react";

const RatingSummary = ({ summary }) => {
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      "★".repeat(fullStars) + 
      (hasHalfStar ? "☆" : "") + 
      "☆".repeat(emptyStars)
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="text-center">
        <div className="text-yellow-400 text-2xl mb-2">
          {generateStars(summary.average)}
        </div>
        <div className="text-2xl font-bold">{summary.average}</div>
        <div className="text-sm text-gray-500">dari {summary.total} ulasan</div>
      </div>

      <div className="space-y-2">
        {summary.ratings.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm w-2">{item.star}</span>
            <span className="text-yellow-400">★</span>
            <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="bg-yellow-400 h-full transition-all duration-300"
                style={{ 
                  width: summary.total > 0 ? `${(item.count / summary.total) * 100}%` : '0%' 
                }}
              ></div>
            </div>
            <span className="text-sm font-medium w-6 text-right">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
