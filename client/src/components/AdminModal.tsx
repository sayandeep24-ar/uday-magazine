import React, { useState, useEffect } from 'react';
import {
  Lock, X, CheckCircle2, AlertCircle, Shield, Image as ImageIcon,
  Feather, MessageSquare, Download, RefreshCw, Key, LogOut, Check,
  Clock, Trash2, ExternalLink, Mail, FolderUp, PlusCircle
} from 'lucide-react';
import { BlogItem } from './CommunityBlogsSection';
import { GalleryItem } from './ImageGallerySection';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onDataUpdated }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('uday_admin_token'));
  const [usernameInput, setUsernameInput] = useState('udaymag25');
  const [passwordInput, setPasswordInput] = useState('uDAY26deV');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'blogs' | 'gallery' | 'feedback' | 'security' | 'emails'>('blogs');

  // Blog management state
  const [adminBlogs, setAdminBlogs] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);

  // Gallery state
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryArtist, setGalleryArtist] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Photography');
  const [galleryGdriveUrl, setGalleryGdriveUrl] = useState('');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryDesc, setGalleryDesc] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);

  // Feedback state
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [savingWebhook, setSavingWebhook] = useState(false);

  // Email Logs
  const [emailLogs, setEmailLogs] = useState<any[]>([]);

  // Password Change state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStep, setPassStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });
  const [passLoading, setPassLoading] = useState(false);

  // Fetch admin data when logged in
  useEffect(() => {
    if (isOpen && token) {
      loadAllAdminData();
    }
  }, [isOpen, token, activeTab]);

  const loadAllAdminData = async () => {
    if (!token) return;
    try {
      // Blogs
      const resBlogs = await fetch('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resBlogs.ok) {
        const data = await resBlogs.json();
        setAdminBlogs(data.blogs || []);
      }

      // Gallery
      const resGal = await fetch('/api/gallery');
      if (resGal.ok) {
        const data = await resGal.json();
        setGalleryList(data.gallery || []);
      }

      // Feedback
      const resFb = await fetch('/api/admin/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resFb.ok) {
        const data = await resFb.json();
        setFeedbackList(data.feedback || []);
      }

      // Settings
      const resSet = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resSet.ok) {
        const data = await resSet.json();
        if (data.settings?.googleSheetsWebhookUrl) {
          setSheetsWebhookUrl(data.settings.googleSheetsWebhookUrl);
        }
      }

      // Email logs
      const resEmails = await fetch('/api/admin/email-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resEmails.ok) {
        const data = await resEmails.json();
        setEmailLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setToken(data.token);
      localStorage.setItem('uday_admin_token', data.token);
      loadAllAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('uday_admin_token');
  };

  // Blog Actions: Approve, Reject, Extend, Delete
  const handleBlogAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        loadAllAdminData();
        onDataUpdated();
      }
    } catch (err) {
      alert('Action error: ' + err);
    }
  };

  // Gallery Upload / GDrive Sync
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile && !galleryGdriveUrl.trim()) {
      alert('Please select an image file to upload OR provide a Google Drive share link.');
      return;
    }

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append('title', galleryTitle);
      formData.append('artist', galleryArtist);
      formData.append('category', galleryCategory);
      formData.append('description', galleryDesc);
      if (galleryFile) {
        formData.append('image', galleryFile);
      }
      if (galleryGdriveUrl) {
        formData.append('gdriveUrl', galleryGdriveUrl);
      }

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Reset
      setGalleryTitle('');
      setGalleryArtist('');
      setGalleryGdriveUrl('');
      setGalleryDesc('');
      setGalleryFile(null);
      loadAllAdminData();
      onDataUpdated();
      alert('Image added successfully! It is now reflected on the public gallery.');
    } catch (err: any) {
      alert('Gallery update failed: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadAllAdminData();
        onDataUpdated();
      }
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  // Save Google Sheets Webhook URL
  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWebhook(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ googleSheetsWebhookUrl: sheetsWebhookUrl })
      });
      if (res.ok) {
        alert('Google Sheets Webhook URL saved! New feedbacks will stream to your sheet.');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSavingWebhook(false);
    }
  };

  // Password Change Step 1: Request -> Sends OTP to sayandeep.biswas04@gmail.com
  const handleRequestPassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: '', isError: false });

    if (newPass !== confirmPass) {
      setPassMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/admin/request-password-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currPass,
          newPassword: newPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request password change');
      }

      setResetToken(data.resetToken);
      setPassStep('verify');
      setPassMsg({ text: data.message, isError: false });
      loadAllAdminData();
    } catch (err: any) {
      setPassMsg({ text: err.message, isError: true });
    } finally {
      setPassLoading(false);
    }
  };

  // Password Change Step 2: Verify OTP
  const handleConfirmPassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: '', isError: false });

    if (!otpCode.trim()) {
      setPassMsg({ text: 'Please enter the 6-digit confirmation code.', isError: true });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/admin/confirm-password-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: otpCode,
          resetToken
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setPassMsg({ text: data.message, isError: false });
      setPassStep('request');
      setCurrPass('');
      setNewPass('');
      setConfirmPass('');
      setOtpCode('');
      loadAllAdminData();
    } catch (err: any) {
      setPassMsg({ text: err.message, isError: true });
    } finally {
      setPassLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-uday-peach shadow-2xl max-w-5xl w-full my-6 overflow-hidden relative animate-scaleUp flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-uday-midnight p-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-uday-crimson/20 border border-uday-crimson/40 text-uday-crimson flex items-center justify-center">
              <Lock className="w-5 h-5 text-uday-flame" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-white">Uday Editorial & Admin Desk</h3>
                <span className="text-[10px] font-mono bg-uday-crimson text-white px-2 py-0.5 rounded font-bold">
                  udaymag25
                </span>
              </div>
              <p className="text-xs text-uday-peach/80">
                Authorized Notification Desk: <span className="underline">sayandeep.biswas04@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If NOT logged in: Show Login Screen */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-uday-orange/15 text-uday-orange flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-uday-midnight">Admin Authentication</h4>
              <p className="text-xs text-uday-midnight/70">
                Enter your authorized credentials to manage magazine submissions, gallery updates, and Google Sheets feedback.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="udaymag25"
                  className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>

              <div className="p-3 bg-uday-cream rounded-xl border border-uday-peach/40 text-[11px] text-uday-midnight/70">
                <strong>Preset Credentials:</strong> Username: <code className="font-bold text-uday-crimson">udaymag25</code> | Password: <code className="font-bold text-uday-crimson">uDAY26deV</code>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm hover:opacity-95 transition-all"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In: Full Admin Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-60 bg-[#FAF7F2] border-r border-uday-peach/30 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'blogs'
                    ? 'bg-uday-crimson text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/30'
                }`}
              >
                <Feather className="w-4 h-4" />
                <span>Blog Approvals</span>
                {adminBlogs.filter(b => b.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-white text-uday-crimson px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {adminBlogs.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-uday-teal text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/30'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery & GDrive</span>
              </button>

              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'feedback'
                    ? 'bg-uday-orange text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/30'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Google Sheets Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('emails')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'emails'
                    ? 'bg-uday-midnight text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/30'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Notification Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'security'
                    ? 'bg-uday-sage text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/30'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Password & Security</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[75vh]">
              
              {/* TAB 1: BLOGS APPROVAL & 30-DAY EXPIRY */}
              {activeTab === 'blogs' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-uday-midnight">Community Blogs Approval Queue</h4>
                      <p className="text-xs text-uday-midnight/70">
                        Approve submissions to feature them for <strong>30 days</strong> on the public homepage.
                      </p>
                    </div>
                    <button
                      onClick={loadAllAdminData}
                      className="p-1.5 text-gray-500 hover:text-uday-midnight rounded-lg hover:bg-gray-100"
                      title="Refresh"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {adminBlogs.map(blog => {
                      const isPending = blog.status === 'pending';
                      const isApproved = blog.status === 'approved';
                      const isExpired = blog.isExpired;

                      return (
                        <div
                          key={blog.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isPending
                              ? 'bg-amber-50/70 border-amber-300'
                              : isApproved && !isExpired
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  isPending
                                    ? 'bg-amber-200 text-amber-900'
                                    : isApproved && !isExpired
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-gray-200 text-gray-800'
                                }`}>
                                  {isExpired ? 'EXPIRED (30 DAYS ENDED)' : blog.status.toUpperCase()}
                                </span>
                                <span className="text-xs font-semibold text-uday-teal">{blog.category}</span>
                              </div>

                              <h5 className="font-serif text-lg font-bold text-uday-midnight">{blog.title}</h5>
                              <p className="text-xs text-uday-midnight/70 font-medium">
                                By <strong>{blog.author}</strong> ({blog.email}) • Submitted: {new Date(blog.submittedAt).toLocaleDateString()}
                              </p>

                              <p className="text-xs text-uday-midnight/80 italic line-clamp-2 pt-1">
                                "{blog.excerpt}"
                              </p>

                              {isApproved && (
                                <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {isExpired
                                      ? 'Featured period expired'
                                      : `Featured: ${blog.daysRemaining} days remaining (Expires: ${new Date(blog.expiresAt).toLocaleDateString()})`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleBlogAction(blog.id, 'approve')}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Approve (30 Days)
                                  </button>
                                  <button
                                    onClick={() => handleBlogAction(blog.id, 'reject')}
                                    className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-all"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}

                              {isApproved && (
                                <button
                                  onClick={() => handleBlogAction(blog.id, 'extend_30_days')}
                                  className="px-3 py-1.5 bg-uday-teal/15 hover:bg-uday-teal/25 text-uday-teal rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" /> +30 Days Extend
                                </button>
                              )}

                              <button
                                onClick={() => handleBlogAction(blog.id, 'delete')}
                                className="px-3 py-1.5 text-gray-400 hover:text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: GALLERY & GOOGLE DRIVE INTEGRATION */}
              {activeTab === 'gallery' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-uday-peach/30 pb-3">
                    <h4 className="font-serif text-xl font-bold text-uday-midnight">Image Section & Google Drive Sync</h4>
                    <p className="text-xs text-uday-midnight/70">
                      Upload campus photos and student artwork directly OR paste a public Google Drive share link. Updates reflect instantly on the live gallery.
                    </p>
                  </div>

                  {/* Add Image Form */}
                  <form onSubmit={handleGallerySubmit} className="bg-[#FAF7F2] p-5 rounded-2xl border border-uday-peach/50 space-y-4">
                    <h5 className="font-serif font-bold text-sm text-uday-midnight flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-uday-teal" /> Add Image to Gallery
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Image Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sunset over Bhauri Lake"
                          value={galleryTitle}
                          onChange={e => setGalleryTitle(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Artist / Photographer *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pratigya Kujur"
                          value={galleryArtist}
                          onChange={e => setGalleryArtist(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Category</label>
                        <select
                          value={galleryCategory}
                          onChange={e => setGalleryCategory(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                        >
                          <option value="Photography">Photography</option>
                          <option value="Artwork">Artwork</option>
                          <option value="Campus Life">Campus Life</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">
                          Option A: Google Drive Share Link (Auto-Synced)
                        </label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={galleryGdriveUrl}
                          onChange={e => setGalleryGdriveUrl(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                        />
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          Paste any Google Drive image link. It will automatically convert to direct high-res stream!
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">
                          Option B: Direct File Upload
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-1.5 text-xs text-uday-midnight"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-uday-midnight mb-1">Short Description (Optional)</label>
                      <input
                        type="text"
                        placeholder="Context or medium (e.g. Acrylic on canvas, or 50mm f/1.8 lens)"
                        value={galleryDesc}
                        onChange={e => setGalleryDesc(e.target.value)}
                        className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingGallery}
                      className="px-6 py-2.5 bg-uday-teal text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm"
                    >
                      {uploadingGallery ? 'Uploading / Syncing...' : 'Publish Image to Live Gallery'}
                    </button>
                  </form>

                  {/* Existing Gallery List */}
                  <div className="space-y-2">
                    <h5 className="font-serif font-bold text-sm text-uday-midnight">Current Active Images ({galleryList.length})</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {galleryList.map(item => (
                        <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-black">
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-[11px]">
                            <div>
                              <div className="font-bold truncate">{item.title}</div>
                              <div className="text-[10px] text-gray-300">{item.artist}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteGallery(item.id)}
                              className="bg-red-600/90 text-white p-1 rounded hover:bg-red-700 flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FEEDBACK & GOOGLE SHEETS */}
              {activeTab === 'feedback' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-uday-midnight">Google Sheets Feedback Collection</h4>
                      <p className="text-xs text-uday-midnight/70">
                        All student feedbacks and email addresses collected. Sync live with your Google Sheet or download as CSV.
                      </p>
                    </div>

                    <a
                      href="/api/admin/feedback/export-csv"
                      target="_blank"
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Export CSV / Excel
                    </a>
                  </div>

                  {/* Webhook Configuration Form */}
                  <form onSubmit={handleSaveWebhook} className="bg-[#FAF7F2] p-4 rounded-2xl border border-uday-peach/40 space-y-3">
                    <label className="block text-xs font-bold text-uday-midnight uppercase tracking-wider">
                      Google Apps Script Web App Endpoint URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={sheetsWebhookUrl}
                        onChange={e => setSheetsWebhookUrl(e.target.value)}
                        className="flex-1 bg-white border border-uday-peach/60 rounded-xl px-3.5 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                      />
                      <button
                        type="submit"
                        disabled={savingWebhook}
                        className="px-5 py-2 bg-uday-midnight hover:bg-uday-crimson text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                      >
                        {savingWebhook ? 'Saving...' : 'Save Webhook'}
                      </button>
                    </div>
                    <span className="text-[11px] text-uday-midnight/70 block">
                      When provided, every user submission triggers a direct POST request to this Google Apps Script to append rows into your Google Sheet.
                    </span>
                  </form>

                  {/* Feedback Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-uday-cream border-b border-gray-200 text-uday-midnight font-bold">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">User & Email</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Rating</th>
                          <th className="p-3">Feedback Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {feedbackList.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 whitespace-nowrap text-[11px] text-gray-500">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-uday-midnight">{item.name}</div>
                              <div className="text-uday-crimson text-[11px]">{item.email}</div>
                              {item.rollOrDept && <div className="text-gray-400 text-[10px]">{item.rollOrDept}</div>}
                            </td>
                            <td className="p-3 whitespace-nowrap font-medium text-uday-teal">{item.category}</td>
                            <td className="p-3 whitespace-nowrap font-bold text-uday-orange">★ {item.rating}/5</td>
                            <td className="p-3 text-[11px] max-w-xs">{item.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: EMAIL LOGS (VERIFICATION & OTP NOTIFICATIONS) */}
              {activeTab === 'emails' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-uday-peach/30 pb-3">
                    <h4 className="font-serif text-xl font-bold text-uday-midnight">Dispatched Email Notifications Log</h4>
                    <p className="text-xs text-uday-midnight/70">
                      Notifications and verification OTPs dispatched strictly to <strong>sayandeep.biswas04@gmail.com</strong>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {emailLogs.map(log => (
                      <div key={log.id} className="p-4 bg-white rounded-2xl border border-uday-peach/50 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-uday-crimson">{log.subject}</span>
                          <span className="text-[10px] text-gray-400">{new Date(log.sentAt).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <strong>Recipient:</strong> <span className="font-mono text-uday-teal">{log.to}</span>
                        </div>
                        <div
                          className="bg-[#FAF7F2] p-3 rounded-xl text-xs text-gray-800 font-mono border border-gray-100 overflow-x-auto max-h-36"
                          dangerouslySetInnerHTML={{ __html: log.html || log.text }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PASSWORD & SECURITY (STRICT OTP CONFIRMATION) */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-xl mx-auto animate-fadeIn py-2">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-uday-sage/20 text-uday-forest flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif text-xl font-bold text-uday-midnight">Password Change & Security</h4>
                    <p className="text-xs text-uday-midnight/70">
                      Security policy: Confirmation codes are dispatched <strong>strictly to sayandeep.biswas04@gmail.com</strong>.
                    </p>
                  </div>

                  {passMsg.text && (
                    <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                      passMsg.isError
                        ? 'bg-red-50 border border-red-200 text-red-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}>
                      {passMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{passMsg.text}</span>
                    </div>
                  )}

                  {passStep === 'request' ? (
                    <form onSubmit={handleRequestPassChange} className="space-y-4 bg-[#FAF7F2] p-6 rounded-2xl border border-uday-peach/50">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                          Current Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={currPass}
                          onChange={e => setCurrPass(e.target.value)}
                          placeholder="Current password"
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-4 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                          New Password * (Min 6 chars)
                        </label>
                        <input
                          type="password"
                          required
                          value={newPass}
                          onChange={e => setNewPass(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-4 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPass}
                          onChange={e => setConfirmPass(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-4 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                        🛡️ Clicking below will dispatch a 6-digit confirmation code strictly to <strong>sayandeep.biswas04@gmail.com</strong>.
                      </div>

                      <button
                        type="submit"
                        disabled={passLoading}
                        className="w-full py-3 bg-uday-midnight hover:bg-uday-crimson text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        {passLoading ? 'Dispatching Verification...' : 'Send Verification Code to Mail'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmPassChange} className="space-y-4 bg-[#FAF7F2] p-6 rounded-2xl border border-uday-peach/50 animate-fadeIn">
                      <div className="text-center space-y-1">
                        <div className="text-xs font-bold text-uday-crimson uppercase tracking-wider">
                          Step 2: Enter Email Verification Code
                        </div>
                        <p className="text-xs text-uday-midnight/75">
                          A 6-digit code has been sent to <strong>sayandeep.biswas04@gmail.com</strong>. (You can also view it in the Notification Logs tab above).
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 text-center uppercase tracking-wider">
                          6-Digit OTP Code
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="w-full max-w-xs mx-auto block bg-white border-2 border-uday-crimson rounded-xl px-4 py-3 text-center text-xl font-bold font-mono tracking-widest text-uday-midnight focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={passLoading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                      >
                        {passLoading ? 'Verifying & Updating...' : 'Confirm & Update Password'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPassStep('request')}
                        className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
                      >
                        ← Back to Password Entry
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
