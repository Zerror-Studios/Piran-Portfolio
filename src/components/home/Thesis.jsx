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

            // Leaver lines: each one comes in, holds, then leaves before the next arrives
            const lines = gsap.utils.toArray('.leaver-line');
            lines.forEach((line, i) => {
                const startTime = i * 25;
                contentTl.fromTo(line,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 8, ease: "power1.out" },
                    startTime
                );
                contentTl.to(line,
                    { opacity: 0, y: -30, duration: 8, ease: "power1.in" },
                    startTime + 15
                );
            });

            // After all three lines, main title rises
            const afterLines = lines.length * 25;
            contentTl.fromTo('.main-thesis-title',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 15, ease: "power2.out" },
                afterLines
            );

            // body, ask, button rise
            contentTl.fromTo('.body-ask',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 20, ease: "power2.out" },
                afterLines + 10
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
                            src="/images/homepage/partners/portfolio_image.png"
                            className="thesis-target-img w-full h-full object-cover object-[50%_30%]"
                            alt="Thesis"
                        />
                    </div>
                    
                    {/* Content Columns (Right 7) */}
                    <div className="absolute h-screen flex flex-col justify-center padding top-0 right-0 w-1/2 text-white z-10">

                        {/* Leaver Lines - stacked in the same spot, shown one at a time */}
                        <div className="absolute inset-0 grid items-center  justify-end padding pointer-events-none">
                            <h4 className="leaver-line opacity-0  w-[30vw] leading-tight  [grid-area:1/1]">
                                Consultants leave after the recommendation.
                            </h4>
                            <h4 className="leaver-line opacity-0  w-[30vw] leading-tight  [grid-area:1/1]">
                                Agencies leave after the deliverable.
                            </h4>
                            <h4 className="leaver-line opacity-0  w-[30vw] leading-tight  [grid-area:1/1]">
                                Investors show up for board meetings.
                            </h4>
                        </div>

                        {/* Main Thesis Content */}
                        <div className="main-thesis flex justify-end  relative z-30">
                            <div className="w-[30vw] flex flex-col ">
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
            </div>

            

        </>
    );
};

export default Thesis;
