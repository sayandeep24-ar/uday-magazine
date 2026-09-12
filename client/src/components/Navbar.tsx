import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BookOpen, Feather, Image, Calendar, MessageSquare, Mail, Lock, Menu, X, Bell, ChevronRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenSubmitBlog: () => void;
  announcements?: Array<{ id: string; text: string; tag: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSubmitBlog, announcements = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAnnounceIndex, setActiveAnnounceIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Announcement ticker
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setActiveAnnounceIndex(prev => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Magazines', path: '/magazines', icon: BookOpen },
    { name: 'Community Blogs', path: '/blogs', icon: Feather },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
    { name: 'Contact & Team', path: '/contact', icon: Mail },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-uday-crimson via-uday-orange to-uday-teal text-white text-xs py-1.5 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <span className="inline-flex items-center gap-1 font-bold bg-white/20 px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
                <Bell className="w-3 h-3 animate-bounce" /> {announcements[activeAnnounceIndex]?.tag || 'UPDATE'}
              </span>
              <span className="text-white/95 font-medium truncate text-[11px] sm:text-xs">
                {announcements[activeAnnounceIndex]?.text}
              </span>
            </div>
            <Link
              to="/events"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 hover:text-white underline underline-offset-2 shrink-0"
            >
              Details & RSVP →
            </Link>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-uday-peach/40'
            : 'bg-[#FAF7F2]/95 backdrop-blur-sm py-3.5 border-b border-uday-peach/25'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-uday-crimson shadow-warm group-hover:scale-105 transition-transform duration-300 bg-white">
              <img
                src="/uday-logo.png"
                alt="Uday Magazine Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-uday-midnight group-hover:text-uday-crimson transition-colors">
                  UDAY
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-uday-crimson/10 text-uday-crimson px-1.5 py-0.5 rounded">
                  IISERB
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-wide text-uday-teal uppercase -mt-1 hidden sm:block">
                The Ascent • Official Institute Magazine
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-uday-crimson text-white shadow-sm'
                        : 'text-uday-midnight/80 hover:text-uday-crimson hover:bg-uday-peach/20'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenSubmitBlog}
              className="flex items-center gap-1.5 bg-gradient-to-r from-uday-crimson to-uday-orange text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow-warm hover:opacity-95 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Post Blog</span>
            </button>

            <Link
              to="/admin"
              className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
                location.pathname === '/admin'
                  ? 'bg-uday-midnight text-white border-uday-midnight'
                  : 'text-uday-teal hover:text-uday-midnight bg-uday-teal/10 hover:bg-uday-teal/20 border-uday-teal/25'
              }`}
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSubmitBlog}
              className="sm:hidden bg-uday-crimson text-white p-2 rounded-xl shadow-sm"
              title="Post Blog"
            >
              <Feather className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-uday-peach/50 text-uday-midnight hover:bg-uday-peach/20 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-uday-crimson" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer (Slide-out Overlay) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[90px] z-50 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FAF7F2] border-b-2 border-uday-crimson w-full max-h-[80vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-scaleUp">
              
              {/* Drawer Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-uday-crimson text-white shadow-warm'
                          : 'text-uday-midnight hover:bg-white hover:text-uday-crimson'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-uday-teal'}`} />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-3 border-t border-uday-peach/40 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSubmitBlog();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-uday-crimson to-uday-orange text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-warm"
                >
                  <Feather className="w-4 h-4" /> Post Your Blog Entry
                </button>

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-uday-midnight border border-uday-peach/60 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-uday-cream"
                >
                  <Lock className="w-3.5 h-3.5 text-uday-crimson" /> Admin Portal Access
                </Link>
              </div>

            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
