import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, SkipForward, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RenderWakeupLandingProps {
  onEnter?: () => void;
  targetPath?: string;
}

export const RenderWakeupLanding: React.FC<RenderWakeupLandingProps> = ({
  onEnter,
  targetPath = '/'
}) => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [isServerAwake, setIsServerAwake] = useState<boolean>(false);
  const [hasAnimationFinished, setHasAnimationFinished] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Waking up editorial portal...');
  const [progress, setProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const words = ['WAKE UP', 'WRITE', 'CLICK', 'DRAW', 'THINK', 'UDAY......'];

  // Handle entering the main portal
  const handleProceed = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onEnter) {
        onEnter();
      } else {
        navigate(targetPath);
      }
    }, 600);
  };

  // 1. BACKGROUND HEALTH CHECK ENGINE
  useEffect(() => {
    let isMounted = true;
    let pollInterval: any = null;

    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (res.ok && isMounted) {
          setIsServerAwake(true);
          setStatusMessage('Server is online & ready!');
          setProgress(100);
          if (pollInterval) clearInterval(pollInterval);
        }
      } catch (e) {
        if (!isMounted) return;
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);
        if (elapsed > 4) {
          setStatusMessage(`Awakening Render cloud service... (${elapsed}s)`);
        } else {
          setStatusMessage('Connecting to UDAY Portal...');
        }
      }
    };

    checkServer();
    pollInterval = setInterval(checkServer, 2500);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  // 2. TIMELINE: 3 GLOWS -> POETIC SEQUENCE
  useEffect(() => {
    // Phase 1: 3-Glow Logo duration is ~3.6s
    const glowDurationMs = 3600;
    const wordIntervalMs = 1400;

    // Progress bar animation
    const totalEst = glowDurationMs + (words.length * wordIntervalMs);
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(94, Math.floor((elapsed / totalEst) * 100));
      setProgress(prev => (prev >= 100 ? 100 : Math.max(prev, pct)));
    }, 150);

    // Start words after glow sequence completes
    const wordsTimer = setTimeout(() => {
      setCurrentWordIndex(0);
    }, glowDurationMs + 200);

    return () => {
      clearTimeout(wordsTimer);
      clearInterval(progressTimer);
    };
  }, []);

  // Step through words
  useEffect(() => {
    if (currentWordIndex < 0) return;

    if (currentWordIndex < words.length - 1) {
      const nextTimer = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 1400);
      return () => clearTimeout(nextTimer);
    } else if (currentWordIndex === words.length - 1) {
      // Reached final "UDAY......"
      setHasAnimationFinished(true);
    }
  }, [currentWordIndex]);

  // Once both animation finished and server is awake, auto proceed after short delay
  useEffect(() => {
    if (hasAnimationFinished && isServerAwake) {
      const autoTimer = setTimeout(() => {
        handleProceed();
      }, 1800);
      return () => clearTimeout(autoTimer);
    }
  }, [hasAnimationFinished, isServerAwake]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F17] text-[#FAF7F2] select-none transition-opacity duration-700 overflow-hidden ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Aurora Ambience Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#E75562]/30 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-[#FF9A66]/25 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#8F3A4B]/20 blur-[90px]" />
      </div>

      {/* Top Bar with Skip CTA */}
      <header className="fixed top-0 inset-x-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#FF9A66] shadow-[0_0_8px_#FF9A66]" />
          <span>IISER Bhopal</span>
        </div>

        <button
          onClick={handleProceed}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider text-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Skip Intro</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Center Stage Container */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl w-full">
        
        {/* Central Logo Container with Triple Glow */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mb-10 flex items-center justify-center">
          
          {/* Pulsing Back Halo */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#E75562]/40 to-[#FF9A66]/20 blur-xl opacity-60" />

          {/* Shockwave Rings for 3 Glows */}
          <div className="absolute inset-0 rounded-full border-2 border-[#FFCB99] animate-[ping_1.2s_0.1s_1_ease-out] opacity-0" />
          <div className="absolute inset-0 rounded-full border-2 border-[#FF9A66] animate-[ping_1.2s_1.2s_1_ease-out] opacity-0" />
          <div className="absolute inset-0 rounded-full border-2 border-[#E75562] animate-[ping_1.4s_2.4s_1_ease-out] opacity-0" />

          {/* Main Logo Container */}
          <div className="relative w-full h-full rounded-full p-2.5 bg-gradient-to-br from-[#1A2432] to-[#0E141D] border-2 border-[#FFCB99]/30 shadow-2xl flex items-center justify-center overflow-hidden animate-[glowThrice_3.6s_cubic-bezier(0.45,0.05,0.55,0.95)_forwards]">
            <img
              src="/uday-logo.png"
              alt="UDAY Magazine"
              className="w-full h-full object-contain rounded-full drop-shadow-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/uday-logo.jpg';
              }}
            />
          </div>
        </div>

        {/* Dynamic Slogan Words Area */}
        <div className="min-h-[140px] flex flex-col items-center justify-center relative w-full">
          {words.map((word, idx) => {
            const isActive = currentWordIndex === idx;
            const isUday = idx === words.length - 1;

            if (!isActive) return null;

            return (
              <div
                key={word}
                className={`transition-all duration-500 transform animate-scaleUp ${
                  isUday
                    ? 'font-serif text-4xl sm:text-6xl tracking-widest font-black bg-gradient-to-r from-[#FFF0DB] via-[#FF9A66] to-[#E75562] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,154,102,0.6)]'
                    : 'text-4xl sm:text-6xl font-black tracking-widest uppercase text-[#FAF7F2]'
                }`}
              >
                {word}
              </div>
            );
          })}

          {/* Tagline revealed on UDAY...... */}
          {hasAnimationFinished && (
            <div className="mt-4 flex flex-col items-center animate-fadeIn">
              <span className="px-3.5 py-1 rounded-full bg-[#FF9A66]/15 border border-[#FF9A66]/30 text-[#FFCB99] text-xs font-semibold tracking-wider uppercase mb-2">
                The Voice of IISER Bhopal
              </span>
              <p className="font-serif italic text-gray-400 text-sm">
                "Magna est veritas et praevalebit"
              </p>
            </div>
          )}
        </div>

        {/* Wakeup Status & Action Area */}
        <div className="mt-12 flex flex-col items-center gap-4 w-full max-w-sm">
          
          {/* Loading Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF9A66] via-[#E75562] to-[#FFCB99] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Server Status Indicator */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0E141D]/90 backdrop-blur-md border border-white/10 shadow-lg text-xs text-gray-300">
            <span
              className={`w-2 h-2 rounded-full transition-all ${
                isServerAwake
                  ? 'bg-emerald-400 shadow-[0_0_10px_#34D399]'
                  : 'bg-amber-400 shadow-[0_0_8px_#FBBF24] animate-ping'
              }`}
            />
            <span>{statusMessage}</span>
          </div>

          {/* Enter Button */}
          {hasAnimationFinished && (
            <button
              onClick={handleProceed}
              className="mt-2 flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E75562] to-[#FF9A66] text-white text-sm font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(231,85,98,0.45)] hover:shadow-[0_14px_40px_rgba(231,85,98,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Enter Uday Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>

      </main>

      {/* Footer Attribution */}
      <footer className="fixed bottom-0 inset-x-0 p-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/40 gap-2 pointer-events-none">
        <span>UDAY Magazine &copy; 2024–2026 IISER Bhopal</span>
        <span>
          Designed &amp; Built with ❤️ by{' '}
          <a
            href="https://github.com/itssouradip34"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-[#FF9A66] pointer-events-auto transition-colors"
          >
            Souradip
          </a>{' '}
          &amp;{' '}
          <a
            href="https://github.com/sayandeep24-ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-[#FF9A66] pointer-events-auto transition-colors"
          >
            Sayandeep
          </a>
        </span>
      </footer>

      {/* Global CSS for the 3-glow keyframe */}
      <style>{`
        @keyframes glowThrice {
          0% {
            box-shadow: 0 0 15px rgba(255, 154, 102, 0.2);
            border-color: rgba(255, 203, 153, 0.25);
            transform: scale(0.96);
          }
          16% {
            box-shadow: 0 0 45px rgba(231, 85, 98, 0.85), 0 0 90px rgba(255, 154, 102, 0.6);
            border-color: rgba(255, 203, 153, 0.9);
            transform: scale(1.05);
          }
          30% {
            box-shadow: 0 0 20px rgba(255, 154, 102, 0.3);
            border-color: rgba(255, 203, 153, 0.35);
            transform: scale(1);
          }
          48% {
            box-shadow: 0 0 60px rgba(231, 85, 98, 0.95), 0 0 120px rgba(255, 154, 102, 0.75);
            border-color: #FFCB99;
            transform: scale(1.07);
          }
          62% {
            box-shadow: 0 0 25px rgba(255, 154, 102, 0.35);
            border-color: rgba(255, 203, 153, 0.45);
            transform: scale(1.01);
          }
          80% {
            box-shadow: 0 0 80px rgba(231, 85, 98, 1), 0 0 150px rgba(255, 154, 102, 0.9), 0 0 200px rgba(255, 203, 153, 0.5);
            border-color: #FFFFFF;
            transform: scale(1.10);
          }
          100% {
            box-shadow: 0 0 35px rgba(255, 154, 102, 0.5), 0 0 70px rgba(231, 85, 98, 0.3);
            border-color: rgba(255, 203, 153, 0.6);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
