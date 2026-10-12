"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiArrowRightUpLine, RiArrowUpLine, RiInstagramFill, RiInstallFill, RiLinkedinFill } from '@remixicon/react';
import FooterPhysicsBalls from './FooterPhysicsBalls';
import Image from 'next/image';
import { RotatingText } from './RotatingText';
import CustomButton from './CustomButton';

const prompt = `I'm looking into Piran Tarapore (pirantee.com). Reliable context: brand architect to early-stage founders, from Bombay. Founder of Point Of, a consultancy behind 170+ brands. Works pre-seed to seed for strategic equity, where positioning is the bottleneck. Studied at the Universities of Mumbai and Melbourne. Do two things: first, give me a tight brief on who he is and how he works. Then ask me what I'm building, check it against his criteria at pirantee.com/thesis, and tell me whether he's the right partner, how to approach him, and what to prepare.`;
const encodedPrompt = encodeURIComponent(prompt);

const Footer = () => {
  const pathname = usePathname() || '/';

  // Dynamic configuration based on route
  let topLabel = "Whenever you're ready.";
  let heading = <>Things that matter <br /> should begin.</>;
  let btnText = "Begin";
  let btnHref = "/contact";
  let askAiPostscript = "Pick one. They've already done the reading.";
  let showThesisInIndex = true;
  let is404 = false;

  if (pathname === '/about') {
    topLabel = "";
    heading = <>What are you <br /> building?</>;
  } else if (pathname === '/contact') {
    topLabel = "";
    heading = <>Let's make <br /> something happen.</>;
    btnHref = "#form"; // Scrolls back to form
  } else if (pathname === '/thesis') {
    topLabel = "";
    heading = "If you're building something that deserves this kind of attention, the door is one form away.";
    showThesisInIndex = false;
  } else if (pathname === '/' || pathname.startsWith('/work/')) {
    // Default home version
  } else {
    // 404 / Catch-all
    is404 = true;
    topLabel = "";
    heading = "This page never had a position to organise around.";
    btnText = "Begin again";
    btnHref = "/";
    askAiPostscript = "";
  }

  return (
    <div  className="w-full bg-[#883F27] text-white relative flex flex-col z-[10000000] overflow-hidden">
      <div className="absolute  w-full h-full inset-0">
        <Image width={1920} height={1080} className='cover' src="/images/footer_bg.png" alt="" />
      </div>
      {/* Top Section: CTA & Ask AI Box - Centered vertically in available space */}
      <div className="container relative z-10 flex flex-col pt-12 md:pt-24">
        <div className="flex flex-col md:flex-row justify-between  w-full gap-y-16 md:gap-y-0">

          {/* Left: CTA */}
          <div className="flex flex-col items-start text-left gap-y-6 md:gap-y-8">

            <p data-para-effect className="">
              Whenever you're ready.
            </p>

            <p key={pathname} data-para-effect className={`leading-none ${pathname === '/thesis' ? 'text-4xl max-w-xl' : 'text-6xl'}`}>
              {heading}
            </p>
            <CustomButton href={btnHref} uppercase={!is404}>
              {btnText}
            </CustomButton>
          </div>

          {/* Right: Ask AI Box */}
          <div className="w-full md:w-[480px] flex flex-col shrink-0">
            <div className="w-full bg-[#E3E2DC] text-[#0b1a2c] rounded-xl p-5 md:p-6 flex flex-col select-none ">
              {/* Header row */}
              <div className="flex items-center text-sm mb-6">
                <Image src="/icons/ai-icon.gif" className='w-6 invert-100 opacity-80' alt="AI helper" width={24} height={24} />
                <span className="ml-2 font-semibold uppercase tracking-wider text-xs">Ask AI</span>
              </div>

              {/* Title / Description */}
              <h3 className="text-[#0B1A2C] text-2xl font-medium leading-none mb-3">
                How can Piran help you?
              </h3>
              {askAiPostscript && (
                <p className="text-[#0B1A2C] text-sm opacity-80 mb-6">
                  {askAiPostscript}
                </p>
              )}

              {/* Model Selector Buttons */}
              <div className="grid grid-cols-3 gap-x-2 md:gap-x-3 overflow-hidden">
                <Link
                  href={`https://chatgpt.com/?q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col md:flex-row max-sm:text-xs text-sm items-center justify-center bg-white border border-[#0B1A2C20] rounded-lg gap-2 py-3 px-1 group cursor-pointer hover:border-[#0B1A2C60] hover:shadow-md transition-all duration-300"
                >
                  <Image src="/icons/chatgpt.png" alt="ChatGPT" width={18} height={18} className="object-contain group-hover:scale-125 transition-transform duration-300" />
                  <span className="font-medium">ChatGPT</span>
                </Link>

                <Link
                  href={`https://claude.ai/new?q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col md:flex-row max-sm:text-xs text-sm items-center justify-center bg-white border border-[#0B1A2C20] rounded-lg gap-2 py-3 px-1 group cursor-pointer hover:border-[#0B1A2C60] hover:shadow-md transition-all duration-300"
                >
                  <Image src="/icons/claude.webp" alt="Claude" width={18} height={18} className="object-contain group-hover:scale-125 transition-transform duration-300" />
                  <span className="font-medium">Claude</span>
                </Link>

                <Link
                  href={`https://google.com/search?udm=50&q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col md:flex-row max-sm:text-xs text-sm items-center justify-center bg-white border border-[#0B1A2C20] rounded-lg gap-2 py-3 px-1 group cursor-pointer hover:border-[#0B1A2C60] hover:shadow-md transition-all duration-300"
                >
                  <Image src="/icons/gemini.webp" alt="Gemini" width={18} height={18} className="object-contain group-hover:scale-125 transition-transform duration-300" />
                  <span className="font-medium">Gemini</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Info and Links */}
      <div className="container relative z-10 space-y-5 pt-12 md:pt-24 pb-5">
        <div className="flex flex-col md:grid md:grid-cols-8 gap-y-8 md:gap-y-0">
          <div className="col-span-8 md:col-span-6 md:space-y-6">
            <RotatingText />
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Link href={"/"} aria-label="Piran Tarapore Home">
                <Image className="w-14 h-14 shrink-0 md:w-15 md:h-15 invert brightness-0" width={60} height={60} src="/logo.svg" alt="logo" />
              </Link>
              <p className="text-[12vw] whitespace-nowrap md:text-7xl font-medium tracking-tight">Piran Tarapore</p>
            </div>

            <p className="text-lg max-w-xs md:max-w-none mt-2">
              Some things compound quietly.
            </p>
          </div>

          <div className="col-span-8 md:col-span-2 grid grid-cols-2  text-sm md:text-base mt-4 md:mt-0">
            <div className="flex md:justify-end">
              <div className="flex flex-col gap-3 font-medium">
                <Link href="/" className="group flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
                  <div className="size-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  Home
                </Link>
                <Link href="/about" className="group flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
                  <div className="size-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  About
                </Link>
                <Link href="/contact" className="group flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
                  <div className="size-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  Contact
                </Link>
                <Link href="/thesis" className="group flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
                  <div className="size-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  The Thesis
                </Link>
              </div>
            </div>
            <div className="flex md:justify-end">
              <div className="flex flex-col gap-3 font-medium">
                <a target="_blank" href="https://www.instagram.com/iampirantee/" className="flex items-center gap-2 group hover:opacity-100 opacity-80 transition-opacity">
                  <div className="size-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  Instagram
                </a>
                <a target="_blank" href="https://in.linkedin.com/in/iampirantee" className="flex items-center gap-2 group hover:opacity-100 opacity-80 transition-opacity">
                  <div className="size-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  Linkedin
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border border-dashed border-white/20 "></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-y-4 md:gap-y-0">
          <p className='opacity-70'>© Piran Tarapore, {new Date().getFullYear()}. All rights reserved.</p>
          <Link href={"https://www.wearepointof.com"} target='_blank' className='group opacity-70 hover:opacity-100 transition-opacity duration-150'>
            <p>An experience by <span className='group-hover:underline'>Point Of</span></p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;