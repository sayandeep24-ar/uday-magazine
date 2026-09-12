import React, { useState } from 'react';
import { Image as ImageIcon, Camera, Palette, Maximize2, X, ExternalLink, Sparkles, Filter } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  date: string;
  url: string;
  description?: string;
}

interface ImageGallerySectionProps {
  gallery: GalleryItem[];
  onOpenAdmin: () => void;
}

export const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({ gallery, onOpenAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Photography', 'Artwork', 'Campus Life'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-t border-uday-peach/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-teal bg-uday-teal/10 px-3 py-1 rounded-full">
              <Camera className="w-3.5 h-3.5" /> Visual Chronicles & Fine Arts
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-uday-midnight">
              Campus Gallery & <span className="text-uday-teal">Visual Arts</span>
            </h2>
            <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
              Stunning photographic essays, campus landscapes, and student artwork from Volume 11 and ongoing creative initiatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-white border-2 border-uday-peach hover:border-uday-teal text-uday-teal text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin: Add via GDrive / Upload</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-uday-teal text-white shadow-md'
                  : 'bg-white text-uday-midnight/70 border border-uday-peach/40 hover:bg-uday-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-uday-peach/40 bg-black cursor-pointer aspect-[4/3] transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
              
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-uday-peach bg-black/40 px-2 py-0.5 rounded w-fit mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-uday-peach transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  by {item.artist} • {item.date}
                </p>
                {item.description && (
                  <p className="text-[11px] text-white/70 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-4xl w-full bg-uday-midnight rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/50 p-2">
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="p-6 bg-uday-charcoal text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-uday-crimson/30 text-uday-peach px-2.5 py-0.5 rounded">
                      {lightboxItem.category}
                    </span>
                    <span className="text-xs text-white/60">{lightboxItem.date}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">{lightboxItem.title}</h3>
                  <p className="text-xs text-uday-aqua font-semibold">Artist / Photographer: {lightboxItem.artist}</p>
                  {lightboxItem.description && (
                    <p className="text-xs text-white/70 max-w-2xl mt-1">{lightboxItem.description}</p>
                  )}
                </div>

                <a
                  href={lightboxItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Full Resolution
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
