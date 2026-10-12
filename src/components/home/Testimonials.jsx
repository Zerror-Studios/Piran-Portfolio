"use client";
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export const testimonials = [
    {
        id: 1,
        quote: "Before designing anything, Piran did the research: the breadth of Salman\u2019s work, what he\u2019s known for, and what people really feel about him. He walked our team through all of it, and the identity and website carry the weight of the name.",
        name: "Alvira Khan Agnihotri",
        title: "Salman Khan Films",
    },
    {
        id: 2,
        quote: "Piran was in the room for every decision, from how the brand carries itself to success. It wouldn\u2019t have happened without him.",
        name: "Nawaz Singhania",
        title: "Raymond",
    },
    {
        id: 3,
        quote: "We perfected the product. Piran perfected everything the customer meets before it: the idea, the feel, the reason to care.",
        name: "Karam Chawla",
        title: "Limelight Diamonds",
    },
    {
        id: 4,
        quote: "Piran always put himself forward, tackling any task with initiative, charm and sincerity. You can certainly expect that from him in the future.",
        name: "Samir N. Kapadia",
        title: "Hinge",
    },
];

const Testimonials = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.to(".testimonial-card", {
            transform: "translateY(0)",
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });
    }, { scope: containerRef });

    return (
        <>
            <div className="testimonials w-full bg-[#E3E2DC] py-12 md:py-24" ref={containerRef}>
                <div className="container flex flex-col items-center">
                    {/* Grid of Testimonials */}
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-5  md:px-4">
                        {testimonials.map((t) => (
                            <div key={t.id} className="testimonial-card opacity-0 translate-y-[50px] flex border rounded-md border-dashed border-[#0B1A2C] p-10 flex-col text-left">
                                <img className='w-8 invert-100' src="/icons/quote.svg" alt="" />
                                <p className="text-lg mt-3 mb-8">
                                    {t.quote}
                                </p>
                                <div className="mt-auto">
                                    <div className="w-12 h-px bg-[#0B1A2C] rounded-full opacity-20 mb-6"></div>
                                    <h5 className="">{t.name}</h5>
                                    <p className="opacity-70">{t.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonials