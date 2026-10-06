"use client";
import React, { useRef, useState, useEffect } from 'react';
import { RiPlayFill, RiCloseLine } from '@remixicon/react';
import { VideoWebGLTransition } from './canvasComponent/VideoWebGLTransition';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { RotatingText } from '../common/RotatingText';
import { LiveTime } from '../common/LiveTime';
import LogoParticlesNew from './LogoParticlesNew';
gsap.registerPlugin(ScrollTrigger, SplitText)

const Hero = () => {
  const videoThumbRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [videoBounds, setVideoBounds] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 750);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (expanded) {
      if (window.lenis) window.lenis.stop();
    } else {
      if (window.lenis) window.lenis.start();
    }
    return () => {
      if (window.lenis) window.lenis.start();
    };
  }, [expanded]);

  const toggleVideo = () => {
    if (isAnimating) return;

    if (!expanded) {
      // Opening
      if (videoThumbRef.current) {
        const bounds = videoThumbRef.current.getBoundingClientRect();
        setVideoBounds(bounds);
        setShowWebGL(true);
        setExpanded(true);
        setIsAnimating(true);

        // Hide header
        const header = document.querySelector('header') || document.querySelector('.fixed.top-0');
        if (header) header.style.display = 'none';
      }
    } else {
      // Closing
      setExpanded(false);
      setIsAnimating(true);

      // Show header
      const header = document.querySelector('header') || document.querySelector('.fixed.top-0');
      if (header) header.style.display = '';
    }
  };

  const handleAnimationComplete = (isExpanded) => {
    setIsAnimating(false);
    if (!isExpanded) {
      setShowWebGL(false);
      setVideoBounds(null);
    }
  };

  useGSAP(() => {
    const paragraph_split = SplitText.create(".paragraph_split", {
      type: "lines",
      linesClass: "split-line",
      aria: "none"
    });

    [...paragraph_split.lines].forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("line-wrapper");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.set([".txt2_head", paragraph_split.lines], { yPercent: 100 });

    const masterTl = gsap.timeline({ delay: 2.5 });

    masterTl.to(".content_box", {
      opacity: 1,
      duration: 0.01
    });

    masterTl.to([".txt2_head", paragraph_split.lines], {
      yPercent: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.05,
    }, "<+0.2");
    masterTl.to([".txt2_head"], {
      transform: "translateX(0)",
      stagger: 0.15,
      duration: 1,
      ease: "power2.inOut"
    });
    masterTl.to([".vid_cont"], {
      opacity: 1,
    }, ">");

  });

  if (isMobile) return null;

  return (
    <div className="   w-full h-screen relative  text-white overflow-hidden">

      <div className=" content_box opacity-0 container pb-5 relative z-10 w-full h-full flex items-end pointer-events-none">
        <div className=" absolute w-full h-full flex items-center pointer-events-auto">
          <h1 className=" w-full leading-18">
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head">
                Will it launch,
              </div>
            </div>
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head">
                or will it last?
              </div>
            </div>
          </h1>
        </div>

        <div className='w-full flex justify-between items-end'>
          <div className=" w-fit space-y-5">
            <p className=" paragraph_split opacity-60 leading-tight">
              The world is starting more companies than it can remember. <br /> Plenty find a first customer, and far fewer live to see a tenth birthday.
            </p>
            <p className=" paragraph_split opacity-60 leading-tight">
              Launching takes a product. Lasting takes everything around it: <br /> the position it holds, the partners it keeps, and the capital that believes in it.
            </p>
          </div>
          <div className=" vid_cont opacity-0  relative w-72 aspect-video">
            <div
              ref={videoThumbRef}
              onClick={!expanded ? toggleVideo : undefined}
              className={`overflow-hidden flex items-center pointer-events-auto justify-center transform-gpu absolute inset-0 w-full h-full rounded-xl  cursor-pointer`}
            >
            </div>

          </div>

        </div>
      </div>

      {/* WebGL Overlay - Always rendered now, acts as the thumbnail itself */}
      <VideoWebGLTransition
        targetRef={videoThumbRef}
        expanded={expanded}
        isAnimating={isAnimating}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Close Button UI (Fades in when expanded) */}
      <div
        className={`fixed inset-0 z-[1000] pointer-events-none transition-opacity duration-500 ${expanded && !isAnimating ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={toggleVideo}
          aria-label="Close video"
          className={`absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-[#0B1A2C] text-white rounded-full flex items-center justify-center z-50 transition-colors backdrop-blur-sm pointer-events-none ${expanded && "pointer-events-auto!"}`}
        >
          <RiCloseLine size={24} />
        </button>
      </div>
    </div>
  )
}

export default Hero;