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

const pad = (n) => String(n).padStart(2, '0');

export default function Beleive() {
    const containerRef = useRef(null);
    const counterRef = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const items = gsap.utils.toArray('.belief-item');

        // Driven outside React so fast scrolling doesn't re-render the list or queue transitions
        const setActive = (i) => {
            items.forEach((item, j) => item.classList.toggle('is-active', j === i));
            gsap.to(counterRef.current, {
                yPercent: (-100 / BELIEFS.length) * i,
                duration: reduceMotion ? 0 : 0.5,
                ease: "power3.out",
                overwrite: true,
            });
        };
        setActive(0);

        items.forEach((item, i) => {
            // Whichever belief crosses the middle of the screen drives the counter
            ScrollTrigger.create({
                trigger: item,
                start: "top 55%",
                end: "bottom 55%",
                onToggle: (self) => self.isActive && setActive(i),
            });

            if (reduceMotion) return;

            // Words light up as the line is read into place
            gsap.fromTo(item.querySelectorAll('.belief-word'),
                { opacity: 0.12 },
                {
                    opacity: 1,
                    stagger: 0.1,
                    ease: "none",
                    scrollTrigger: { trigger: item, start: "top 80%", end: "top 45%", scrub: true }
                }
            );
        });

        // Progress hairline fills alongside the whole list
        gsap.fromTo('.belief-progress',
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: '.belief-list', start: "top 55%", end: "bottom 55%", scrub: true }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full py-12 md:py-24 relative bg-[#e3e2dc]">
            <div className="container md:grid grid-cols-12 gap-x-5">

                {/* Left: pinned heading + rolling counter */}
                <div className="md:col-span-5 lg:col-span-4">
                    <div className="md:sticky md:top-24 md:h-[calc(100vh-12rem)] flex flex-col justify-between">
                        <h2 data-para-effect className="leading-none">
                            Some things <br /> I believe
                        </h2>

                        <div className="hidden md:flex items-end gap-6">
                            {/* Progress hairline */}
                            <div className="relative w-px h-40 bg-[#0B1A2C20] overflow-hidden">
                                <div className="belief-progress absolute inset-0 bg-[#954729] origin-top" />
                            </div>

                            <div className="flex items-end gap-3">
                                {/* Odometer numeral */}
                                <div className="h-[6rem] overflow-hidden text-[6rem] leading-none font-medium  text-[#0B1A2C]">
                                    <div ref={counterRef} className="will-change-transform">
                                        {BELIEFS.map((_, i) => (
                                            <div key={i} className="h-[6rem]">{pad(i + 1)}</div>
                                        ))}
                                    </div>
                                </div>
                                <span className="opacity-40 text-lg pb-3">/ {pad(BELIEFS.length)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: beliefs */}
                <ol className="belief-list md:col-start-7 md:col-span-6 mt-12 md:mt-[30vh] md:mb-[20vh]">
                    {BELIEFS.map((belief, i) => (
                        <li
                            key={i}
                            className={`belief-item flex gap-4 md:block py-8 md:py-[12vh] border-t border-dashed border-[#0B1A2C30] first:border-t-0 transition-opacity duration-500 md:opacity-50 md:[&.is-active]:opacity-100`}
                        >
                            {/* Inline numeral on mobile, where the pinned counter is hidden */}
                            <span className="md:hidden text-[2.75rem] leading-none font-medium text-[#954729] shrink-0">
                                {pad(i + 1)}
                            </span>

                            <h4 className="text-3xl text-[#0B1A2C]">
                                {belief.split(' ').map((word, w) => (
                                    <span key={w} className="belief-word">{word} </span>
                                ))}
                            </h4>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
