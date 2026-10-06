"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const portfolioData = [
    {
        id: 'point-of',
        name: 'POINT OF',
        noteTitle: <>Founder, <br /> 2019</>,
        line: 'I started it and built it into the consultancy it is today.',
        linkText: 'Visit Point Of',
        linkHref: 'https://wearepointof.com',
        linkExternal: true
    },
    {
        id: 'naturefit',
        name: 'NATUREFIT',
        noteTitle: <>Strategic Equity <br /> Partner, 2025</>,
        line: "Once the Poonawalla Group came on board, I helped build the business plan and the brand strategy that set Naturefit's direction.",
        linkText: 'Read the case',
        linkHref: '/work/naturefit',
        linkExternal: false
    },
    {
        id: 'lvl',
        name: 'LVL',
        noteTitle: <>Strategic Equity <br />Partner, 2026</>,
        line: 'I connect LVL with the CAs, accounting partners and peers that help it scale faster, and advise on go-to-market, design and technology.',
        linkText: null,
        linkHref: null
    },
    {
        id: 'samara-capital',
        name: 'SAMARA CAPITAL',
        noteTitle: <>Limited Partner,<br /> 2026</>,
        line: 'An India-focused investment firm that has deployed over 1.5 billion dollars since 2007, backing businesses like Marengo Asia Hospitals and Edme Insurance.',
        linkText: null,
        linkHref: null
    },
    // {
    //     id: 'stealth-startup',
    //     name: 'STEALTH STARTUP',
    //     noteTitle: <>Founder, <br />2026</>,
    //     line: "Can AI help us keep the people we meet? I'm finding out. The name arrives only when it's ready.",
    //     linkText: null,
    //     linkHref: null
    // }
];

const Portfolio = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const [activeItem, setActiveItem] = useState(portfolioData[0]);

    useEffect(() => {
        let timeout;
        if (hoveredId && hoveredId !== 'stealth-startup') {
            const item = portfolioData.find(d => d.id === hoveredId);
            if (item) setActiveItem(item);
        } else {
            timeout = setTimeout(() => {
                setActiveItem(portfolioData[0]);
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [hoveredId]);

    return (
        <section className="bg-[#e3e2dc] text-[#0b1a2c] py-12 md:py-24 space-y-8 md:space-y-16 container relative">
            <div className="w-full center ">
                <h2 data-para-effect className="">The Portfolio</h2>
            </div>

            <div className=" relative grid grid-cols-3">
                <div className="col-span-2  ">
                    <div className="flex flex-wrap gap-y-3 ">
                        {portfolioData.map((item, index) => {
                            const isHovered = hoveredId === item.id;
                            const isOtherHovered = hoveredId && hoveredId !== item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center transition-opacity duration-600 cursor-pointer ${isOtherHovered ? 'opacity-30' : 'opacity-100'} ${item.id === 'stealth-startup' ? 'w-full justify-center ' : ''}`}
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onFocus={() => setHoveredId(item.id)}
                                    onBlur={() => setHoveredId(null)}
                                    tabIndex={0}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center">
                                            <h2 className={` uppercase  leading-none grotesk whitespace-nowrap`}>{item.name}</h2>
                                            {item.id === 'naturefit' && (
                                                <div className={`absolute bottom-0 rounded-full left-0 h-0.5 bg-[#0b1a2c] transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'}`} />
                                            )}
                                        </div>

                                        <span className="w-32 text-xs">
                                            {item.noteTitle}
                                        </span>


                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-x-4 mt-4 stealth-startup-trigger">
                        <img className='w-50 stealth-startup-img' src="/images/homepage/partners/full_img_4.JPG" alt="" />
                        <div className="flex flex-col justify-between">
                            <div className="">

                                <div className="flex">
                                    <h2 className={` uppercase  leading-none grotesk whitespace-nowrap`}>STEALTH STARTUP </h2>
                                    <div className="ml-1 size-1.5 bg-[#883F27] rounded-full pulsing-chestnut shrink-0" />
                                </div>
                                <span className="w-32 ">
                                    <>Founder, 2026</>
                                </span>
                            </div>

                            <p className='w-72 text-lg leading-tight'>
                                Can AI help us keep the people we meet? I'm finding out. The name arrives only when it's ready.
                            </p>

                        </div>
                    </div>
                </div>

                {/* Dynamic Line Area */}
                <div key={activeItem.id} className=" fade-in col-span-1 text-center flex flex-col items-center justify-center transition-all duration-700">
                    <p className=" text-2xl">{activeItem.line}</p>
                    {activeItem.linkText && (
                        activeItem.linkExternal ? (
                            <a href={activeItem.linkHref} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm uppercase font-bold underline underline-offset-4 hover:opacity-60 transition-opacity">
                                {activeItem.linkText}
                            </a>
                        ) : (
                            <Link href={activeItem.linkHref} className="mt-4 text-sm uppercase font-bold underline underline-offset-4 hover:opacity-60 transition-opacity">
                                {activeItem.linkText}
                            </Link>
                        )
                    )}
                </div>
            </div>

        </section>
    );
};

export default Portfolio;