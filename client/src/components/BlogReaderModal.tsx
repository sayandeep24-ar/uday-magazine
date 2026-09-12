import React from 'react';
import { X, Clock, User, Calendar, Tag, Heart, Share2 } from 'lucide-react';
import { BlogItem } from './CommunityBlogsSection';

interface BlogReaderModalProps {
  blog: BlogItem | null;
  onClose: () => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({ blog, onClose }) => {
  if (!blog) return null;

  const daysRemaining = blog.daysRemaining ?? 30;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${blog.title} - Uday Community`,
        text: `Read "${blog.title}" by ${blog.author} on Uday Magazine.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-3xl border border-uday-peach shadow-2xl max-w-3xl w-full my-6 overflow-hidden relative animate-scaleUp flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="bg-white/95 backdrop-blur-md border-b border-uday-peach/40 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-uday-orange/15 text-uday-orange px-2.5 py-0.5 rounded-full">
              {blog.category}
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>{daysRemaining} days remaining in feature window</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share piece"
              className="p-2 text-gray-500 hover:text-uday-crimson hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close reader"
              className="p-2 text-gray-500 hover:text-uday-midnight hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-12 overflow-y-auto max-h-[80vh] space-y-6">
          
          {blog.coverImage && (
            <div className="rounded-2xl overflow-hidden max-h-72 w-full mb-6 border border-uday-peach/30 shadow-sm">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-3 text-center border-b border-uday-peach/40 pb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-uday-midnight leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-uday-midnight/70 font-semibold">
              <div className="flex items-center gap-1.5 text-uday-orange">
                <User className="w-4 h-4" />
                <span>By {blog.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-uday-teal">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted {new Date(blog.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-medium bg-white text-uday-teal px-2.5 py-0.5 rounded-full border border-uday-peach/40">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Full Text Content */}
          <div className="prose prose-lg max-w-none text-uday-midnight/85 font-serif text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-line px-2 sm:px-4">
            {blog.content}
          </div>

          {/* 30-Day Expiry Explainer Card */}
          <div className="p-4 bg-gradient-to-r from-uday-orange/10 to-uday-crimson/10 rounded-2xl border border-uday-orange/30 text-xs text-uday-midnight/80 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-uday-midnight">
              <Clock className="w-4 h-4 text-uday-orange" /> 30-Day Open Community Feature Policy
            </div>
            <p className="text-[11px] text-uday-midnight/70 leading-relaxed">
              This submission was approved by the Uday editorial board. It will remain featured for 30 days from approval date, giving student writers continuous rotating visibility across the campus community.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
