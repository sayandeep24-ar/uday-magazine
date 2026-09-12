import React, { useState } from 'react';
import { X, Feather, Sparkles, CheckCircle2, AlertCircle, Send, Info } from 'lucide-react';

interface SubmitBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const SubmitBlogModal: React.FC<SubmitBlogModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Campus Musings');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !author.trim() || !email.trim() || !content.trim()) {
      setErrorMsg('Please fill in Title, Author Name, Email, and Content.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please provide a valid institute or personal email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          email,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          excerpt,
          content,
          coverImage: coverImage.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit blog');
      }

      // Reset form
      setTitle('');
      setAuthor('');
      setEmail('');
      setTags('');
      setCoverImage('');
      setExcerpt('');
      setContent('');
      onSuccess(data.message);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-uday-peach shadow-2xl max-w-2xl w-full my-8 overflow-hidden relative animate-scaleUp">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-uday-crimson via-uday-orange to-uday-peach p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest mb-1">
            <Feather className="w-4 h-4" /> Uday Literary & Student Desk
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Post Your Blog or Story
          </h3>
          <p className="text-xs text-white/90 mt-1 max-w-lg">
            Share your voice with the IISER Bhopal community. Submissions are approved by the editor and featured on our homepage for <strong>30 days</strong>.
          </p>
        </div>

        {/* Review Notice Box */}
        <div className="bg-uday-teal/10 border-b border-uday-teal/20 px-6 py-3 flex items-center gap-2.5 text-xs text-uday-teal">
          <Info className="w-4 h-4 shrink-0 text-uday-teal" />
          <span>
            Upon submission, an email verification will be dispatched to <strong>sayandeep.biswas04@gmail.com</strong> for approval.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Piece Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shadows of the Western Ghats"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Author Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priyadarshini Sen"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Author Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="your.email@iiserb.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              >
                <option value="Campus Musings">Campus Musings</option>
                <option value="Science & Poetry">Science & Poetry</option>
                <option value="Literature">Literature</option>
                <option value="Investigative">Investigative Report</option>
                <option value="Opinion">Opinion & Critique</option>
                <option value="Short Fiction">Short Fiction</option>
                <option value="Hindi/Regional Poetry">Hindi / Regional Poetry</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Nature, Physics, Campus Life"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
              Short Excerpt / Teaser (1-2 sentences)
            </label>
            <input
              type="text"
              placeholder="A brief opening hook that will appear on the blog feed card..."
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
              Full Content *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Write or paste your poetry, article, essay, or thoughts here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3.5 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson font-serif leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-uday-crimson to-uday-orange text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-warm hover:opacity-95 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting & Notifying...' : 'Submit for 30-Day Feature'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
