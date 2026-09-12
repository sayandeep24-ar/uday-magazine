import React from 'react';
import { X, BookOpen, User, Bookmark, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Article } from '../data/publicationData';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  onPrev,
  onNext
}) => {
  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${article.title} - Uday Magazine`,
        text: `Read "${article.title}" by ${article.author} in Uday Magazine.`,
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
        
        {/* Top Floating Control Bar */}
        <div className="bg-white/95 backdrop-blur-md border-b border-uday-peach/40 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-uday-crimson/10 text-uday-crimson px-2.5 py-0.5 rounded-full">
              {article.section}
            </span>
            <span className="text-xs text-uday-midnight/60 font-semibold">
              {article.genre} {article.pageNumber ? `• Page ${article.pageNumber}` : ''}
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

        {/* Reader Article Body */}
        <div className="p-6 sm:p-12 overflow-y-auto max-h-[80vh] space-y-6">
          <div className="space-y-3 text-center border-b border-uday-peach/40 pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-uday-midnight leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-2 text-sm text-uday-orange font-semibold">
              <User className="w-4 h-4" />
              <span>by {article.author}</span>
            </div>

            <div className="text-xs text-uday-teal font-medium">
              Published in Uday Volume 11 (2024): The Ascent
            </div>
          </div>

          {/* Text Content */}
          <div className="prose prose-lg max-w-none text-uday-midnight/85 font-serif text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-line px-2 sm:px-6">
            {article.fullText}
          </div>

          {/* Footnote / Signature */}
          <div className="pt-8 border-t border-uday-peach/40 text-center space-y-2">
            <div className="font-serif italic text-xs text-uday-midnight/60">
              UDAY Magazine • The Ascent (IISER Bhopal)
            </div>
            <div className="text-[11px] text-uday-teal">
              © 2024 UDAY. Contributed by the student body.
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white/95 border-t border-uday-peach/40 px-6 py-3 flex items-center justify-between text-xs font-semibold shrink-0">
          {onPrev ? (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 text-uday-midnight/70 hover:text-uday-crimson transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous Piece
            </button>
          ) : <div />}

          {onNext ? (
            <button
              onClick={onNext}
              className="flex items-center gap-1 text-uday-midnight/70 hover:text-uday-crimson transition-colors"
            >
              Next Piece <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : <div />}
        </div>

      </div>
    </div>
  );
};
