'use client';
import React, { useState, useRef, useEffect } from 'react'
import { navLinks } from './Header'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'

const SCROLL_THRESHOLD = 100; // px scrolled before the links fold into the menu button
const CLOSE_AFTER_SCROLL = 60; // px of scrolling that folds an opened menu back up

const Navbar = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const openedAt = useRef(0);
    const container = useRef(null);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > SCROLL_THRESHOLD);
            setIsOpen((open) => open && Math.abs(y - openedAt.current) < CLOSE_AFTER_SCROLL);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useGSAP(() => {
        let animDelay = 1
        if (pathname === "/") animDelay = 4.5
        if (pathname === "/about") animDelay = 1.5
        gsap.fromTo(container.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: animDelay }
        );
    }, [pathname])

    const toggleMenu = () => {
        openedAt.current = window.scrollY;
        setIsOpen((open) => !open);
    };

    const showLinks = !isScrolled || isOpen;

    return (
        <div className="header_wrapper fixed z-[100000] bottom-5  w-full center">
            <nav
                ref={container}
                aria-label="Main"
                className="navbar opacity-0 pointer-events-auto"
            >
                <div className={`flex items-center bg-white text-[#0B1A2C] rounded-2xl pl-3 pr-2 h-14 shadow-[0_0.5rem_2rem_rgba(11,26,44,0.12)] ${showLinks ? "pr-4" : ""} `}>

                    {/* Logo */}
                    <Link href="/" aria-label="Piran Tarapore Home" className="shrink-0">
                        <svg className="w-9 md:w-10 h-auto" viewBox="0 0 51 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50.7143 21.7422H41.4776V0.278763C41.4776 0.135165 41.3645 0.0184884 41.2242 0.00951348C41.0839 0.000538573 40.9572 0.103745 40.9391 0.242856C40.577 3.14175 39.3008 8.74658 34.8024 13.7277C33.8927 14.7373 32.9378 15.6079 31.9693 16.3842V0.274271C31.9693 0.130673 31.8562 0.0139965 31.7159 0.00502164C31.5711 -0.00395326 31.4489 0.0992669 31.4308 0.238378C31.0687 3.13727 29.7925 8.74209 25.2941 13.7232C24.3844 14.7328 23.4295 15.6034 22.4611 16.3797V0.269793C22.4611 0.126195 22.3479 0.00951841 22.2076 0.000543503C22.0673 -0.0084314 21.9406 0.0947751 21.9225 0.233886C21.5605 3.13278 20.2843 8.73761 15.7858 13.7187C10.2012 19.9069 3.05079 21.3832 0.235874 21.7333C0.0955806 21.7512 -0.00850306 21.8769 0.000548122 22.016C0.00959931 22.1596 0.127267 22.2673 0.272086 22.2673H9.51334V43.7308C9.51334 43.8743 9.62648 43.991 9.76677 44C9.7713 44 9.77583 44 9.78488 44C9.92064 44 10.0383 43.9013 10.0564 43.7622C10.4094 40.8678 11.6766 35.2719 16.1886 30.2774C17.1028 29.2677 18.0577 28.3926 19.0261 27.6208V43.7308C19.0261 43.8743 19.1393 43.991 19.2796 44C19.2841 44 19.2886 44 19.2977 44C19.4334 44 19.5511 43.9013 19.5692 43.7622C19.9222 40.8678 21.1894 35.2719 25.7014 30.2774C26.6156 29.2677 27.5705 28.3926 28.5389 27.6208V43.7308C28.5389 43.8743 28.6521 43.991 28.7924 44C28.7969 44 28.8014 44 28.8105 44C28.9462 44 29.0639 43.9013 29.082 43.7622C29.435 40.8678 30.7022 35.2719 35.2142 30.2774C40.8078 24.0892 47.9537 22.6128 50.7641 22.2628C50.9044 22.2448 51.0085 22.1192 50.9995 21.9801C50.9904 21.8365 50.8727 21.7288 50.7279 21.7288L50.7143 21.7422Z" fill="currentColor" />
                        </svg>
                    </Link>

                    {/* Links - fold away once scrolled, unfold from the menu button */}
                    <div
                        className={`grid pl-12 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${showLinks ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'}`}
                        aria-hidden={!showLinks}
                    >
                        <ul className="flex items-center overflow-hidden min-w-0 gap-x-5">
                            {navLinks.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li
                                        key={item.href}
                                        className={`transition-all duration-300 ${showLinks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                                        style={{ transitionDelay: showLinks ? `${150 + i * 60}ms` : `${(navLinks.length - 1 - i) * 40}ms` }}
                                    >
                                        <Link
                                            href={item.href}
                                            tabIndex={showLinks ? 0 : -1}
                                            onClick={() => setIsOpen(false)}
                                            className="group relative block text-base md:text-lg whitespace-nowrap"
                                        >
                                            {item.label}
                                            <span className={`absolute rounded-full w-full left-0 bottom-1 h-[1.5px] bg-[#0b1a2c] origin-right group-hover:origin-left transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Menu button - appears once scrolled */}
                    <div className={`grid transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${isScrolled ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'}`}>
                        <div className="overflow-hidden min-w-0">
                            <button
                                type="button"
                                onClick={toggleMenu}
                                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isOpen}
                                tabIndex={isScrolled ? 0 : -1}
                                className={`ml-4 md:ml-6 size-11 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-300 hover:bg-[#0B1A2C0d] ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                            >
                                <span className={`block h-px w-7 bg-current transition-transform duration-300 ${isOpen ? 'translate-y-[calc(0.1875rem+0.5px)] rotate-45' : ''}`} />
                                <span className={`block h-px w-7 bg-current transition-transform duration-300 ${isOpen ? '-translate-y-[calc(0.1875rem+0.5px)] -rotate-45' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
