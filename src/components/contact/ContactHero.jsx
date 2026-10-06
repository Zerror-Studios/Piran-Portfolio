"use client";
import React, { useEffect, useRef, useState } from 'react';
import { RiMailLine, RiPhoneLine, RiLinkedinFill, RiInstagramLine, RiInstagramFill, RiArrowRightUpLine, RiArrowDownSLine } from '@remixicon/react';
import Link from 'next/link';
import SuccessPopup from './SuccessPopup';
import CustomButton from '../common/CustomButton';
import AsciiImageBackground from '../common/AsciiImageBackground';
import HandParticlesCanvas from './HandParticlesCanvas';
import ContactNextBackground from './ContactNextBackground';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactHero = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        email: '',
        message: '',
        about: ''
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const locationRef = useRef(null);
    const emailRef = useRef(null);
    const messageRef = useRef(null);
    const aboutRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.location.trim()) newErrors.location = true;
        if (!formData.email.trim()) {
            newErrors.email = 'empty';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'invalid';
        }
        if (!formData.about) newErrors.about = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStatus('submitting');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const nextSectionRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.from(".hero-anim-fade-up", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
        });
    }, { scope: sectionRef });

    useGSAP(() => {
        // "What happens next" animation
        if (!nextSectionRef.current) return;

        const isMobileView = window.innerWidth < 768;

        gsap.set('.hairline-anim', {
            scaleX: isMobileView ? 1 : 0,
            scaleY: isMobileView ? 0 : 1
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: nextSectionRef.current,
                start: "top 70%",
                end: "top 30%",
                scrub: true,
            }
        });

        // Draw the hairline 
        tl.to('.hairline-anim', {
            scaleX: 1,
            scaleY: 1,
            duration: 1,
            ease: "none"
        }, 0);

        const dots = gsap.utils.toArray('.step-dot');
        const texts = gsap.utils.toArray('.step-text');

        gsap.set(texts, { opacity: 0, y: 30 });

        dots.forEach((dot, i) => {
            const pos = i * 0.5; // 0, 0.5, 1.0
            tl.to(dot, { borderColor: '#ffffff', backgroundColor: '#ffffff', duration: 0.1 }, pos);
            tl.to(texts[i], { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, pos);
        });
    }, { scope: nextSectionRef });

    return (
        <>
            <section ref={sectionRef} className="w-full contact_hero pt-44 bg-[#0B1A2C] z-0">
                <div ref={contentRef} className="container flex flex-col justify-end pb-12 md:pb-24 z-99">
                    <div className="flex max-sm:pt-[30vh] flex-col md:flex-row justify-between md:items-end gap-8 border-b border-dashed border-[#ffffff30] pb-5">
                        <h1 className="hero-anim-fade-up leading-none text-[#ffffff] tracking-tight m-0 p-0">
                            Let's Talk
                        </h1>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 pt-8 md:pt-16">
                        <div className="hero-anim-fade-up flex flex-col col-span-2 justify-between h-full max-sm:space-y-4">
                            <div className="space-y-8">
                                <p className="hero-anim-fade-up text-[#ffffff] opacity-70 text-lg max-w-sm">
                                    Whatever brings you here, I read everything myself, and you'll hear back within two days.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link target="_blank" href="https://in.linkedin.com/in/iampirantee" aria-label="LinkedIn Profile" className="w-10 h-10 rounded-full border border-dashed border-[#ffffff30] flex items-center hover:bg-[#ffffff] hover:text-[#0B1A2C] transition-all duration-300 justify-center text-[#ffffff]">
                                    <RiLinkedinFill className="size-4 " />
                                </Link>
                                <Link target="_blank" href="https://www.instagram.com/iampirantee/" aria-label="Instagram Profile" className="w-10 h-10 rounded-full border border-dashed border-[#ffffff30] flex items-center hover:bg-[#ffffff] hover:text-[#0B1A2C] transition-all duration-300 justify-center text-[#ffffff]">
                                    <RiInstagramFill className="size-4 " />
                                </Link>
                            </div>
                        </div>
                        <div className="hero-anim-fade-up col-span-3  max-sm:mt-20 rounded-xl">
                            <form onSubmit={handleSubmit} className="text-2xl text-[#ffffff]">
                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6">
                                    <span className="whitespace-nowrap">My name is</span>
                                    <div className="relative flex-1 min-w-50">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors({ ...errors, name: false });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    locationRef.current?.focus();
                                                }
                                            }}
                                            placeholder="( your name )*"
                                            className={`w-full border-b ${errors.name ? 'border-white text-white' : 'border-[#ffffff15] focus:border-[#ffffff]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                        />
                                        {errors.name && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}
                                    </div>
                                    <span className="whitespace-nowrap">from</span>
                                    <div className="relative flex-1 min-w-62.5">
                                        <input
                                            type="text"
                                            ref={locationRef}
                                            value={formData.location}
                                            onChange={(e) => {
                                                setFormData({ ...formData, location: e.target.value });
                                                if (errors.location) setErrors({ ...errors, location: false });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    emailRef.current?.focus();
                                                }
                                            }}
                                            placeholder="( your company or city )*"
                                            className={`w-full border-b ${errors.location ? 'border-white text-white' : 'border-[#ffffff15] focus:border-[#ffffff]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                        />
                                        {errors.location && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                    <span className="whitespace-nowrap">You can reach me at</span>
                                    <div className="relative flex-1 min-w-62.5">
                                        <input
                                            type="email"
                                            autoComplete='on'
                                            ref={emailRef}
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (errors.email) setErrors({ ...errors, email: false });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    messageRef.current?.focus();
                                                }
                                            }}
                                            placeholder="( your@email.com )*"
                                            className={`w-full border-b ${errors.email ? 'border-white text-white' : 'border-[#ffffff15] focus:border-[#ffffff]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                        />
                                        {errors.email === 'empty' && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}
                                        {errors.email === 'invalid' && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">That address doesn't look reachable.</span>}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                    <span className="whitespace-nowrap">In short, I'm here to</span>
                                    <div className="relative flex-1 min-w-75">
                                        <input
                                            type="text"
                                            ref={messageRef}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    aboutRef.current?.focus();
                                                }
                                            }}
                                            placeholder="( start the right conversation )"
                                            className="w-full border-b border-[#ffffff15] bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 focus:border-[#ffffff] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                    <span className="whitespace-nowrap">This is about:</span>
                                    <div ref={dropdownRef} className="relative flex-1 min-w-50">
                                        <button
                                            type="button"
                                            ref={aboutRef}
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`w-full border-b ${errors.about ? 'border-white text-white' : 'border-[#ffffff15] hover:border-[#ffffff]'} bg-transparent outline-none  text-center transition-colors cursor-pointer flex justify-center items-center py-1 relative`}
                                        >
                                            <span className={!formData.about ? 'opacity-20 text-base' : ''}>
                                                {formData.about || "( choose one )*"}
                                            </span>
                                            <RiArrowDownSLine className={`size-5 absolute right-2 top-1/2 -translate-y-1/2 ${isDropdownOpen ? "rotate-180" : "rotate-0"} transition-all duration-300`} />
                                        </button>
                                        {errors.about && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#ffffff15] rounded-xl shadow-lg z-20 overflow-hidden flex flex-col text-lg md:text-xl">
                                                {['Strategic Equity', 'Press', 'Meet & Greet'].map(option => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, about: option });
                                                            if (errors.about) setErrors({ ...errors, about: false });
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-3 text-center text-[#0B1A2C] hover:bg-[#0B1A2C] border-t border-[#0B1A2C50]  hover:text-white transition-colors ${formData.about === option ? 'bg-[#0B1A2C] text-white' : ''}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="mt-8 text-white text-sm">
                                        Submit failure: Something broke on my side, not yours. Try once more.
                                    </div>
                                )}
                                <div className="w-full flex justify-between items-end">

                                    <CustomButton disabled={status === 'submitting'} type="submit" theme="light" className="mt-10">
                                        {status === 'submitting' ? 'SENDING...' : "Let's figure it out"}
                                    </CustomButton>
                                    <div className="">
                                        <div className='text-sm'><span className='opacity-60'>Brand or design project? That starts at</span> <a target='_blank' className='underline hover:opacity-100 transition opacity-60 ' href="https://wearepointof.com">Point Of.</a> </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <SuccessPopup
                    isOpen={status === 'success'}
                    onClose={() => {
                        setStatus('idle');
                        setFormData({ name: '', location: '', email: '', message: '', about: '' });
                    }}
                />

            </section>

            {/* What Happens Next Section */}
            <section className="w-full bg-[#0B1A2C] text-[#ffffff] aspect-22/9  relative z-10 border-t border-[#ffffff15] border-dashed  flex flex-col justify-center overflow-hidden" >
            <ContactNextBackground/>
                <div ref={nextSectionRef} className="container h-fit! pointer-events-none mx-auto px-6 relative z-10">
                    <h2 data-para-effect className="text-3xl md:text-5xl font-medium mb-16 md:mb-24 text-center opacity-90 tracking-tight">What happens next</h2>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Animated Hairline */}
                        <div className="absolute left-[11px] md:left-[16.66%] top-[11px] w-[2px] md:w-[66.66%] h-[calc(100%-24px)] md:h-[2px] bg-[#ffffff15] z-0">
                            <div className="hairline-anim absolute top-0 left-0 w-full h-full bg-[#ffffff] z-10 transform origin-top-left" />
                        </div>

                        {/* The Steps */}
                        <div className="flex flex-col capitalize md:flex-row justify-between relative z-10 space-y-16 md:space-y-0">
                            <div className="flex md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/3 group">
                                <div className="w-6 h-6 rounded-full bg-[#0B1A2C] border-2 border-[#ffffff15] flex-shrink-0 flex items-center justify-center step-dot transition-colors">
                                    <div className="w-1/2 h-1/2 rounded-full bg-[#0B1A2C]"></div>
                                </div>
                                <p className="ml-6 md:ml-0 md:mt-8 text-xl md:text-2xl font-medium step-text leading-tight">A reply within two days</p>
                            </div>
                            <div className="flex md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/3 group">
                                <div className="w-6 h-6 rounded-full bg-[#0B1A2C] border-2 border-[#ffffff15] flex-shrink-0 flex items-center justify-center step-dot transition-colors">
                                    <div className="w-1/2 h-1/2 rounded-full bg-[#0B1A2C]"></div>
                                </div>
                                <p className="ml-6 md:ml-0 md:mt-8 text-xl md:text-2xl font-medium step-text leading-tight">An introductory call</p>
                            </div>
                            <div className="flex md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/3 group">
                                <div className="w-6 h-6 rounded-full bg-[#0B1A2C] border-2 border-[#ffffff15] flex-shrink-0 flex items-center justify-center step-dot transition-colors">
                                    <div className="w-1/2 h-1/2 rounded-full bg-[#0B1A2C]"></div>
                                </div>
                                <p className="ml-6 md:ml-0 md:mt-8 text-xl md:text-2xl font-medium step-text leading-tight">A questionnaire</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactHero;
