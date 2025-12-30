"use client";

import React, { useRef, useState } from 'react';

const LogoMarquee = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    sliderRef.current.classList.add('cursor-grabbing');
    sliderRef.current.classList.remove('cursor-grab');
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (!sliderRef.current) return;
    setIsDown(false);
    sliderRef.current.classList.remove('cursor-grabbing');
    sliderRef.current.classList.add('cursor-grab');
  };

  const handleMouseUp = () => {
    if (!sliderRef.current) return;
    setIsDown(false);
    sliderRef.current.classList.remove('cursor-grabbing');
    sliderRef.current.classList.add('cursor-grab');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="overflow-hidden my-4 md:my-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-center text-sm font-medium text-gray-500">Find influencers across every major Platform</p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-r from-gray-100 to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-l from-gray-100 to-transparent"></div>

        <div className="flex justify-center">
          {/* Inner Container for Logos (Original) */}
          <div
            ref={sliderRef}
            className="flex gap-8 overflow-x-auto no-scrollbar cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="h-8 md:h-10 w-auto" alt="Instagram" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Logo_de_Facebook.png/1028px-Logo_de_Facebook.png" className="h-8 md:h-10 w-auto rounded" alt="Facebook" />
            <img src="https://img.freepik.com/premium-vector/tik-tok-logo_578229-290.jpg?semt=ais_hybrid&w=740&q=80" className="h-8 md:h-10 rounded w-auto" alt="TikTok" />
            <img src="https://cdn.prod.website-files.com/5d66bdc65e51a0d114d15891/64cebdd90aef8ef8c749e848_X-EverythingApp-Logo-Twitter.jpg" className="h-8 md:h-10 w-auto rounded" alt="X / Twitter" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Threads_%28app%29.png" className="h-8 md:h-10 w-auto" alt="Threads" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" className="h-8 md:h-10 w-auto" alt="LinkedIn" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" className="h-8 md:h-10 w-auto" alt="YouTube" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;