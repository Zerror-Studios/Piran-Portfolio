"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const baseData = [
    {
        id: 'point-of',
        name: 'POINT OF',
        role: 'Founder',
        year: '2019',
        line: 'I started it and built it into the consultancy it is today.',
        linkText: 'Visit Point Of',
        linkHref: 'https://wearepointof.com',
        linkExternal: true
    },
    {
        id: 'naturefit',
        name: 'NATUREFIT',
        role: 'Strategic Equity Partner',
        year: '2025',
        line: "Once the Poonawalla Group came on board, I helped build the business plan and the brand strategy that set Naturefit's direction.",
        linkText: 'Read the case',
        linkHref: '/work/naturefit',
        linkExternal: false
    },
    {
        id: 'lvl',
        name: 'LVL',
        role: 'Strategic Equity Partner',
        year: '2026',
        line: 'I connect LVL with the CAs, accounting partners and peers that help it scale faster, and advise on go-to-market, design and technology.',
        linkText: null,
        linkHref: null
    },
    {
        id: 'samara-capital',
        name: 'SAMARA CAPITAL',
        role: 'Limited Partner',
        year: '2026',
        line: 'An India-focused investment firm that has deployed over 1.5 billion dollars since 2007, backing businesses like Marengo Asia Hospitals and Edme Insurance.',
        linkText: null,
        linkHref: null
    },
    {
        id: 'stealth-startup',
        name: 'STEALTH STARTUP',
        role: 'Founder',
        year: '2026',
        line: "Can AI help us keep the people we meet? I'm finding out. The name arrives only when it's ready.",
        linkText: null,
        linkHref: null,
        pulse: true
    },
];

// Placeholder: content doubled for layout, edit the copies later
const portfolioData = [
    ...baseData,
    ...baseData.map(item => ({ ...item, id: `${item.id}-2` })),
];

const Portfolio = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const [activeItem, setActiveItem] = useState(portfolioData[0]);
    const [detailHovered, setDetailHovered] = useState(false);

    useEffect(() => {
        let timeout;
        if (hoveredId) {
            // Short delay so passing over other names on the way to the paragraph doesn't swap content
            timeout = setTimeout(() => {
                const item = portfolioData.find(d => d.id === hoveredId);
                if (item) setActiveItem(item);
            }, 400);
        } else if (!detailHovered) {
            timeout = setTimeout(() => {
                setActiveItem(portfolioData[0]);
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [hoveredId, detailHovered]);

    return (
        <section className="bg-[#e3e2dc] text-[#0b1a2c] py-12 md:py-24 space-y-8 md:space-y-16 container relative">

            <div className="w-full max-sm:space-y-2 md:grid grid-cols-6">
                <div className=' col-span-4 '>
                    <h3 data-para-effect className="">The Portfolio</h3>
                </div>
                <p className='  leading-tight col-span-2 opacity-70 text-lg'>A curated selection of brands and businesses I've partnered with to build strategy, position, and long-term growth.</p>
            </div>

            {/* Name cloud */}
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 max-w-6xl mx-auto">
                {portfolioData.map((item) => {
                    const isFaded = hoveredId && hoveredId !== item.id;
                    return (
                        <div
                            key={item.id}
                            className={`flex items-start gap-2 cursor-pointer transition-opacity duration-500 ${isFaded ? 'opacity-20' : 'opacity-100'}`}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onFocus={() => setHoveredId(item.id)}
                            onBlur={() => setHoveredId(null)}
                            tabIndex={0}
                        >
                            <h2 className="uppercase leading-none grotesk whitespace-nowrap">
                                {item.name}
                            </h2>
                            {item.pulse && (
                                <div className="size-1.5 bg-[#883F27] rounded-full pulsing-chestnut shrink-0 mt-1" />
                            )}
                            <span className="text-xs italic leading-tight max-w-28 pt-1">
                                {item.role}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Active item detail */}
            <div
                className="stealth-startup-trigger relative grid grid-cols-6 items-start h-50"
                onMouseEnter={() => setDetailHovered(true)}
                onMouseLeave={() => setDetailHovered(false)}
            >
                <div className="col-span-1">
                    <img className='stealth-startup-img w-full aspect-video ' src="/images/homepage/partners/portfolio_image.png" alt="" />
                </div>
                <div key={activeItem.id} className="fade-in col-span-4 flex flex-col items-center text-center gap-6">
                    <span className="text-sm italic">{activeItem.role}: {activeItem.year}</span>
                    <p className="text-2xl max-w-2xl leading-snug">{activeItem.line}</p>
                    {activeItem.linkText && (
                        activeItem.linkExternal ? (
                            <a href={activeItem.linkHref} target="_blank" rel="noopener noreferrer" className="text-sm uppercase font-bold underline underline-offset-4 hover:opacity-60 transition-opacity">
                                {activeItem.linkText}
                            </a>
                        ) : (
                            <Link href={activeItem.linkHref} className="text-sm uppercase font-bold underline underline-offset-4 hover:opacity-60 transition-opacity">
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
