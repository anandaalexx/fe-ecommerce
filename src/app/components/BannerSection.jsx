"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const banners = ["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"]; // Ganti dengan path gambar banner

export default function BannerSection() {
  return (
    <div className="bg-gray-100 min-h-[350px] py-6">
      {" "}
      {/* Pastikan tinggi cukup untuk banner */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
        >
          {banners.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="flex items-center justify-center rounded-xl overflow-hidden shadow-md h-[350px]">
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #edcf5d;
        }
      `}</style>
    </div>
  );
}
