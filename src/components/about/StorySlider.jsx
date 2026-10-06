"use client";
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CHAPTERS = [
    { id: '01', title: "Born Watching", text: "I grew up in South Bombay. At school I was the one in my own head, happier watching the room than holding it. Observation came long before conversation.", isHigh: true, img: '/images/aboutpage/story/images/story_school_edge_1790943572161.jpg' },
    { id: '02', title: "Leaving Home", text: "What pulled me out was leaving, and it started closer to home than a passport. The Rotaract Club at H.R. College meant events almost every other day, and people from across Bombay, sometimes across India. Then participating in exchanges took me further: Ukraine, Prague, and Egypt with AIESEC, a summer in Sweden with CISV. Rooms full of people who didn't share my language or my context, where the only way through was to actually talk to someone.", isHigh: false, img: '/images/aboutpage/story/images/story_sweden_exchange_1790943586265.jpg' },
    { id: '03', title: "The Thread", text: "I got good at finding the common thread quickly, building a conversation, turning strangers into people I'd still know years later. It's still, by some distance, the thing I'm best at.", isHigh: true, img: '/images/aboutpage/story/images/story_candid_years_1790943599960.jpg' },
    { id: '04', title: "Everything at Once", text: "The work came after that, and I was good at it. I was also, for a long stretch, completely scattered: optimising everything at once, mistaking motion for progress, certain that doing more was the same as getting somewhere. It wasn't.", isHigh: false, img: '/images/aboutpage/story/images/story_crowded_work_1790943612523.jpg' },
    { id: '05', title: "Ten Days of Silence", text: "Then I stopped. Ten days: no talking, no phone, no work, nothing to manage but my own attention. I came out clearer than I'd been in years about what I wanted a life to be made of: people I love, work that means something, and things that could outlast me. I came back with a set of values I try to live by.", isHigh: true, img: '/images/aboutpage/story/images/story_ten_days_silence_1790944057507.jpg' },
    { id: 'manifesto', title: 'Manifesto', text: 'Principles', isManifesto: true },
    { id: '06', title: "What Comes First", text: "The work absorbed all of it, and one discipline settled above the rest: the brand comes first, before the founder's instinct, even before mine. The same goes for how I measure the years: I'd rather grow by helping the people around me grow, and take them with me.", isHigh: false, img: '/images/aboutpage/story/images/story_studio_today_1790943867597.jpg' },
    { id: '07', title: "The Short List", text: "I'm still figuring most of it out, and that's never felt like a problem. I just want fewer things now, made carefully, with the people I'd keep for the long version of all of it.", isHigh: true, img: '/images/aboutpage/story/images/story_recent_desk_1790943882408.jpg' },
];

const coreValues = [
    "Ambition with Integrity",
    "Fairness & Equity",
    "Create Value",
    "Discipline & Consistency",
    "Generosity without Calculation",
    "Respect & Admiration",
    "Inspire through Action",
    "Make Memories",
];

