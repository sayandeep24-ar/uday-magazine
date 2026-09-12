import React from 'react';
import { BookOpen, Sparkles, Feather, ArrowDown, Compass, Award, Heart } from 'lucide-react';

interface HeroSectionProps {
  onOpenSubmitBlog: () => void;
  onReadLatestIssue: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSubmitBlog, onReadLatestIssue }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Decorative Rings Matching Logo Palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] md:w-[850px] md:h-[850px] rounded-full pointer-events-none -z-10 opacity-30 blur-3xl bg-gradient-to-tr from-uday-crimson via-uday-orange via-uday-peach to-uday-aqua" />
      
      {/* Subtle Grid / Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#E75562_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Typography & CTAs */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-uday-crimson/10 via-uday-orange/15 to-uday-teal/10 border border-uday-crimson/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-uday-midnight tracking-wide">
              <span className="w-2 h-2 rounded-full bg-uday-crimson animate-ping" />
              <span>Official Magazine of IISER Bhopal</span>
              <span className="text-uday-crimson font-bold">•</span>
              <span className="text-uday-teal">Volume 11: The Ascent</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-uday-midnight leading-[1.15] tracking-tight">
                Where Science Meets{' '}
                <span className="bg-gradient-to-r from-uday-crimson via-uday-orange to-uday-teal bg-clip-text text-transparent">
                  Poetry, Art & Dialogue.
                </span>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-uday-teal font-medium">
                "Magna est veritas et praevalebit — Great is truth, and it will prevail."
              </p>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-uday-midnight/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <strong>UDAY</strong> is the institute’s creative heartbeat. We publish original investigative journalism, multilingual poetry, personal memoirs, scientific critiques, and fine art from across the IISER Bhopal student and researcher body.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onReadLatestIssue}
                className="flex items-center gap-2.5 bg-gradient-to-r from-uday-crimson to-uday-flame text-white font-semibold px-7 py-3.5 rounded-xl shadow-warm hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read Volume 11</span>
              </button>

              <button
                onClick={onOpenSubmitBlog}
                className="flex items-center gap-2.5 bg-white text-uday-midnight border-2 border-uday-peach hover:border-uday-orange font-semibold px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-uday-cream transition-all duration-200"
              >
                <Feather className="w-5 h-5 text-uday-crimson" />
                <span>Submit Your Blog</span>
              </button>
            </div>

            {/* Micro Highlights Banner */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-uday-peach/40 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black font-serif text-uday-crimson">Vol. 11</div>
                <div className="text-xs text-uday-midnight/70 font-medium">Latest Issue</div>
              </div>
              <div className="text-center lg:text-left border-x border-uday-peach/40 px-2">
                <div className="text-2xl font-black font-serif text-uday-teal">6 Ragas</div>
                <div className="text-xs text-uday-midnight/70 font-medium">Seasonal Moods</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black font-serif text-uday-sage">30 Days</div>
                <div className="text-xs text-uday-midnight/70 font-medium">Open Blog Window</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Logo Emblem with Multi-Ring Sunrise Composition */}
          <div className="flex-1 relative flex items-center justify-center">
            
            {/* Concentric Rotating Sun Ray Ambient */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-uday-crimson/20 via-uday-orange/20 to-uday-aqua/25 animate-pulse-glow" />

              {/* Decorative Circular Dashed Orbit */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-dashed border-uday-orange/40 animate-[spin_60s_linear_infinite]" />

              {/* The Actual Uday Logo in Center */}
              <div className="relative w-60 h-60 sm:w-80 sm:h-80 rounded-full p-2 bg-white shadow-2xl border-4 border-white overflow-hidden group">
                <img
                  src="/uday-logo.jpg"
                  alt="Uday Magazine Sunrise Logo"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Badge 1: 2024 Ascent Edition */}
              <div className="absolute -bottom-3 -left-4 sm:left-0 bg-white/95 backdrop-blur-md border border-uday-peach shadow-lg px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-uday-crimson/10 flex items-center justify-center text-uday-crimson font-serif font-bold text-base">
                  11
                </div>
                <div>
                  <div className="text-xs font-bold text-uday-midnight">The Ascent (2024)</div>
                  <div className="text-[10px] text-uday-teal font-medium">84 Pages • Full Color</div>
                </div>
              </div>

              {/* Floating Badge 2: Open Student Submissions */}
              <div className="absolute -top-3 -right-4 sm:right-0 bg-white/95 backdrop-blur-md border border-uday-peach shadow-lg px-3.5 py-2 rounded-2xl flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-uday-sage animate-pulse" />
                <div className="text-left">
                  <div className="text-xs font-bold text-uday-midnight">Submissions Open</div>
                  <div className="text-[10px] text-uday-teal">Reviewed by Admin</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
