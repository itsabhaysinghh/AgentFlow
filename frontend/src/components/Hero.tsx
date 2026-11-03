import React, { useState } from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartBuilding: () => void;
  onExploreFeatures: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBuilding, onExploreFeatures }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4";

  return (
    <div className="relative min-h-[82vh] md:min-h-[86vh] flex flex-col items-center justify-end pb-12 md:pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background Cinematic Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {!videoError && (
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Ambient fallback / enhanced metallic glow if video fails or while loading */}
        <div className="absolute inset-0 bg-radial-at-c from-zinc-800/20 via-black to-black opacity-60" />

        {/* Radial vignette overlay blending video into pure black #000000 */}
        <div className="absolute inset-0 video-vignette" />
        
        {/* Top subtle fade from header */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent" />
        
        {/* Bottom solid fade to blend seamlessly into feature indicators */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>

      {/* Hero Content (Positioned bottom-centered in viewport) */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center animate-fade-up">
        {/* Badge: Multi-Agent AI Automation */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full metallic-badge mb-6 md:mb-8 text-zinc-300 text-xs font-medium tracking-wider uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300"></span>
          </span>
          <span>Multi-Agent AI Automation</span>
        </div>

        {/* Main Heading with Instrument Serif Italic Highlights */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-normal tracking-tight text-white leading-[1.12] sm:leading-[1.15] mb-6 max-w-3xl">
          Turn{' '}
          <span className="font-serif italic text-white/95 font-normal tracking-normal text-[1.14em]">
            complex tasks
          </span>{' '}
          into{' '}
          <span className="font-serif italic text-white/95 font-normal tracking-normal text-[1.14em]">
            automated workflows.
          </span>
        </h1>

        {/* Supporting Subheading */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto mb-9">
          Coordinate specialized AI agents that break down complex natural-language goals, conduct exhaustive research, analyze insights, and validate every step before delivery.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={onStartBuilding}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium glass-btn-primary cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Start Building</span>
          </button>

          <button
            onClick={onExploreFeatures}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium glass-btn-secondary cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-zinc-400" />
            <span>Explore Features</span>
            <ArrowRight className="w-4 h-4 text-zinc-400 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

