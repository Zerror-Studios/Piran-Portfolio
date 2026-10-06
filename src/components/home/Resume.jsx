"use client";
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import gsap from 'gsap';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';
import OpticalFiber from './OpticalFiber';

const Resume = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <div className="  w-full pt-12 md:pt-24  h-fit! bg-[#e3e2dc] z-100  relative leading-none ">
                <div
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === 0 ? 1 : 0, background: 'radial-gradient(100% 100% at 50% 100%, #C9BFA6 0%, #DAD2BE 40%, #E7E0D0 70%, #E3E2DC 100%)' }}
                />
                <div
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === 1 ? 1 : 0, background: 'radial-gradient(100% 100% at 50% 100%, #C9D1D9 0%, #E1E6EA 40%, #F8F6EF 70%, #E3E2DC 100%)' }}
                />
                <div
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === 2 ? 1 : 0, background: 'radial-gradient(100% 100% at 50% 100%, #C9BFA6 0%, #AAB8C5 40%, #E1E6EA 70%, #E3E2DC 100%)' }}
                />
                <div className="w-full container h-fit!  max-sm:space-y-2 md:grid grid-cols-6 items-end">
                    <div className=' col-span-4 leading-none '>
                        <h2 data-para-effect className="">A Record,  <br /> Not a Resume</h2>
                    </div>
                    <p className=' leading-tight col-span-2 opacity-70 text-lg'>The work speaks in outcomes, not titles.</p>
                </div>

                <div className="w-full aspect-[1264/532] pt-24  relative overflow-hidden ">

                    {/* Optical Fiber Background */}
                    <div className="absolute inset-0 bottom-0 w-full flex items-center justify-center">
                        <OpticalFiber
                            theme={activeIndex === 0 ? "sunrise" : activeIndex === 1 ? "daytime" : "sunset"}
                            originGlow={true}
                        />
                    </div>

                    {/* Content Grid */}
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-10 md:gap-y-20 px-4 z-100 relative">
                        <div
                            onClick={() => setActiveIndex(0)}
                            className={` border rounded-md px-8 py-5 border-dashed border-[#0B1A2050] text-center flex flex-col justify-center cursor-pointer transition-all duration-500 ${activeIndex === 0 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                        >
                            <h3 data-para-effect className="">7+</h3>
                            <p className="leading-tight mt-2 font-medium">Years in Practice</p>
                        </div>
                        <div
                            onClick={() => setActiveIndex(1)}
                            className={` border rounded-md px-8 py-5 border-dashed border-[#0B1A2050] text-center flex flex-col justify-center cursor-pointer transition-all duration-500 ${activeIndex === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                        >
                            <h3 data-para-effect className="">170+</h3>
                            <p className="leading-tight mt-2 font-medium">Brands Worked With</p>
                        </div>
                        <div
                            onClick={() => setActiveIndex(2)}
                            className={` border rounded-md px-8 py-5 border-dashed border-[#0B1A2050] text-center flex flex-col justify-center cursor-pointer transition-all duration-500 ${activeIndex === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                        >
                            <h3 data-para-effect className="">5</h3>
                            <p className="leading-tight mt-2 font-medium">Continents Spanned</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Resume