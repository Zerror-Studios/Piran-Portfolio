'use client';
import React, { useState, useRef, useEffect } from 'react'
import { navLinks } from './Header'
import { Link } from 'next-view-transitions'
import Magnet from './Magnet'
import { usePathname } from 'next/navigation'
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react'
import ViewTransitionLink from '@/hooks/ViewTransitionLink';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(Flip,ScrollTrigger);

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const hasActiveLink = navLinks.some(link => link.href === pathname);
    const container = useRef(null);
    const tl = useRef(null);
    const layoutState = useRef();
    const isScrolledRef = useRef(false);

    useGSAP(() => {
        ScrollTrigger.create({
            start: 100,
            onEnter: () => {
                if (!isScrolledRef.current) {
                    isScrolledRef.current = true;
                    if (hasActiveLink) layoutState.current = Flip.getState('.nav-dot.active-dot');
                    setIsScrolled(true);
                }
            },
            onLeaveBack: () => {
                if (isScrolledRef.current) {
                    isScrolledRef.current = false;
                    if (hasActiveLink) layoutState.current = Flip.getState('.nav-dot.active-dot');
                    setIsScrolled(false);
                }
            }
        });
    }, []);

    useGSAP(() => {
        if (layoutState.current && hasActiveLink) {
            const flipAnim = Flip.from(layoutState.current, {
                duration: 0.6,
                ease: "power3.inOut",
                absolute: true,
                targets: '.nav-dot.active-dot',
            });
            
            const animTl = gsap.timeline({
                onComplete: () => {
                    layoutState.current = null;
                }
            });
            
            animTl.add(flipAnim);
            
            if (isScrolled) {
                animTl.to('.nav-links-container', { 
                    opacity: 0, 
                    pointerEvents: 'none', 
                    duration: 0.3 
                }, "-=0.3");
            } else {
                gsap.to('.nav-links-container', { 
                    opacity: 1, 
                    pointerEvents: 'auto', 
                    duration: 0.3 
                });
            }
        } else if (!hasActiveLink) {
            if (isScrolled) {
                gsap.to('.nav-links-container', { 
                    opacity: 0, 
                    pointerEvents: 'none', 
                    duration: 0.3 
                });
            } else {
                gsap.to('.nav-links-container', { 
                    opacity: 1, 
                    pointerEvents: 'auto', 
                    duration: 0.3 
                });
            }
        }
    }, [isScrolled, hasActiveLink]);

    useGSAP(() => {
        gsap.set('.menu-drawer', { xPercent: 150 });
        gsap.set('.nav-link-item', { x: '15vw', rotation: 0.001 });

        tl.current = gsap.timeline({ paused: true })
            .to('.menu-drawer', {
                xPercent: 0,
                duration: 0.7,
                ease: "power4.inOut"
            }, 0)
            .to('.rounded-div-wrap', {
                width: '0vw',
                duration: 0.85,
                ease: "power4.inOut"
            }, 0)
            .to('.nav-link-item', {
                x: '0vw',
                rotation: 0.001,
                duration: 0.8,
                ease: "power4.inOut",
                stagger: 0.03
            }, 0.1);
    }, { scope: container });

    useEffect(() => {
        if (isMenuOpen) {
            if (tl.current) tl.current.play();
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            if (tl.current) tl.current.reverse();
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }
        
        return () => {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        };
    }, [isMenuOpen]);

    useGSAP(() => {
        let animDelay = 1
        if (pathname === "/") animDelay = 4.5
        if (pathname === "/about") animDelay = 1.5
        gsap.fromTo(".navbar",
            { yPercent: -150, opacity: 0 },
            {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: animDelay,
            }
        );
        gsap.to([".menu_toogle_btn",".menu-drawer"],
            {
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: animDelay,
            }
        );
    }, [pathname])

    return (
        <div ref={container}>
            <div className=" navbar opacity-0 flex padding fixed z-100000 w-full top-5 items-center justify-between">
                <div className="">
                    <svg width="51" height="44" viewBox="0 0 51 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50.7143 21.7422H41.4776V0.278763C41.4776 0.135165 41.3645 0.0184884 41.2242 0.00951348C41.0839 0.000538573 40.9572 0.103745 40.9391 0.242856C40.577 3.14175 39.3008 8.74658 34.8024 13.7277C33.8927 14.7373 32.9378 15.6079 31.9693 16.3842V0.274271C31.9693 0.130673 31.8562 0.0139965 31.7159 0.00502164C31.5711 -0.00395326 31.4489 0.0992669 31.4308 0.238378C31.0687 3.13727 29.7925 8.74209 25.2941 13.7232C24.3844 14.7328 23.4295 15.6034 22.4611 16.3797V0.269793C22.4611 0.126195 22.3479 0.00951841 22.2076 0.000543503C22.0673 -0.0084314 21.9406 0.0947751 21.9225 0.233886C21.5605 3.13278 20.2843 8.73761 15.7858 13.7187C10.2012 19.9069 3.05079 21.3832 0.235874 21.7333C0.0955806 21.7512 -0.00850306 21.8769 0.000548122 22.016C0.00959931 22.1596 0.127267 22.2673 0.272086 22.2673H9.51334V43.7308C9.51334 43.8743 9.62648 43.991 9.76677 44C9.7713 44 9.77583 44 9.78488 44C9.92064 44 10.0383 43.9013 10.0564 43.7622C10.4094 40.8678 11.6766 35.2719 16.1886 30.2774C17.1028 29.2677 18.0577 28.3926 19.0261 27.6208V43.7308C19.0261 43.8743 19.1393 43.991 19.2796 44C19.2841 44 19.2886 44 19.2977 44C19.4334 44 19.5511 43.9013 19.5692 43.7622C19.9222 40.8678 21.1894 35.2719 25.7014 30.2774C26.6156 29.2677 27.5705 28.3926 28.5389 27.6208V43.7308C28.5389 43.8743 28.6521 43.991 28.7924 44C28.7969 44 28.8014 44 28.8105 44C28.9462 44 29.0639 43.9013 29.082 43.7622C29.435 40.8678 30.7022 35.2719 35.2142 30.2774C40.8078 24.0892 47.9537 22.6128 50.7641 22.2628C50.9044 22.2448 51.0085 22.1192 50.9995 21.9801C50.9904 21.8365 50.8727 21.7288 50.7279 21.7288L50.7143 21.7422Z" fill={pathname === '/thesis' ? '#0b1a2c' : 'white'}/>
                    </svg>
                </div>
                {/* Desktop top links */}
                <div className={`nav-links-container hidden md:flex items-center gap-x-10 uppercase text-sm ${pathname === '/thesis' ? 'text-[#0b1a2c]' : 'text-white'}`}>
                    {navLinks.map((item, i) => {
                        const isActive = pathname === item.href;
                        return (
                            <Magnet key={i} innerClassName='group'>
                                <Link href={item.href} className=" cursor-pointer font-semibold relative center">
                                    {item.label}
                                    {!isScrolled && (
                                        <div data-flip-id={isActive ? "active-dot" : undefined} className={`size-1.5 transition-colors duration-300 rounded-full absolute -bottom-3 ${pathname === '/thesis' ? 'bg-[#0b1a2c]' : 'bg-white'} ${isActive ? 'nav-dot active-dot scale-100' : 'scale-0 group-hover:scale-100'}`}></div>
                                    )}
                                </Link>
                            </Magnet>
                        );
                    })}
                </div>
            </div>

            {/* Menu Toggle Button */}
            <div className={`fixed top-5 z-[1000000001] right-0 padding origin-center ${isScrolled ? 'pointer-events-auto' : 'pointer-events-none'} ${!hasActiveLink ? (isScrolled ? 'scale-100 transition-transform duration-500' : 'scale-0 transition-transform duration-500') : ''}`}>
                <div className="menu_toogle_btn opacity-0">
                    <Magnet padding={20}>
                        <div
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`menu relative size-14 center flex-col cursor-pointer transition-transform duration-500 rounded-full ${!hasActiveLink ? 'bg-white border border-black/20' : ''} ${isMenuOpen ? 'hover:scale-110' : ' hover:scale-110'}`}
                        >
                            {isScrolled && hasActiveLink && (
                                <div 
                                    data-flip-id="active-dot" 
                                    className="nav-dot active-dot absolute inset-0 rounded-full bg-white border border-black/20"
                                ></div>
                            )}
                            <div className={`relative w-6 h-3 transition-opacity duration-500 z-10 ${isScrolled ? 'opacity-100' : (hasActiveLink ? 'opacity-0' : 'opacity-100')}`}>
                                <div className={`w-full h-px transition-all duration-500 absolute origin-center bg-[#0b1a2c] left-0 top-1/2 ${isMenuOpen ? '-translate-y-1/2 rotate-45' : '-translate-y-[6px]'}`}></div>
                                <div className={`w-full h-px transition-all duration-500 absolute origin-center bg-[#0b1a2c] left-0 top-1/2 ${isMenuOpen ? '-translate-y-1/2 -rotate-45' : 'translate-y-[5px]'}`}></div>
                            </div>
                        </div>
                    </Magnet>
                </div>
            </div>

            {/* Overlay */}
            <div
                onClick={() => setIsMenuOpen(false)}
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            ></div>

            {/* Menu Drawer */}
            <div className="menu-drawer opacity-0 fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#0b1a2c] text-white z-[10000] will-change-transform">

                {/* Rounded Curve */}
                <div className="absolute left-[1px] top-0 h-full -translate-x-full pointer-events-none">
                    <div className="rounded-div-wrap relative h-full w-[20vw] md:w-[6vw] will-change-[width]">
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-[6.5%] w-[775%] h-[150%] rounded-[50%] bg-[#0b1a2c] block"></div>
                    </div>
                </div>

                <div className="flex flex-col justify-center h-full px-12 md:px-24 relative">
                    <p className="text-sm border-dashed mb-10 border-b pb-2 border-white/50 uppercase">Navigation</p>

                    <div className="flex flex-col gap-y-4">
                        {navLinks.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <Magnet key={i} padding={20} wrapperClassName="w-fit" innerClassName="group relative">
                                    <div className="nav-link-item will-change-transform">
                                        <ViewTransitionLink
                                        delay={1000}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-6xl hover:translate-x-4 transition-transform duration-300 inline-block py-2"
                                        >
                                            <div className={`absolute -left-6 top-1/2 -translate-y-1/2 size-3 rounded-full bg-white transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'}`}></div>
                                            {item.label}
                                        </ViewTransitionLink>
                                    </div>
                                </Magnet>
                            );
                        })}
                    </div>

                    <div className="absolute bottom-12 left-12 md:left-24 right-12 md:right-24">
                        <p className="text-sm border-dashed mb-5 border-b pb-2 border-white/50 uppercase">Socials</p>
                        <div className="flex gap-x-10 text-sm ">
                            <a target="_blank" href="https://www.instagram.com/iampirantee/" className="relative flex items-center  group"> <div className="size-2 absolute -left-3 scale-0 group-hover:scale-100 transition-all duration-300 bg-white rounded-full"></div>
                                Instagram
                            </a>
                            <a target="_blank" href="https://in.linkedin.com/in/iampirantee" className="relative flex items-center  group "> <div className="size-2 absolute -left-3 scale-0 group-hover:scale-100 transition-all duration-300 bg-white rounded-full"></div>
                                Linkedin
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar