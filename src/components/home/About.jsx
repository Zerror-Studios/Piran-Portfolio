"use client";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { RotatingText } from '../common/RotatingText';
import { LiveTime } from '../common/LiveTime';

const logoData = [
    {
        id: 1,
        desc: "A strategic partner to the Poonawalla Group across startups, real estate, and brand ventures.",
        img: "/images/homepage/hero/logo3.svg",
        author: "Poonawalla Group"
    }, {
        id: 2,
        img: "/images/homepage/hero/logo2.svg",
        desc: "A postgraduate year in marketing communication at the University of Melbourne, where international rooms sharpened the thinking and the speaking.",
        author: "University of Melbourne"
    },
    {
        id: 3,
        img: "/images/homepage/hero/logo1.svg",
        desc: "A founder in Build3's tenth cohort, where the next venture took shape in the nutraceutical space.",
        author: "Build3"
    }
];


const About = () => {

    const containerRef = useRef()
    const nextContainerRef = useRef()
    const canvasRef = useRef()

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        })
        tl.to(".int_hd_first", {
            y: -200,
            duration: 1
        })
        tl.to(".oopp_o", {
            opacity: 1,
            duration: 0.5
        }, "<")
        tl.to(".int_hd_first", {
            opacity: 0,
            duration: 0.5
        })
        tl.to(".intro_txt", {
            opacity: 1,
            stagger: 0.5,
            duration: 0.25,
        })
        tl.to(".int_hd", {
            y: -200,
            duration: 1
        })
        tl.to([".int_hd", ".oopp_o"], {
            opacity: 0,
            duration: 0.5,
            pointerEvents: "none"
        })
        tl.to(".piran_img", {
            opacity: 1,
            duration: 0.25,
        }, "<")
        tl.to(".intro_txt", {
            opacity: 0,
            duration: 0.25,
        }, "<")
        tl.to(".above_img_txt", {
            opacity: 1,
            duration: 0.25,
            delay: 0.5,
        })
        tl.to([".above_img_txt", ".piran_img", ".img_toggle_btns"], {
            opacity: 0,
            duration: 0.25,
            delay: 0.5,
        })
        tl.to(".abt_txt_1", {
            opacity: 1,
        }, "<+=0.4")
        tl.to(".abt_txt_2", {
            opacity: 1
        }, "<+=0.4")
        tl.to(".abt_txt_3", {
            opacity: 1
        }, "<+=0.4")

    })

    return (
        <>
            <div ref={containerRef} className="w-full about_section relative h-[350vh] ">

                <div className="flex absolute  bottom-0 z-100 translate-y-1/2 gap-x-20 items-center justify-center w-full pointer-events-auto">
                    {logoData.map((item, i) => (
                        <div key={item.id} className=" logo_op translate-y-10  opacity-100 pointer-events-auto text-left  group relative cursor-pointer">
                            <Image
                                width={80}
                                height={56}
                                src={item.img}
                                alt={item.author}
                                className="h-20 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                            />

                            <div className="absolute bottom-full left-0 space-y-4 mb-2 w-80 bg-[#ffffff] text-black p-6 rounded-md shadow-2xl opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none z-50">
                                <div className="">
                                    <Image height={20} width={20} className='invert-100' src="/icons/quote.svg" alt="quote icon" />
                                </div>
                                <p className="text-lg  leading-tight font-medium text-black">
                                    {item.desc}
                                </p>
                                <p className="text-xs font-bold opacity-70 uppercase ">
                                    {item.author}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className=" sticky_bg sticky top-0 w-full h-screen center flex-col text-center leading-none overflow-hidden">

                    <div className="absolute z-100 bottom-5 flex justify-between w-full   left-0  text-white  pointer-events-auto padding  oopp_o opacity-0 ">
                            <div className="w-32.5">
                                <RotatingText />
                            </div>
                            <div className="w-fit">
                                <LiveTime />
                            </div>
                    </div>

                    <div className="text-white absolute int_hd_first">
                        <h2 data-para-effect className=''> <span className=' intro_txt_prev'>Building brands.</span></h2>
                        <h2 data-para-effect className=''> <span className=' intro_txt_prev'>Backing founders.</span></h2>
                    </div>
                    <div className="text-white int_hd">
                        <h2 className=''> <span className=' intro_txt_a intro_txt opacity-0'>Meet</span> <span className='intro_txt opacity-0'>Piran</span></h2>
                        <div className="intro_txt opacity-0">
                            <p className='text-lg italic  opacity-70'>Brand architect to early-stage founders</p>
                        </div>
                    </div>

                    <div className="w-full h-full absolute top-0 inset-0">
                        <div className=" above_img_txt absolute! container  top-[16%] opacity-0 text-white z-10 ">
                            <h4 className='md:w-[70%] mx-auto'>Piran Tarapore has spent seven years turning founders' ambiguity into brands the world can understand, trust, and want. He is building a practice where brand thinking is infrastructure, not a service layer on top of execution.</h4>
                        </div>
                        <div className="  absolute z-99 aspect-video h-[82vh] overflow-hidden    left-1/2 -translate-x-1/2 bottom-0">
                            <Image fill src={"/images/homepage/about_section/piran_pic.svg"} className=' cover piran_img grayscale-100 opacity-0' alt='Piran Tarapore' />
                        </div>
                    </div>

                    <div className="w-full container absolute! space-y-12 text-white inset-0 h-full center flex-col">
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_1'>In service of that, he founded Point Of, the independent consultancy behind 170+ brands across five continents.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_2'>Where the alignment runs deep, he invests: strategic equity in the brands he builds with, and positions in the businesses he believes in.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_3'>Piran is dedicated to the long game: work that means something, people who grow together, and things built carefully enough to last.</h4>
                    </div>

                </div>
            </div>
        </>
    )
}

export default About