export default function StorySlider() {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const stripRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const matchMedia = window.matchMedia('(max-width: 768px) or (prefers-reduced-motion: reduce)');
            setIsMobile(matchMedia.matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useGSAP(() => {
        if (isMobile) return;

        const totalScroll = stripRef.current.scrollWidth - window.innerWidth;

        // Instead of pin: true, we rely on the sticky wrapper and a 700vh tall container.
        // The ScrollTrigger maps the scroll over the container's height to the horizontal movement.
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                // No pinning, snapping, or opacity fading.
                onUpdate: (self) => {
                    const stripItems = gsap.utils.toArray('.chapter-item');
                    let closestIndex = 0;
                    let minDistance = Infinity;

                    const screenCenter = window.innerWidth / 2;

                    stripItems.forEach((item, i) => {
                        const rect = item.getBoundingClientRect();
                        const itemCenter = rect.left + rect.width / 2;
                        const dist = Math.abs(itemCenter - screenCenter);

                        if (dist < minDistance) {
                            minDistance = dist;
                            closestIndex = i;
                        }
                    });

                    if (self.progress > 0.98) {
                        closestIndex = CHAPTERS.length - 1;
                    }

                    if (closestIndex !== activeIndex) {
                        setActiveIndex(closestIndex);
                    }
                    setScrollProgress(self.progress);
                }
            }
        });

        tl.to(stripRef.current, {
            x: -totalScroll,
            ease: "none"
        });

    }, { scope: containerRef, dependencies: [isMobile] });

    // Mobile layout
    if (isMobile) {
        return (
            <div className="w-full  pt-24 pb-32">
                <div className="sticky top-0 w-full  z-50 py-4 border-b border-black/10 px-6">
                    <div className="flex items-center justify-between">
                        {CHAPTERS.map((ch, i) => (
                            <span key={ch.id} className="text-xs">
                                {ch.isManifesto ? 'M' : ch.id}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col space-y-24 px-6 mt-12">
                    {CHAPTERS.map((ch, i) => (
                        <div key={ch.id} className="w-full flex flex-col">
                            {ch.isManifesto ? (
                                <div className="w-full flex flex-col pt-12 pb-12 px-6 border border-dashed border-white/20 rounded-2xl text-center">
                                    <h2 className="text-3xl md:text-5xl font-medium mb-8 leading-tight">
                                        Dream Boldly, Act Fearlessly &<br />Live with Purpose.
                                    </h2>
                                    <div className="flex flex-wrap justify-center gap-2.5">
                                        {coreValues.map((value, idx) => {
                                            const isOrange = [1, 3, 5, 7].includes(idx);
                                            return (
                                                <span
                                                    key={idx}
                                                    className={`px-4 py-2 rounded-full text-xs font-medium border ${isOrange ? 'bg-[#954729] border-[#954729] text-white' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/20'}`}
                                                >
                                                    {value}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-4xl mb-4">{ch.id}</div>
                                    {!ch.noImage && ch.img && (
                                        <div className="w-full aspect-[4/3] relative rounded-sm mb-6 overflow-hidden">
                                            <Image src={ch.img} alt={ch.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="text-lg opacity-80">{ch.text}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Desktop layout
    const activeChapter = CHAPTERS[activeIndex];
    const isPrussian = activeChapter?.isManifesto;

    const handleNavClick = (index) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const startScroll = rect.top + window.scrollY;
        const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
        const targetScroll = startScroll + (index / (CHAPTERS.length - 1)) * scrollableDistance;

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    };

    return (
        <div
            className={`relative w-full ${isPrussian ? 'bg-[#0B1A2C] text-[#e3e2dc]' : 'bg-[#e3e2dc] text-[#0B1A2C]'} transition-colors duration-500 h-[600vh]`}
            ref={containerRef}
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center" ref={stickyRef}>

                {/* Bottom Nav Line */}
                <div className="absolute bottom-12 padding w-full z-50">
                    <div className="relative w-full flex items-center justify-between">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current opacity-20 -translate-y-1/2" />
                        <div
                            className="absolute top-1/2 left-0 h-[1px] bg-[#954729] -translate-y-1/2"
                            style={{ width: `${scrollProgress * 100}%` }}
                        />

                        {CHAPTERS.map((ch, i) => (
                            <div
                                key={ch.id}
                                className={`relative z-10 px-2 transition-colors duration-500 cursor-pointer flex items-center justify-center ${isPrussian ? 'bg-[#0B1A2C]' : 'bg-[#e3e2dc]'}`}
                                onClick={() => handleNavClick(i)}
                            >
                                {ch.isManifesto ? (
                                    <div className={`w-2.5 h-2.5 rounded-full mx-1 transition-colors duration-300 ${i <= activeIndex ? 'bg-[#954729]' : 'bg-current opacity-20'}`} />
                                ) : (
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${i <= activeIndex ? 'bg-[#954729] text-white' : 'text-current opacity-40 hover:opacity-100'}`}>
                                        <span className="text-xs  leading-none">
                                            {ch.id}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strip */}
                <div className="flex  h-full items-center " ref={stripRef}>
                    <div className="padding flex items-start h-full pt-12 md:pt-24">
                        <h2 data-para-effect className={`leading-none w-[35vw]  transition-colors duration-500 ${isPrussian ? 'text-white' : 'text-[#0B1A2C]'}`}>
                            The Story of My<br />Life Journey
                        </h2>
                    </div>
                    {CHAPTERS.map((ch, i) => {
                        if (ch.isManifesto) {
                            return (
                                <div key={ch.id} className="chapter-item w-[80vw] md:w-[60vw] shrink-0 flex items-center justify-center px-10 md:px-20 relative">
                                    <div className="max-w-4xl w-full border border-dashed border-white/20 p-10 md:p-16 rounded-lg text-center">
                                        <h2 className="leading-tight mb-10">
                                            Dream Boldly, Act Fearlessly &<br />Live with Purpose.
                                        </h2>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {coreValues.map((value, idx) => {
                                                const isOrange = [1, 3, 5, 7].includes(idx);
                                                return (
                                                    <span
                                                        key={idx}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium border ${isOrange ? 'bg-[#954729] border-[#954729] text-white' : 'bg-white/10 border-white/20 text-white'}`}
                                                    >
                                                        {value}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div key={ch.id} className="chapter-item w-[60vw] md:w-[35vw] shrink-0 flex flex-col justify-center px-10 h-full py-32">
                                <div className={`flex flex-col space-y-3 h-[70vh] ${ch.isHigh ? 'justify-start' : 'justify-end'}`}>

                                    {ch.isHigh ? (
                                        <>
                                            <div className="text-5xl font-semibold">
                                                <span>{ch.id}</span>
                                            </div>
                                            {!ch.noImage && ch.img && (
                                                <div className="w-full aspect-[4/3] rounded-lg relative  overflow-hidden">
                                                    <Image src={ch.img} alt={ch.title} fill className="object-cover" />
                                                </div>
                                            )}
                                            <p className=" leading-tight ">{ch.text}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-5xl font-semibold">
                                                <span>{ch.id}</span>
                                            </div>
                                            {!ch.noImage && ch.img && (
                                                <div className="w-full aspect-[4/3] rounded-lg relative  overflow-hidden">
                                                    <Image src={ch.img} alt={ch.title} fill className="object-cover" />
                                                </div>
                                            )}
                                            <p className="leading-tight">{ch.text}</p>
                                        </>
                                    )}

                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
}