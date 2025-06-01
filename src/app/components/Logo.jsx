"use client";
import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/home">
      <h1 className={`${className} text-5xl font-extrabold cursor-pointer`}>
        T<span className="text-[#EDCF5D]">K</span>L
        <span className="text-[#EDCF5D]">K</span>
      </h1>
    </Link>
  );
}
