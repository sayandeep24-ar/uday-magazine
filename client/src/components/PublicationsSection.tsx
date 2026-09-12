import React, { useState } from 'react';
import { BookOpen, Download, Eye, Sparkles, Music, ChevronRight, Bookmark, Compass, Filter, Share2 } from 'lucide-react';
import { FEATURED_ARTICLES, SECTION_DETAILS, EDITOR_LETTER, PAST_VOLUMES, Article } from '../data/publicationData';

interface PublicationsSectionProps {
  onReadArticle: (article: Article) => void;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ onReadArticle }) => {
  const [activeSection, setActiveSection] = useState<string>('All');
  const [showEditorLetter, setShowEditorLetter] = useState<boolean>(false);

  const sections = ['All', 'Hindol', 'Deepak', 'Megha', 'Shri', 'Photographs', 'Artwork'];

  const filteredArticles = activeSection === 'All'
    ? FEATURED_ARTICLES
    : FEATURED_ARTICLES.filter(a => a.section === activeSection);

  const handleDownloadPdf = () => {
    alert("Downloading Uday Volume 11 'The Ascent' (Digital High-Res Edition). Please check your browser downloads!");
  };

  return (
    <section id="publications" className="py-20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-t border-uday-peach/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-crimson bg-uday-crimson/10 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" /> Latest Publications & Archival Issues
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-uday-midnight">
            Volume 11 (2024): <span className="text-uday-crimson">The Ascent</span>
          </h2>
          <p className="text-base text-uday-midnight/70 leading-relaxed">
            Constructed around the motif of the changing seasons and Indian Classical Ragas. Explore stories of human vulnerability, scientific philosophy, and poignant verses from across campus.
          </p>
        </div>

        {/* Featured Issue Spotlight Card */}
        <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF9F2] rounded-3xl border border-uday-peach/50 p-6 sm:p-10 shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-uday-orange/15 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
            {/* Magazine Cover Preview */}
            <div className="w-64 sm:w-72 shrink-0 group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-300 group-hover:rotate-1 group-hover:scale-105 bg-uday-midnight">
                <img
                  src="/uday-logo.jpg"
                  alt="Uday Volume 11 Cover"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end text-white">
                  <span className="text-[11px] uppercase tracking-widest text-uday-peach font-bold">IISER Bhopal</span>
                  <h3 className="font-serif font-black text-2xl">UDAY</h3>
                  <p className="text-xs text-white/80 font-medium">Vol. 11 • The Ascent • 2024</p>
                </div>
              </div>
            </div>

            {/* Issue Description & Action Links */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="bg-uday-crimson text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured Issue
                </span>
                <span className="bg-uday-sage/20 text-uday-forest text-xs font-semibold px-3 py-1 rounded-full">
                  84 Pages • Print & Digital
                </span>
                <span className="bg-uday-teal/15 text-uday-teal text-xs font-semibold px-3 py-1 rounded-full">
                  Classical Raga Structure
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-uday-midnight">
                The Seasons, The Ragas, and The Creative Spirit
              </h3>

              <p className="text-sm sm:text-base text-uday-midnight/80 leading-relaxed">
                "Our campus experiences the best of all seasons—from vibrant flowers in spring to lush green trees in the monsoons, to dry and contemplative in winters. Sections are named after Indian Classical Ragas based on their prevalence and time of year."
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setShowEditorLetter(!showEditorLetter)}
                  className="px-5 py-2.5 rounded-xl border-2 border-uday-teal text-uday-teal hover:bg-uday-teal hover:text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showEditorLetter ? 'Hide Editor’s Note' : 'Read Chief Editor’s Note'}</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-semibold text-sm shadow-warm hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Issue (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Editor's Letter */}
          {showEditorLetter && (
            <div className="mt-8 pt-8 border-t border-uday-peach/40 bg-white/80 p-6 sm:p-8 rounded-2xl animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-uday-crimson font-serif font-bold text-lg">
                  <Bookmark className="w-5 h-5" />
                  <h4>{EDITOR_LETTER.title}</h4>
                </div>
                <div className="text-xs text-uday-teal font-semibold">
                  By {EDITOR_LETTER.author} ({EDITOR_LETTER.role})
                </div>
              </div>
              <div className="text-sm text-uday-midnight/80 font-serif whitespace-pre-line leading-relaxed border-l-2 border-uday-crimson pl-4">
                {EDITOR_LETTER.text}
              </div>
            </div>
          )}
        </div>

        {/* Classical Ragas Section Filter Tabs */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-uday-peach/40 pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-uday-midnight">Featured Articles & Creative Pieces</h3>
              <p className="text-xs sm:text-sm text-uday-midnight/70">Click any card to read the complete prose or poetry inline.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 bg-uday-cream p-1.5 rounded-2xl border border-uday-peach/50">
              {sections.map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeSection === sec
                      ? 'bg-uday-crimson text-white shadow-sm'
                      : 'text-uday-midnight/75 hover:text-uday-crimson hover:bg-white/60'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Section Info Card (when a specific Raga section is selected) */}
          {activeSection !== 'All' && SECTION_DETAILS[activeSection as keyof typeof SECTION_DETAILS] && (
            <div className="bg-white/90 border border-uday-peach/50 p-4 sm:p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-fadeIn">
              <div className="w-10 h-10 rounded-xl bg-uday-orange/15 text-uday-orange flex items-center justify-center shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-uday-midnight text-base">
                    {SECTION_DETAILS[activeSection as keyof typeof SECTION_DETAILS].ragaName}
                  </span>
                  <span className="text-xs bg-uday-sage/15 text-uday-forest px-2 py-0.5 rounded-full font-medium">
                    {SECTION_DETAILS[activeSection as keyof typeof SECTION_DETAILS].season}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-uday-midnight/75 leading-relaxed">
                  {SECTION_DETAILS[activeSection as keyof typeof SECTION_DETAILS].description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              onClick={() => onReadArticle(art)}
              className="bg-white rounded-2xl border border-uday-peach/40 p-6 shadow-sm hover:shadow-xl hover:border-uday-crimson/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-uday-teal/10 text-uday-teal px-2.5 py-0.5 rounded-md">
                    {art.section}
                  </span>
                  <span className="text-xs text-uday-midnight/50 font-medium">
                    {art.language || 'English'} • {art.genre}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif text-xl font-bold text-uday-midnight group-hover:text-uday-crimson transition-colors leading-snug">
                  {art.title}
                </h4>

                {/* Author */}
                <p className="text-xs font-semibold text-uday-orange">
                  by {art.author}
                </p>

                {/* Snippet */}
                <p className="text-xs sm:text-sm text-uday-midnight/70 line-clamp-3 leading-relaxed font-serif italic">
                  "{art.snippet}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-uday-peach/30 flex items-center justify-between text-xs font-semibold text-uday-crimson group-hover:translate-x-1 transition-transform">
                <span>Read Complete Piece</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Past Volumes Archive */}
        <div className="pt-10 border-t border-uday-peach/40">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-uday-midnight">Archive of Past Volumes</h3>
            <p className="text-sm text-uday-midnight/70">Browse earlier annual editions of Uday Magazine from IISER Bhopal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAST_VOLUMES.map(vol => (
              <div
                key={vol.id}
                className="bg-white rounded-2xl border border-uday-peach/40 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-uday-midnight/5 border border-uday-peach/30">
                    <img
                      src={vol.coverImage}
                      alt={vol.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {vol.year}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-uday-teal uppercase tracking-wider">
                      Volume {vol.volumeNumber}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-uday-midnight">{vol.title}</h4>
                    <p className="text-xs text-uday-midnight/70 line-clamp-2 mt-1">{vol.theme}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">{vol.pagesCount} Pages</span>
                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-1 text-xs font-bold text-uday-crimson hover:text-uday-midnight transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
