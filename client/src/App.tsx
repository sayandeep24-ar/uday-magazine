import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MagazinesPage } from './pages/MagazinesPage';
import { BlogsPage } from './pages/BlogsPage';
import { GalleryPage } from './pages/GalleryPage';
import { EventsPage } from './pages/EventsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { SubmitBlogModal } from './components/SubmitBlogModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { BlogReaderModal } from './components/BlogReaderModal';
import { BlogItem } from './components/CommunityBlogsSection';
import { GalleryItem } from './components/ImageGallerySection';
import { Article, FEATURED_ARTICLES } from './data/publicationData';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { RenderWakeupLanding } from './components/RenderWakeupLanding';

// Scroll to top automatically on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const [hasEnteredPortal, setHasEnteredPortal] = useState<boolean>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.has('entered') || searchParams.has('portal') || sessionStorage.getItem('uday_entered') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('entered') || searchParams.has('portal')) {
      try {
        sessionStorage.setItem('uday_entered', '1');
      } catch {}
      if (!hasEnteredPortal) setHasEnteredPortal(true);
    }
  }, [location.search, hasEnteredPortal]);

  const isExplicitLanding = location.pathname === '/landing';
  const showLanding = isExplicitLanding || (location.pathname === '/' && !hasEnteredPortal);
  // Global data states
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<{ upcoming: any[]; past: any[] }>({ upcoming: [], past: [] });

  // Modals state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 6000);
  };

  const fetchData = async () => {
    try {
      // Blogs
      const resBlogs = await fetch('/api/blogs');
      if (resBlogs.ok) {
        const data = await resBlogs.json();
        setBlogs(data.blogs || []);
      }

      // Gallery
      const resGal = await fetch('/api/gallery');
      if (resGal.ok) {
        const data = await resGal.json();
        setGallery(data.gallery || []);
      }

      // Announcements
      const resAnn = await fetch('/api/announcements');
      if (resAnn.ok) {
        const data = await resAnn.json();
        setAnnouncements(data.announcements || []);
      }

      // Events
      const resEv = await fetch('/api/events');
      if (resEv.ok) {
        const data = await resEv.json();
        setEvents(data.events || { upcoming: [], past: [] });
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Article navigation in reader
  const handleNextArticle = () => {
    if (!selectedArticle) return;
    const currentIndex = FEATURED_ARTICLES.findIndex(a => a.id === selectedArticle.id);
    if (currentIndex < FEATURED_ARTICLES.length - 1) {
      setSelectedArticle(FEATURED_ARTICLES[currentIndex + 1]);
    }
  };

  const handlePrevArticle = () => {
    if (!selectedArticle) return;
    const currentIndex = FEATURED_ARTICLES.findIndex(a => a.id === selectedArticle.id);
    if (currentIndex > 0) {
      setSelectedArticle(FEATURED_ARTICLES[currentIndex - 1]);
    }
  };

  if (showLanding) {
    return (
      <RenderWakeupLanding
        onEnter={() => {
          try {
            sessionStorage.setItem('uday_entered', '1');
          } catch {}
          setHasEnteredPortal(true);
        }}
        targetPath="/"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#141E28]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-scaleUp max-w-md">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 ${
            toast.isError
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-uday-midnight text-white border-uday-orange'
          }`}>
            {toast.isError ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-uday-peach shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm leading-relaxed">
              {toast.text}
            </div>
          </div>
        </div>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        onOpenSubmitBlog={() => setIsSubmitOpen(true)}
        announcements={announcements}
      />

      {/* Multi-Page Routes */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenSubmitBlog={() => setIsSubmitOpen(true)}
                blogs={blogs}
                gallery={gallery}
                events={events}
                onReadBlog={(blog) => setSelectedBlog(blog)}
              />
            }
          />

          <Route
            path="/landing"
            element={
              <RenderWakeupLanding targetPath="/" />
            }
          />

          <Route
            path="/magazines"
            element={
              <MagazinesPage
                onReadArticle={(article) => setSelectedArticle(article)}
              />
            }
          />

          <Route
            path="/blogs"
            element={
              <BlogsPage
                blogs={blogs}
                onOpenSubmit={() => setIsSubmitOpen(true)}
                onReadBlog={(blog) => setSelectedBlog(blog)}
              />
            }
          />

          <Route
            path="/gallery"
            element={
              <GalleryPage gallery={gallery} onRefreshGallery={fetchData} />
            }
          />

          <Route
            path="/events"
            element={
              <EventsPage events={events} />
            }
          />

          <Route
            path="/feedback"
            element={
              <FeedbackPage />
            }
          />

          <Route
            path="/contact"
            element={
              <ContactPage />
            }
          />

          <Route
            path="/admin"
            element={
              <AdminPage />
            }
          />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer
        onOpenSubmit={() => setIsSubmitOpen(true)}
      />

      {/* Modals */}
      <SubmitBlogModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          fetchData();
        }}
      />

      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onNext={handleNextArticle}
        onPrev={handlePrevArticle}
      />

      <BlogReaderModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />

    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
