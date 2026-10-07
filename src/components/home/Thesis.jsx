"use client";
import React, { useRef } from 'react';
import CustomButton from '../common/CustomButton';


import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, Flip);
}

const Thesis = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const stealthTrigger = document.querySelector('.stealth-startup-trigger');
            const stealthImg = document.querySelector('.stealth-startup-img');
            const targetImg = document.querySelector('.thesis-target-img');
            
            if (!stealthTrigger || !stealthImg || !targetImg || !containerRef.current) return;

            // 1. Visually fit the target image over the Stealth Startup image
            Flip.fit(targetImg, stealthImg, { scale: true });

            // 2. Capture this small fitted state
            const smallState = Flip.getState(targetImg);
            
            // 3. Clear the inline fit styles so targetImg returns to its native full layout
            gsap.set(targetImg, { clearProps: "all" });

            // 4. Create the ScrollTrigger for Flip
            const flipTl = gsap.timeline({
                scrollTrigger: {
                    trigger: stealthImg,
                    start: "center center",
                    endTrigger: containerRef.current,
                    end: "top top",
                    scrub: true,
                    onEnter: () => gsap.set(stealthImg, { opacity: 0 }),
                    onLeaveBack: () => gsap.set(stealthImg, { opacity: 1 }),
                }
            });

            // Flip animates FROM the small state TO its native full layout
            flipTl.add(Flip.from(smallState, {
                scale: true,
                duration: 60,
                ease: "power1.inOut",
            }), 0);

            // 5. Create the ScrollTrigger for Sticky Content
            const contentTl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                }
            });

            // Leaver lines arrive
            const lines = gsap.utils.toArray('.leaver-line');
            lines.forEach((line, i) => {
                const startTime = i * 20;
                contentTl.fromTo(line, 
                    { opacity: 0, x: 30 }, 
                    { opacity: 1, x: 0, duration: 20, ease: "power1.out" }, 
                    startTime
                );
            });

            // lines fade, main title rises
            contentTl.to('.leaver-line', { opacity: 0, duration: 15, ease: "power1.inOut" }, 60);
            contentTl.fromTo('.main-thesis-title', 
                { opacity: 0, y: 40 }, 
                { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 
                65
            );

            // body, ask, button rise
            contentTl.fromTo('.body-ask',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 40, ease: "power2.out" },
                80
            );

            
        });
    }, { scope: containerRef });

    return (
        <>
            {/* Desktop Layout - Using Sticky instead of Pin */}
            <div ref={containerRef} className="hidden md:block w-full h-[200vh] relative z-50 ">
                
                <div className="sticky top-0 w-full h-screen">
                    
                    {/* Image Columns (Left 5) */}
                    <div className="w-full h-full relative shrink-0">
                        <img 
                            src="/images/homepage/partners/full_img_4.JPG"
                            className="thesis-target-img w-full h-full object-cover object-[50%_30%]"
                            alt="Thesis"
                        />
                    </div>
                    
                    {/* Content Columns (Right 7) */}
                    <div className="absolute h-screen flex flex-col justify-center padding top-0 left-0 text-white z-10">
                        
                        {/* Leaver Lines */}
                        <div className="absolute inset-0 flex flex-col justify-center padding pointer-events-none">
                            <h4 className="leaver-line opacity-0  leading-tight mb-10 flex items-center">
                                Consultants leave after the recommendation.
                            </h4>
                            <h4 className="leaver-line opacity-0  leading-tight mb-10 flex items-center">
                                Agencies leave after the deliverable.
                            </h4>
                            <h4 className="leaver-line opacity-0  leading-tight mb-10 flex items-center">
                                Investors show up for board meetings.
                            </h4>
                        </div>

                        {/* Main Thesis Content */}
                        <div className="main-thesis flex flex-col relative z-30">
                            <div className="main-thesis-title opacity-0">
                                <h2 className="leading-none mb-8">
                                    Nobody stays. <br /> I stay. 
                                </h2>
                            </div>
                            
                            <div className="body-ask opacity-0 space-y-3 max-w-xl text-lg">
                                <p className="">
                                    I come in before the institutions do, usually pre-seed to seed, where positioning is the bottleneck rather than the product.
                                </p>
                                <p className="italic">
                                    There are two kinds of backing: the kind that steers you, and the kind that moves with you. Mine is the second.
                                </p>
                                <p className="">
                                    Strategic equity is the default and the anchor, and I earn it by creating value.
                                </p>
                                <p className=" pb-6">
                                    My upside is the founder's upside. I don't extract. I earn.
                                </p>
                                
                               <CustomButton theme='dark' href="/thesis" className="w-fit">
                                                        Read the full thesis
                                                    </CustomButton>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            

        </>
    );
};

export default Thesis;
