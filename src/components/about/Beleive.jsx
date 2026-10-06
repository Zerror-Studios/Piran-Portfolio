"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const BELIEFS = [
    "Putting the brand first is a form of care, not distance.",
    "A brand needs a point of view before it needs a product.",
    "What a founder thinks is the problem and what the brand needs are often two different things.",
    "Depth over speed.",
    "If a relationship doesn't outlast the project, it was set up wrong.",
    "I lead with trust, and I write the alignment down.",
    "Every introduction strengthens a network or weakens it.",
    "Free gets ignored. Paid gets implemented.",
    "Credentials follow character. The work speaks, or it doesn't.",
    "I don't extract. I earn."
];

export default function Beleive() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.belief-item');
        
        items.forEach((item) => {
            gsap.fromTo(item, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, 
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions:"play none none reverse"
                    }
                }
            );
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full py-12 md:py-24 relative">
            <div className="container">
                
                <h2 data-para-effect className="mb-12 leading-none">
                    Some things <br /> I believe
                </h2>
                
                <div className="relative">
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-0 relative z-10">
                        {BELIEFS.map((belief, i) => {
                            const isEven = i % 2 !== 0; // index 1, 3, 5 are on the right side visually
                            return (
                                <div 
                                   key={i} 
                                   className={`belief-item flex flex-col md:col-span-5 ${isEven ? 'md:col-start-7 lg:md:col-start-8 md:mt-32 lg:mt-48' : 'md:col-start-2'} mb-8 md:mb-0`}
                                >
                                   <div className="flex gap-x-3 items-center">
                                      {/* Dot */}
                                      <div className="  relative flex-shrink-0">
                                         <div 
                                            className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#954729] relative z-10 `} 
                                         />
                                      </div>
                                      
                                      {/* Numeral and Text */}
                                      <div className="flex gap-x-3 items-center">
                                         <span className="text-9xl font-semibold text-[#0B1A2C] opacity-10  shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                         </span>
                                         <p className="text-2xl">
                                            {belief}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}