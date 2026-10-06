"use client";
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BombayImage = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.to(".bombay-image", {
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions:"play none none reverse"
            }
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef}>
            <div className="w-full container pt-12 md:pt-24 h-fit!  max-sm:space-y-2 md:grid grid-cols-6 items-end">
                <div className=' col-span-4 leading-none  '>
                    <h2 data-para-effect className="">Bombay <br /> Place</h2>
                </div>
                <p className=' leading-tight col-span-2 opacity-70 text-lg'>I work from Bombay, with founders wherever they are." It tells a founder they're writing to a real person in a real city, and that distance is no obstacle.</p>
            </div>
            <div className="w-full grid grid-cols-2 pt-8 md:pt-16 gap-4 container h-fit!">
                <div className="aspect-5/7 flex flex-col justify-between ">
                    <div className="w-full h-[calc(50%-0.5rem)]">
                        <img src="https://images.unsplash.com/photo-1594817060351-8f3de84b7e0e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='cover bombay-image opacity-0' alt="" />
                    </div>
                    <div className="w-full h-[calc(50%-0.5rem)]">
                        <img src="https://images.unsplash.com/photo-1718691139057-ac1b79b6bd72?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='cover bombay-image opacity-0' alt="" />
                    </div>
                </div>
                <div className="aspect-5/7">
                    <img className='cover bombay-image opacity-0' src="https://images.unsplash.com/photo-1630123625375-1fce99d5d0dd?q=80&w=681&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                </div>
            </div>
        </div>
    )
}

export default BombayImage