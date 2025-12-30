"use client";

import React from 'react';

const LogoMarquee = () => {
  // Logos are duplicated to create a seamless infinite scroll effect
  const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", alt: "Instagram" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Logo_de_Facebook.png/1028px-Logo_de_Facebook.png", alt: "Facebook" },
    { src: "https://img.freepik.com/premium-vector/tik-tok-logo_578229-290.jpg?semt=ais_hybrid&w=740&q=80", alt: "TikTok" },
    { src: "https://cdn.prod.website-files.com/5d66bdc65e51a0d114d15891/64cebdd90aef8ef8c749e848_X-EverythingApp-Logo-Twitter.jpg", alt: "X / Twitter" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/d/db/Threads_%28app%29.png", alt: "Threads" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", alt: "LinkedIn" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg", alt: "YouTube" },
  ];

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
          {/* Inner Container for Logos (Original + Duplicated for seamless scroll) */}
          <div className="flex gap-8 animate-scroll whitespace-nowrap">
            {/* Original set of logos */}
            {logos.map((logo, index) => (
              <img key={`original-${index}`} src={logo.src} className="h-8 md:h-10 w-auto flex-shrink-0 rounded" alt={logo.alt} />
            ))}
            {/* Duplicated set of logos for seamless loop */}
            {logos.map((logo, index) => (
              <img key={`duplicate-${index}`} src={logo.src} className="h-8 md:h-10 w-auto flex-shrink-0 rounded" alt={logo.alt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;