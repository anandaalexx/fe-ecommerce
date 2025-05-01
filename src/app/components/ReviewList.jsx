"use client";
import React from "react";

const ReviewList = ({ reviews }) => {
  return (
    <div className="flex flex-col gap-6 mt-4">
      {reviews.map((review, index) => (
        <div key={index} className="flex gap-4">
          <img
            src={review.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">
              {review.name}{" "}
              <span className="text-gray-400 text-sm">{review.timeAgo}</span>
            </p>
            <div className="text-yellow-400 text-sm">
              {"★".repeat(review.rating)}
            </div>
            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
