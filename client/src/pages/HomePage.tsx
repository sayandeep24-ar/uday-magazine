import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Feather, Image, Calendar, Download, Eye, Clock, ArrowRight, Sparkles, Heart, Compass } from 'lucide-react';
import { BlogItem } from '../components/CommunityBlogsSection';
import { GalleryItem } from '../components/ImageGallerySection';

interface HomePageProps {
  onOpenSubmitBlog: () => void;
  blogs: BlogItem[];
  gallery: GalleryItem[];
  events: { upcoming: any[]; past: any[] };
  onReadBlog: (blog: BlogItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSubmitBlog,
  blogs,
  gallery,
  events,
  onReadBlog
}) => {
  return (
    <div className="space-y-20 pt-28 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none -z-10 opacity-35 blur-3xl bg-gradient-to-tr from-uday-crimson via-uday-orange via-uday-peach to-uday-aqua" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left Col */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-uday-crimson/10 via-uday-orange/15 to-uday-teal/10 border border-uday-crimson/25 px-4 py-1.5 rounded-full text-xs font-semibold text-uday-midnight tracking-wide">
                <span className="w-2 h-2 rounded-full bg-uday-crimson animate-ping" />
                <span>Official Magazine of IISER Bhopal</span>
                <span className="text-uday-crimson font-bold">•</span>
                <span className="text-uday-teal font-bold">Vol 11: The Ascent</span>
              </div>

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

              <p className="text-sm sm:text-base text-uday-midnight/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                <strong>UDAY</strong> compiles and publishes investigative institute journalism, multilingual poetry, student essays, fine arts, and photography across the IISER Bhopal community.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/magazines"
                  className="flex items-center gap-2 bg-gradient-to-r from-uday-crimson to-uday-flame text-white font-semibold px-6 py-3 rounded-xl shadow-warm hover:shadow-xl hover:scale-105 transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Magazines & PDFs</span>
                </Link>

                <button
                  onClick={onOpenSubmitBlog}
                  className="flex items-center gap-2 bg-white text-uday-midnight border-2 border-uday-peach hover:border-uday-orange font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-uday-cream transition-all text-sm"
                >
                  <Feather className="w-4 h-4 text-uday-crimson" />
                  <span>Submit Your Blog</span>
                </button>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-uday-peach/40 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-black font-serif text-uday-crimson">Vol. 11</div>
                  <div className="text-xs text-uday-midnight/70 font-medium">Current Edition</div>
                </div>
                <div className="border-x border-uday-peach/40 px-2">
                  <div className="text-2xl font-black font-serif text-uday-teal">30 Days</div>
                  <div className="text-xs text-uday-midnight/70 font-medium">Open Blog Window</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-serif text-uday-sage">84 Pages</div>
                  <div className="text-xs text-uday-midnight/70 font-medium">Full Color PDF</div>
                </div>
              </div>
            </div>

            {/* Right Col Emblem */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-uday-crimson/20 via-uday-orange/20 to-uday-aqua/25 animate-pulse-glow" />
                <div className="absolute -inset-4 rounded-full border border-dashed border-uday-orange/40 animate-[spin_60s_linear_infinite]" />
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full p-2 bg-white shadow-2xl border-4 border-white overflow-hidden group">
                  <img
                    src="/uday-logo.jpg"
                    alt="Uday Magazine Sunrise Emblem"
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LATEST MAGAZINE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF9F2] rounded-3xl border border-uday-peach/60 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Magazine Cover */}
            <div className="w-60 sm:w-64 shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group bg-uday-midnight">
                <img
                  src="/uday-logo.jpg"
                  alt="Uday Vol 11 Cover"
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-bold text-uday-peach">IISER Bhopal</span>
                  <h3 className="font-serif font-black text-xl">UDAY • Vol 11</h3>
                  <p className="text-xs text-white/80">The Ascent (2024)</p>
                </div>
              </div>
            </div>

            {/* Content & Action */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="bg-uday-crimson text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Latest Official Release
                </span>
                <span className="bg-uday-sage/20 text-uday-forest text-xs font-semibold px-3 py-0.5 rounded-full">
                  84 Pages • Digital PDF
                </span>
              </div>

              <h2 className="font-serif text-3xl font-black text-uday-midnight">
                Volume 11 (2024): <span className="text-uday-crimson">The Ascent</span>
              </h2>

              <p className="text-xs sm:text-sm text-uday-midnight/75 leading-relaxed max-w-2xl">
                The latest print and digital edition of Uday, built upon the concept of changing campus seasons and Indian Classical Ragas (Hindol, Deepak, Megha, Shri). Featuring investigative journalism, scientific philosophy, and fine student art.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="/uploads/uday-volume-11-the-ascent.pdf"
                  download="Uday-Volume-11-The-Ascent.pdf"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-semibold text-xs uppercase tracking-wider shadow-warm hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Official PDF
                </a>

                <Link
                  to="/magazines"
                  className="px-5 py-2.5 rounded-xl border-2 border-uday-teal text-uday-teal hover:bg-uday-teal hover:text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> View Magazine Library
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. RECENT COMMUNITY BLOGS (30-DAY FEATURED FEED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-orange bg-uday-orange/10 px-3 py-1 rounded-full mb-2">
              <Feather className="w-3.5 h-3.5" /> 30-Day Open Community Feed
            </div>
            <h2 className="font-serif text-3xl font-black text-uday-midnight">
              Recent Student & Community Blogs
            </h2>
          </div>

          <Link
            to="/blogs"
            className="text-xs font-bold text-uday-orange hover:text-uday-midnight flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Community Blogs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map(blog => (
            <div
              key={blog.id}
              onClick={() => onReadBlog(blog)}
              className="bg-white rounded-2xl border border-uday-peach/50 p-6 shadow-sm hover:shadow-xl hover:border-uday-orange/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-uday-crimson/10 text-uday-crimson px-2.5 py-0.5 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-[11px] font-bold text-uday-teal flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.daysRemaining ?? 30}d left
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-uday-midnight group-hover:text-uday-orange transition-colors leading-snug">
                  {blog.title}
                </h3>

                <p className="text-xs text-uday-midnight/60 font-semibold">
                  by {blog.author}
                </p>

                <p className="text-xs text-uday-midnight/70 line-clamp-3 leading-relaxed font-serif">
                  "{blog.excerpt}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-uday-peach/30 flex items-center justify-between text-xs text-uday-orange font-bold">
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VISUAL ARTS & PHOTO HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-teal bg-uday-teal/10 px-3 py-1 rounded-full mb-2">
              <Image className="w-3.5 h-3.5" /> Visual Arts
            </div>
            <h2 className="font-serif text-3xl font-black text-uday-midnight">
              Campus Photography & Artwork
            </h2>
          </div>

          <Link
            to="/gallery"
            className="text-xs font-bold text-uday-teal hover:text-uday-midnight flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map(item => (
            <Link
              key={item.id}
              to="/gallery"
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-black shadow-sm hover:shadow-lg border border-uday-peach/30"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white opacity-90">
                <span className="text-[10px] font-bold text-uday-peach truncate">{item.title}</span>
                <span className="text-[9px] text-white/75">{item.artist}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
