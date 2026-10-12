"use client";
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';
import OpticalFiber from './OpticalFiber';
import { testimonials } from './Testimonials';

const stats = [
    { value: "7+", label: "Years in Practice" },
    { value: "170+", label: "Brands Worked With" },
    { value: "5", label: "Continents Spanned" },
];

const Resume = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);
    const swiperRef = useRef(null);

    return (
        <>
            <div className="  w-full pt-12 md:pt-24 pb-32 md:pb-64 h-fit! bg-[#e3e2dc] z-100  relative leading-none overflow-hidden ">
                <div
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === 0 ? 1 : 0, background: 'radial-gradient(100% 100% at 50% 100%, #C9D1D9 0%, #E1E6EA 40%, #F8F6EF 70%, #E3E2DC 100%)' }}
                />
                <div
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === 1 ? 1 : 0, background: 'radial-gradient(100% 100% at 50% 100%, #C9BFA6 0%, #DAD2BE 40%, #E7E0D0 70%, #E3E2DC 100%)' }}
                />
                <div
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === 2 ? 1 : 0, background: 'radial-gradient(100% 100% at 50% 100%, #C9BFA6 0%, #AAB8C5 40%, #E1E6EA 70%, #E3E2DC 100%)' }}
                />

                {/* Optical Fiber Background */}
                <div className="absolute inset-x-0 bottom-0 w-full aspect-[1264/532] flex items-center justify-center ">
                    <OpticalFiber
                        theme={activeIndex === 0 ? "sunrise" : activeIndex === 1 ? "daytime" : "sunset"}
                        originGlow={true}
                    />
                </div>

                <div className="w-full container h-fit! relative pointer-events-none  md:grid grid-cols-12 z-10">
                    <div className=' col-span-3 space-y-8 md:space-y-16 leading-none '>
                        <h2 data-para-effect className="">A Record,  <br /> Not a Resume</h2>
                        <div className=" flex flex-col gap-5">
                            {stats.map((s, i) => (
                                <div
                                    key={s.label}
                                    onClick={() => setActiveIndex(i)}
                                    className={` border backdrop-blur-[2px] rounded-md pointer-events-auto px-8 py-5 bg-white/30 border-dashed border-[#0B1A2050] grid grid-cols-3 cursor-pointer transition-all duration-500 ${activeIndex === i ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                                >
                                    <h3 data-para-effect className=" border-r border-dashed">{s.value}</h3>
                                    <p className="leading-tight col-span-2 pl-5 text-lg mt-2 font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3"></div>

                    <div className=" col-span-6 in-w-0 flex flex-col border rounded-md border-dashed border-[#0B1A2C50] p-8 md:p-12  backdrop-blur-[2px] bg-white/30 z-10 ">
                        <img className='w-8 invert-100' src="/icons/quote.svg" alt="" />
                        <Swiper
                            modules={[Autoplay]}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            loop={true}
                            speed={700}
                            spaceBetween={40}
                            slidesPerView={1}
                            className="w-full flex-1 relative mt-6"
                        >
                            {testimonials.map((t) => (
                                <SwiperSlide key={t.id} className="h-auto!">
                                    <div className="flex flex-col h-full text-left">
                                        <p className="text-xl md:text-2xl leading-snug mb-10">
                                            {t.quote}
                                        </p>
                                        <div className="mt-auto">
                                            <div className="w-12 h-px bg-[#0B1A2C] rounded-full opacity-20 mb-6"></div>
                                            <div className="flex justify-between">
                                                <div className="">
                                                    <h5 className="">{t.name}</h5>
                                                    <p className="opacity-70">{t.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                            <div className="flex absolute bottom-0  right-0 z-10 gap-3">
                                <button
                                    type="button"
                                    aria-label="Previous testimonial"
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="size-12 pointer-events-auto flex items-center justify-center rounded-full border border-dashed border-[#0B1A2C50] cursor-pointer transition-colors duration-300 hover:bg-[#0B1A2C] hover:text-[#e3e2dc]"
                                >
                                    <RiArrowLeftLine size={18} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next testimonial"
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="size-12 pointer-events-auto flex items-center justify-center rounded-full border border-dashed border-[#0B1A2C50] cursor-pointer transition-colors duration-300 hover:bg-[#0B1A2C] hover:text-[#e3e2dc]"
                                >
                                    <RiArrowRightLine size={18} />
                                </button>
                            </div>
                        </Swiper>
                    </div>

                </div>
            </div>
        </>
    )
}


export default Resume