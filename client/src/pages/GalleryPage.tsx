import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Maximize2, X, ExternalLink, Sparkles, Lock, Trash2, ShieldAlert } from 'lucide-react';
import { GalleryItem } from '../components/ImageGallerySection';

interface GalleryPageProps {
  gallery: GalleryItem[];
  onRefreshGallery?: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, onRefreshGallery }) => {
  const [items, setItems] = useState<GalleryItem[]>(gallery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const adminToken = localStorage.getItem('uday_admin_token');

  useEffect(() => {
    setItems(gallery);
  }, [gallery]);

  const categories = ['All', 'Photography', 'Artwork', 'Campus Life'];

  const filteredGallery = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const handleDeleteImage = async (id: string, title: string) => {
    if (!adminToken) {
      alert("Admin authentication required. Please log into the Admin portal first.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete "${title}" from the gallery?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        alert(`Image "${title}" deleted successfully.`);
        setItems(prev => prev.filter(item => item.id !== id));
        if (lightboxItem?.id === id) {
          setLightboxItem(null);
        }
        if (onRefreshGallery) {
          onRefreshGallery();
        }
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete image.');
      }
    } catch (err) {
      alert('Network error while deleting image.');
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-uday-peach/40 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-teal bg-uday-teal/10 px-3 py-1 rounded-full">
            <Camera className="w-3.5 h-3.5" /> Visual Arts & Campus Photography
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-uday-midnight">
            Campus Gallery & <span className="text-uday-teal">Visual Arts</span>
          </h1>
          <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
            A curated visual chronicle of the IISER Bhopal campus, biological landscapes, seasonal colors, and student fine arts from Volume 11 and ongoing creative submissions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            to="/admin"
            className="flex items-center gap-2 bg-white border-2 border-uday-peach hover:border-uday-teal text-uday-teal text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin: Upload / GDrive Sync</span>
          </Link>

          {adminToken && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-300">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
              <span>Admin Mode: Delete Buttons Enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
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

      {/* Grid */}
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
            
            {/* Admin Delete Button on Card */}
            {adminToken && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(item.id, item.title);
                }}
                className="absolute top-3 left-3 z-20 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
                title="Permanently remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Image</span>
              </button>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity p-5 flex flex-col justify-end text-white pointer-events-none">
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
                <p className="text-xs text-uday-aqua font-semibold">Contributor: {lightboxItem.artist}</p>
                {lightboxItem.description && (
                  <p className="text-xs text-white/70 max-w-2xl mt-1">{lightboxItem.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {adminToken && (
                  <button
                    onClick={() => handleDeleteImage(lightboxItem.id, lightboxItem.title)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Image
                  </button>
                )}

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
        </div>
      )}

    </div>
  );
};
