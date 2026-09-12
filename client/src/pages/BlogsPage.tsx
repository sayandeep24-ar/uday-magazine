import React, { useState } from 'react';
import { Feather, Clock, User, Tag, Heart, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { BlogItem } from '../components/CommunityBlogsSection';

interface BlogsPageProps {
  blogs: BlogItem[];
  onOpenSubmit: () => void;
  onReadBlog: (blog: BlogItem) => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ blogs, onOpenSubmit, onReadBlog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const categories = ['All', 'Science & Poetry', 'Campus Musings', 'Literature', 'Investigative', 'Opinion', 'Short Fiction'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-uday-orange/10 text-uday-orange px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
          <Feather className="w-3.5 h-3.5" /> 30-Day Open Community Platform
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-uday-midnight">
          Student Voices & <span className="text-uday-orange">Community Blogs</span>
        </h1>
        <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
          An open platform for IISER Bhopal students, researchers, and campus residents to publish articles, personal reflections, reviews, and poetry. Every approved submission remains prominently featured for <strong>exactly 30 days (1 month)</strong>.
        </p>

        <div className="pt-2">
          <button
            onClick={onOpenSubmit}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-uday-crimson to-uday-orange text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-warm hover:scale-105 transition-all"
          >
            <Feather className="w-4 h-4" /> Post Your Blog Entry
          </button>
        </div>
      </div>

      {/* 30-Day Policy Ribbon */}
      <div className="bg-gradient-to-r from-uday-orange/10 via-uday-peach/20 to-uday-sage/15 border border-uday-orange/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-uday-orange text-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs sm:text-sm font-bold text-uday-midnight">
              Editorial Review & 1-Month Exposure Policy
            </div>
            <div className="text-xs text-uday-midnight/70">
              When submitted, an instant review notice is sent to <strong>sayandeep.biswas04@gmail.com</strong>. Once approved, the piece stays featured on this feed for 30 days.
            </div>
          </div>
        </div>
        <span className="text-[11px] font-bold text-uday-teal bg-white px-3.5 py-1.5 rounded-full border border-uday-peach/50 shrink-0">
          Admin Approved
        </span>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-uday-peach/50 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-uday-midnight placeholder-gray-400 focus:outline-none focus:border-uday-crimson"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-uday-midnight text-white shadow-sm'
                  : 'bg-white text-uday-midnight/70 hover:bg-uday-peach/30 border border-uday-peach/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-uday-peach/40 p-8 space-y-4">
          <Sparkles className="w-10 h-10 text-uday-orange mx-auto opacity-60" />
          <h3 className="font-serif text-xl font-bold text-uday-midnight">No approved blogs in this category currently.</h3>
          <p className="text-xs sm:text-sm text-uday-midnight/70 max-w-md mx-auto">
            Be the first to publish a piece! Submit your article or poem, and once approved by the editorial desk, it will be showcased here for 30 days.
          </p>
          <button
            onClick={onOpenSubmit}
            className="px-5 py-2.5 bg-uday-crimson text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-uday-flame transition-all"
          >
            Post a Blog Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => {
            const daysLeft = blog.daysRemaining ?? 30;
            return (
              <div
                key={blog.id}
                onClick={() => onReadBlog(blog)}
                className="bg-white rounded-2xl border border-uday-peach/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-uday-orange/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {blog.coverImage && (
                    <div className="h-48 overflow-hidden relative bg-uday-peach/20">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <Clock className="w-3 h-3 text-uday-peach animate-pulse" />
                        <span>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-uday-crimson/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {blog.category}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    {!blog.coverImage && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-uday-crimson uppercase tracking-wider bg-uday-crimson/10 px-2.5 py-0.5 rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-[11px] font-bold text-uday-teal flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {daysLeft} days left
                        </span>
                      </div>
                    )}

                    <h3 className="font-serif text-xl font-bold text-uday-midnight group-hover:text-uday-orange transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-uday-midnight/60">
                      <User className="w-3.5 h-3.5 text-uday-teal" />
                      <span className="font-medium text-uday-midnight/80">{blog.author}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-uday-midnight/70 line-clamp-3 leading-relaxed font-serif">
                      {blog.excerpt}
                    </p>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-uday-cream text-uday-teal px-2 py-0.5 rounded-md border border-uday-peach/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-uday-cream/50 border-t border-uday-peach/30 flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => handleLike(blog.id, e)}
                    className="flex items-center gap-1 text-uday-midnight/60 hover:text-uday-crimson transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likes[blog.id] ? 'fill-uday-crimson text-uday-crimson' : ''
                      }`}
                    />
                    <span>{(likes[blog.id] || 0) + 12}</span>
                  </button>

                  <span className="text-uday-orange font-semibold group-hover:underline">
                    Read Entry →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
