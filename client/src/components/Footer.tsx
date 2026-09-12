import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Feather, BookOpen, Heart, ArrowUp, Sparkles, Image, Calendar, MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpenSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSubmit }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-uday-midnight text-white border-t-4 border-uday-crimson pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-uday-crimson bg-white p-0.5 shadow-lg">
                <img src="/uday-logo.png" alt="Uday Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-serif font-black text-2xl tracking-wider text-white">UDAY</span>
                <span className="block text-[11px] uppercase tracking-widest text-uday-peach font-semibold -mt-1">
                  The Ascent • IISER Bhopal
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              The official institute magazine of IISER Bhopal. Dedicated to original investigative reporting, cross-disciplinary science essays, multilingual literature, fine art, and photography.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs">
              <button
                onClick={onOpenSubmit}
                className="bg-uday-crimson hover:bg-uday-flame text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Feather className="w-3.5 h-3.5" /> Post Blog
              </button>
              <Link
                to="/admin"
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 border border-white/20"
              >
                <Lock className="w-3.5 h-3.5" /> Admin
              </Link>
            </div>
          </div>

          {/* Quick Navigation Pages */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-uday-peach uppercase tracking-wider">
              Publications & Literature
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li><Link to="/magazines" className="hover:text-uday-peach transition-colors">Official Magazines Archive</Link></li>
              <li><Link to="/magazines" className="hover:text-uday-peach transition-colors">Vol 11: The Ascent (PDF)</Link></li>
              <li><Link to="/blogs" className="hover:text-uday-peach transition-colors">30-Day Community Blogs</Link></li>
              <li><Link to="/gallery" className="hover:text-uday-peach transition-colors">Campus Arts & Photography</Link></li>
              <li><Link to="/events" className="hover:text-uday-peach transition-colors">Literary Calendar & Events</Link></li>
            </ul>
          </div>

          {/* Institute Space & Interaction */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-uday-peach uppercase tracking-wider">
              Interaction Desk
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li><Link to="/feedback" className="hover:text-uday-peach transition-colors">Feedback & Google Sheets</Link></li>
              <li><Link to="/contact" className="hover:text-uday-peach transition-colors">Editorial Board Directory</Link></li>
              <li><Link to="/contact" className="hover:text-uday-peach transition-colors">Send Direct Inquiry</Link></li>
              <li><Link to="/admin" className="hover:text-uday-peach transition-colors">Admin Dashboard Access</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-uday-peach uppercase tracking-wider">
              Editorial Office
            </h4>
            <div className="space-y-2 text-xs text-white/75">
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Official Email</span>
                <a href="mailto:udaymagz@iiserb.ac.in" className="text-uday-peach hover:underline font-semibold">
                  udaymagz@iiserb.ac.in
                </a>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Portal & Web Lead</span>
                <span className="text-white/90 font-medium block">Souradip</span>
                <a href="mailto:sayandeep.biswas04@gmail.com" className="text-white/70 hover:underline text-xs">
                  sayandeep.biswas04@gmail.com
                </a>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Faculty Advisor</span>
                <span className="text-white/90">Dr. Renny Thomas (Dept. of HSS)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Explicit Copyright to Souradip and Sayandeep */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>© 2024 UDAY Magazine. IISER Bhopal. All rights reserved.</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="font-semibold text-uday-peach">
              Designed & Developed by Souradip & Sayandeep
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors text-xs font-semibold"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Back to Top
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
