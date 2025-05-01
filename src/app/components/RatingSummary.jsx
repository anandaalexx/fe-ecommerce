"use client";
import React from "react";

const RatingSummary = ({ summary }) => {
  return (
    <div className="flex flex-col gap-2 items-end mt-10">
      <div className="flex items-center gap-2">
        <div className="text-yellow-400 text-2xl">★★★★☆</div>
        <div className="text-2xl font-bold">{summary.average}</div>
      </div>

      {summary.ratings.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-s   m">{item.star}</span>
          <div className="w-32 bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className="bg-yellow-400 h-full"
              style={{ width: `${(item.count / summary.total) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{item.count}</span>
        </div>
      ))}
    </div>
  );
};

export default RatingSummary;
