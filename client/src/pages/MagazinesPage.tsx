import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Eye, Sparkles, Music, Bookmark, ChevronRight, FileText, Lock, Trash2, ShieldAlert } from 'lucide-react';
import { FEATURED_ARTICLES, SECTION_DETAILS, EDITOR_LETTER, Article } from '../data/publicationData';

interface MagazineEdition {
  id: string;
  volumeNumber: number;
  year: number;
  title: string;
  theme: string;
  coverImage: string;
  pdfUrl: string;
  editorInChief: string;
  pagesCount: number;
  releaseDate?: string;
  description?: string;
  isLatest?: boolean;
}

interface MagazinesPageProps {
  onReadArticle: (article: Article) => void;
}

export const MagazinesPage: React.FC<MagazinesPageProps> = ({ onReadArticle }) => {
  const [magazines, setMagazines] = useState<MagazineEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('All');
  const [showEditorLetter, setShowEditorLetter] = useState<boolean>(false);
  const adminToken = localStorage.getItem('uday_admin_token');

  const loadMagazines = () => {
    fetch('/api/magazines')
      .then(res => res.json())
      .then(data => {
        setMagazines(data.magazines || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching magazines:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMagazines();
  }, []);

  const handleDeleteMagazine = async (id: string, title: string) => {
    if (!adminToken) {
      alert("Admin authentication required. Please log into the Admin portal first.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/magazines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        alert(`Magazine "${title}" removed successfully.`);
        loadMagazines();
      } else {
        alert("Failed to delete magazine issue.");
      }
    } catch (err) {
      alert("Network error while deleting magazine.");
    }
  };

  const sections = ['All', 'Hindol', 'Deepak', 'Megha', 'Shri', 'Photographs', 'Artwork'];

  const filteredArticles = activeSection === 'All'
    ? FEATURED_ARTICLES
    : FEATURED_ARTICLES.filter(a => a.section === activeSection);

  const latestMagazine = magazines.find(m => m.isLatest) || magazines[0];

  return (
    <div className="pt-28 pb-20 space-y-16">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-uday-crimson/10 text-uday-crimson px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" /> Official Institute Publications
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-uday-midnight">
          Uday Magazine <span className="text-uday-crimson">Archives & Releases</span>
        </h1>
        <p className="text-sm sm:text-base text-uday-midnight/70 max-w-2xl mx-auto leading-relaxed">
          The curated print and digital repository of UDAY Magazine. Read complete editions, download high-resolution PDFs, and explore featured literature and art.
        </p>

        {/* Admin Callout / Status */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-uday-teal hover:text-uday-midnight bg-uday-teal/10 hover:bg-uday-teal/20 px-4 py-2 rounded-xl transition-all border border-uday-teal/20"
          >
            <Lock className="w-3.5 h-3.5" /> Admin: Upload New Magazine PDF
          </Link>

          {adminToken && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-300">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
              <span>Admin Mode Active: Delete Options Enabled</span>
            </div>
          )}
        </div>
      </section>

      {/* Latest Featured Release Spotlight */}
      {latestMagazine && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF9F2] rounded-3xl border border-uday-peach/60 p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
              
              {/* Cover Card */}
              <div className="w-64 sm:w-72 shrink-0 group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-300 group-hover:scale-105 bg-uday-midnight">
                  <img
                    src={latestMagazine.coverImage || '/uday-logo.jpg'}
                    alt={latestMagazine.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase tracking-widest text-uday-peach font-bold">IISER Bhopal</span>
                    <h3 className="font-serif font-black text-2xl">{latestMagazine.title}</h3>
                    <p className="text-xs text-white/80 font-medium">Vol. {latestMagazine.volumeNumber} • {latestMagazine.year}</p>
                  </div>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="flex-1 space-y-5 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="bg-uday-crimson text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Current Edition
                  </span>
                  <span className="bg-uday-sage/20 text-uday-forest text-xs font-semibold px-3 py-1 rounded-full">
                    {latestMagazine.pagesCount} Pages • Full Color
                  </span>
                  <span className="bg-uday-teal/15 text-uday-teal text-xs font-semibold px-3 py-1 rounded-full">
                    Released {latestMagazine.releaseDate || `${latestMagazine.year}`}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-black text-uday-midnight">
                  Volume {latestMagazine.volumeNumber}: <span className="text-uday-crimson">{latestMagazine.title}</span>
                </h2>

                <p className="text-sm sm:text-base text-uday-midnight/80 leading-relaxed font-serif">
                  {latestMagazine.description || latestMagazine.theme}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  {latestMagazine.pdfUrl && latestMagazine.pdfUrl !== '#' ? (
                    <a
                      href={latestMagazine.pdfUrl}
                      download={`Uday-Volume-${latestMagazine.volumeNumber}.pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider shadow-warm hover:opacity-95 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Official PDF
                    </a>
                  ) : (
                    <button
                      onClick={() => alert("Digital copy is available in institute archives.")}
                      className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                    >
                      Archived in Print
                    </button>
                  )}

                  <button
                    onClick={() => setShowEditorLetter(!showEditorLetter)}
                    className="px-5 py-3 rounded-xl border-2 border-uday-teal text-uday-teal hover:bg-uday-teal hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showEditorLetter ? 'Hide Editor’s Note' : 'Read Chief Editor’s Note'}</span>
                  </button>

                  {/* ADMIN DELETE BUTTON ON FEATURED ISSUE */}
                  {adminToken && (
                    <button
                      onClick={() => handleDeleteMagazine(latestMagazine.id, latestMagazine.title)}
                      className="px-5 py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      title="Delete this magazine volume"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span>Delete Volume (Admin)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Expandable Editor's Letter */}
            {showEditorLetter && (
              <div className="mt-8 pt-8 border-t border-uday-peach/40 bg-white/90 p-6 sm:p-8 rounded-2xl animate-fadeIn">
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
        </section>
      )}

      {/* Classical Ragas Section Content for Volume 11 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-uday-peach/40 pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-uday-midnight">Featured Pieces in Volume 11</h3>
            <p className="text-xs sm:text-sm text-uday-midnight/70">Click any card to read the complete prose or poetry inline.</p>
          </div>

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

        {/* Section Info (when Raga selected) */}
        {activeSection !== 'All' && SECTION_DETAILS[activeSection as keyof typeof SECTION_DETAILS] && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-uday-peach/40 flex items-start gap-4 shadow-sm animate-fadeIn">
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              onClick={() => onReadArticle(art)}
              className="bg-white rounded-2xl border border-uday-peach/40 p-6 shadow-sm hover:shadow-xl hover:border-uday-crimson/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-uday-teal/10 text-uday-teal px-2.5 py-0.5 rounded-md">
                    {art.section}
                  </span>
                  <span className="text-xs text-uday-midnight/50 font-medium">
                    {art.language || 'English'} • {art.genre}
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-uday-midnight group-hover:text-uday-crimson transition-colors leading-snug">
                  {art.title}
                </h4>

                <p className="text-xs font-semibold text-uday-orange">
                  by {art.author}
                </p>

                <p className="text-xs sm:text-sm text-uday-midnight/70 line-clamp-3 leading-relaxed font-serif italic">
                  "{art.snippet}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-uday-peach/30 flex items-center justify-between text-xs font-semibold text-uday-crimson group-hover:translate-x-1 transition-transform">
                <span>Read Piece Inline</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Archives of Past Released Volumes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-uday-peach/40">
        <div className="text-center mb-10">
          <h3 className="font-serif text-3xl font-black text-uday-midnight">Complete Magazine Archive</h3>
          <p className="text-sm text-uday-midnight/70">Past volumes preserved in the institute digital library.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {magazines.map(vol => (
            <div
              key={vol.id}
              className="bg-white rounded-2xl border border-uday-peach/40 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div className="space-y-3">
                <div className="relative h-48 rounded-xl overflow-hidden bg-uday-midnight/5 border border-uday-peach/30">
                  <img
                    src={vol.coverImage || '/uday-logo.jpg'}
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
                
                <div className="flex items-center gap-2">
                  {vol.pdfUrl && vol.pdfUrl !== '#' ? (
                    <a
                      href={vol.pdfUrl}
                      download={`Uday-Volume-${vol.volumeNumber}.pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-uday-crimson hover:text-uday-midnight transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Print</span>
                  )}

                  {/* ADMIN DELETE BUTTON ON ARCHIVE CARDS */}
                  {adminToken && (
                    <button
                      onClick={() => handleDeleteMagazine(vol.id, vol.title)}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 text-xs font-bold transition-colors"
                      title="Delete this volume (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
