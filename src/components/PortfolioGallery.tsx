"use client";

import React from 'react';
import { Play, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface PortfolioItem {
  title: string;
  type: 'video' | 'image';
  thumbnail: string;
  url: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Recent Collaborations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <a 
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100"
          >
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                {item.type === 'video' ? <Play size={24} fill="currentColor" /> : <ExternalLink size={24} />}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 text-white">
                {item.type === 'video' ? <Play size={14} /> : <ImageIcon size={14} />}
                <span className="text-sm font-bold truncate">{item.title}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PortfolioGallery;