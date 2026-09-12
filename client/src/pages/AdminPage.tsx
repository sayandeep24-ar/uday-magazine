import React, { useState, useEffect } from 'react';
import {
  Lock, Shield, BookOpen, Feather, Image as ImageIcon, MessageSquare,
  Key, LogOut, Check, Clock, Trash2, ExternalLink, Mail, FolderUp,
  PlusCircle, Download, RefreshCw, AlertCircle, CheckCircle2, Upload, FileText,
  Users, UserCheck, Edit3, Plus, Save, Phone, MapPin
} from 'lucide-react';
import { GalleryItem } from '../components/ImageGallerySection';
import { EDITORIAL_BOARD, TeamAndContact, LeadTeamMember } from '../data/publicationData';

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('uday_admin_token'));
  
  // Login input fields start COMPLETELY BLANK for security
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'magazines' | 'blogs' | 'gallery' | 'team' | 'feedback' | 'security' | 'emails'>('magazines');

  // Magazine PDF Upload State
  const [magVolume, setMagVolume] = useState('');
  const [magYear, setMagYear] = useState('');
  const [magTitle, setMagTitle] = useState('');
  const [magTheme, setMagTheme] = useState('');
  const [magEditor, setMagEditor] = useState('');
  const [magPages, setMagPages] = useState('');
  const [magDesc, setMagDesc] = useState('');
  const [magPdfFile, setMagPdfFile] = useState<File | null>(null);
  const [magPdfUrl, setMagPdfUrl] = useState('');
  const [magCoverFile, setMagCoverFile] = useState<File | null>(null);
  const [magCoverUrl, setMagCoverUrl] = useState('');
  const [magazinesList, setMagazinesList] = useState<any[]>([]);
  const [uploadingMagazine, setUploadingMagazine] = useState(false);

  // Blog management state
  const [adminBlogs, setAdminBlogs] = useState<any[]>([]);

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
 
  // Directory, Faculty Advisor, and Team Management state
  const [teamData, setTeamData] = useState<TeamAndContact>(EDITORIAL_BOARD);
  const [savingTeam, setSavingTeam] = useState(false);
  const [teamSuccessMsg, setTeamSuccessMsg] = useState('');

  // Sub-teams textarea string states (line-delimited for easy editing)
  const [englishText, setEnglishText] = useState(EDITORIAL_BOARD.editorialEnglish.join('\n'));
  const [hindiText, setHindiText] = useState(EDITORIAL_BOARD.editorialHindi.join('\n'));
  const [reportersText, setReportersText] = useState(EDITORIAL_BOARD.reporters.join('\n'));
  const [designersText, setDesignersText] = useState(EDITORIAL_BOARD.designers.join('\n'));
  const [advisorsText, setAdvisorsText] = useState(EDITORIAL_BOARD.studentAdvisors.join('\n'));

  // Add new lead member modal/form state
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadRole, setNewLeadRole] = useState('');
  const [newLeadMajor, setNewLeadMajor] = useState('');
  const [newLeadBio, setNewLeadBio] = useState('');

  useEffect(() => {
    if (token) {
      fetch('/api/admin/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            handleLogout();
          } else {
            loadAllAdminData();
          }
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token, activeTab]);

  const loadAllAdminData = async () => {
    if (!token) return;
    try {
      // Magazines
      const resMag = await fetch('/api/magazines');
      if (resMag.ok) {
        const data = await resMag.json();
        setMagazinesList(data.magazines || []);
      }

      // Blogs
      const resBlogs = await fetch('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resBlogs.status === 401) {
        handleLogout();
        return;
      }
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
      if (resFb.status === 401) {
        handleLogout();
        return;
      }
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

      // Directory & Team Data
      const resTeam = await fetch('/api/team');
      if (resTeam.ok) {
        const data = await resTeam.json();
        if (data.teamAndContact) {
          setTeamData(data.teamAndContact);
          setEnglishText((data.teamAndContact.editorialEnglish || []).join('\n'));
          setHindiText((data.teamAndContact.editorialHindi || []).join('\n'));
          setReportersText((data.teamAndContact.reporters || []).join('\n'));
          setDesignersText((data.teamAndContact.designers || []).join('\n'));
          setAdvisorsText((data.teamAndContact.studentAdvisors || []).join('\n'));
        }
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
        throw new Error(data.error || 'Invalid credentials');
      }

      setToken(data.token);
      localStorage.setItem('uday_admin_token', data.token);
      setUsernameInput('');
      setPasswordInput('');
      loadAllAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('uday_admin_token');
  };

  // Team Directory Management Handlers
  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTeam(true);
    setTeamSuccessMsg('');
    try {
      const payload: TeamAndContact = {
        ...teamData,
        editorialEnglish: englishText.split('\n').map(s => s.trim()).filter(Boolean),
        editorialHindi: hindiText.split('\n').map(s => s.trim()).filter(Boolean),
        reporters: reportersText.split('\n').map(s => s.trim()).filter(Boolean),
        designers: designersText.split('\n').map(s => s.trim()).filter(Boolean),
        studentAdvisors: advisorsText.split('\n').map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update directory');

      setTeamData(resData.teamAndContact);
      setTeamSuccessMsg('Team directory, faculty advisor, and contact details successfully saved and updated!');
      setTimeout(() => setTeamSuccessMsg(''), 5000);
    } catch (err: any) {
      alert('Error updating team directory: ' + err.message);
    } finally {
      setSavingTeam(false);
    }
  };

  const handleAddLeadMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadRole.trim()) {
      alert('Please enter at least member Name and Role.');
      return;
    }
    const newMember: LeadTeamMember = {
      id: `lead-${Date.now()}`,
      name: newLeadName.trim(),
      role: newLeadRole.trim(),
      major: newLeadMajor.trim() || 'Student Contributor',
      bio: newLeadBio.trim() || 'Editorial team member.'
    };
    setTeamData(prev => ({
      ...prev,
      leadTeam: [...prev.leadTeam, newMember]
    }));
    setNewLeadName('');
    setNewLeadRole('');
    setNewLeadMajor('');
    setNewLeadBio('');
    setShowAddLead(false);
  };

  const handleDeleteLeadMember = (idOrIndex: string | number) => {
    if (!confirm('Are you sure you want to remove this lead member?')) return;
    setTeamData(prev => ({
      ...prev,
      leadTeam: prev.leadTeam.filter((m, idx) => (m.id ? m.id !== idOrIndex : idx !== idOrIndex))
    }));
  };

  // Magazine PDF Upload
  const handleMagazineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magPdfFile && !magPdfUrl.trim()) {
      alert('Please upload a PDF document OR provide a Google Drive / cloud PDF link.');
      return;
    }

    setUploadingMagazine(true);
    try {
      const formData = new FormData();
      formData.append('volumeNumber', magVolume);
      formData.append('year', magYear);
      formData.append('title', magTitle);
      formData.append('theme', magTheme);
      formData.append('editorInChief', magEditor);
      formData.append('pagesCount', magPages);
      formData.append('description', magDesc);
      if (magPdfFile) formData.append('pdf', magPdfFile);
      if (magPdfUrl) formData.append('pdfUrl', magPdfUrl);
      if (magCoverFile) formData.append('cover', magCoverFile);
      if (magCoverUrl) formData.append('coverImageUrl', magCoverUrl);

      const res = await fetch('/api/magazines', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to release magazine');
      }

      // Reset form
      setMagVolume('');
      setMagYear('');
      setMagTitle('');
      setMagTheme('');
      setMagEditor('');
      setMagPages('');
      setMagDesc('');
      setMagPdfFile(null);
      setMagPdfUrl('');
      setMagCoverFile(null);
      setMagCoverUrl('');

      loadAllAdminData();
      alert('New Magazine Edition & PDF published! It is now live on the /magazines page.');
    } catch (err: any) {
      alert('Publication error: ' + err.message);
    } finally {
      setUploadingMagazine(false);
    }
  };

  const handleDeleteMagazine = async (id: string) => {
    if (!confirm('Are you sure you want to remove this magazine release?')) return;
    try {
      const res = await fetch(`/api/magazines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) loadAllAdminData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Blog Actions
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
      if (res.ok) loadAllAdminData();
    } catch (err) {
      alert('Action error');
    }
  };

  // Gallery Upload
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile && !galleryGdriveUrl.trim()) {
      alert('Please upload an image file OR enter a Google Drive link.');
      return;
    }

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append('title', galleryTitle);
      formData.append('artist', galleryArtist);
      formData.append('category', galleryCategory);
      formData.append('description', galleryDesc);
      if (galleryFile) formData.append('image', galleryFile);
      if (galleryGdriveUrl) formData.append('gdriveUrl', galleryGdriveUrl);

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setGalleryTitle('');
      setGalleryArtist('');
      setGalleryGdriveUrl('');
      setGalleryDesc('');
      setGalleryFile(null);
      loadAllAdminData();
      alert('Image added to gallery!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this image from the gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) loadAllAdminData();
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  // Google Sheets Webhook
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
      if (res.ok) alert('Google Sheets Webhook URL saved!');
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSavingWebhook(false);
    }
  };

  // Password Change Step 1: Dispatches OTP strictly to sayandeep.biswas04@gmail.com
  const handleRequestPassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: '', isError: false });

    if (newPass !== confirmPass) {
      setPassMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ text: 'Password must be at least 6 characters.', isError: true });
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
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

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

  // Password Change Step 2: Confirm OTP
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
        body: JSON.stringify({ code: otpCode, resetToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

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

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* NOT LOGGED IN: SECURE LOGIN FORM */}
      {!token ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-uday-peach/60 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-uday-crimson/10 text-uday-crimson flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-black text-uday-midnight">Admin Authentication</h1>
            <p className="text-xs text-uday-midnight/70">
              Sign in to manage magazine PDF releases, community blog approvals, and image galleries.
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
                autoComplete="off"
                placeholder="Enter admin username"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm hover:opacity-95 transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>
        </div>
      ) : (
        /* LOGGED IN: FULL ADMIN DASHBOARD */
        <div className="bg-white rounded-3xl border border-uday-peach/60 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
          
          {/* Top Admin Banner */}
          <div className="bg-uday-midnight p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-uday-crimson/20 border border-uday-crimson/40 text-uday-crimson flex items-center justify-center">
                <Lock className="w-5 h-5 text-uday-flame" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Uday Editorial Control Desk</h2>
                <p className="text-xs text-uday-peach/80">
                  Notification & Verification Desk: <span className="underline">sayandeep.biswas04@gmail.com</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-[#FAF7F2] border-r border-uday-peach/30 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('magazines')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'magazines'
                    ? 'bg-uday-crimson text-white shadow-warm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Magazine PDF Releases</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'blogs'
                    ? 'bg-uday-crimson text-white shadow-warm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <Feather className="w-4 h-4" />
                <span>Blog Approvals (30d)</span>
                {adminBlogs.filter(b => b.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-white text-uday-crimson px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {adminBlogs.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-uday-teal text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery & GDrive</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'team'
                    ? 'bg-uday-forest text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Directory & Contacts</span>
              </button>

              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'feedback'
                    ? 'bg-uday-orange text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Google Sheets Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('emails')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'emails'
                    ? 'bg-uday-midnight text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Notification Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'security'
                    ? 'bg-uday-sage text-white shadow-sm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Password & Security</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[750px]">
              
              {/* TAB 1: MAGAZINE PDF RELEASES */}
              {activeTab === 'magazines' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b border-uday-peach/30 pb-3">
                    <h3 className="font-serif text-2xl font-bold text-uday-midnight">Publish New Magazine Issue & PDF</h3>
                    <p className="text-xs text-uday-midnight/70">
                      When a new volume of Uday is released, upload the official PDF and cover artwork here. It will immediately appear in the <a href="/magazines" className="text-uday-crimson underline">Magazines</a> library for public downloading.
                    </p>
                  </div>

                  {/* Upload Form */}
                  <form onSubmit={handleMagazineSubmit} className="bg-[#FAF7F2] p-6 rounded-3xl border border-uday-peach/50 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Volume Number *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 12"
                          value={magVolume}
                          onChange={e => setMagVolume(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Release Year *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 2025"
                          value={magYear}
                          onChange={e => setMagYear(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Issue Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ethereal Horizons"
                          value={magTitle}
                          onChange={e => setMagTitle(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Theme / Concept</label>
                        <input
                          type="text"
                          placeholder="e.g. Changing Seasons, Climate & Hope"
                          value={magTheme}
                          onChange={e => setMagTheme(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Editor-in-Chief</label>
                        <input
                          type="text"
                          placeholder="e.g. Editorial Board"
                          value={magEditor}
                          onChange={e => setMagEditor(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>
                    </div>

                    {/* PDF File / Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-2xl border border-uday-peach/40">
                      <div>
                        <label className="block text-xs font-bold text-uday-crimson mb-1 uppercase tracking-wider flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Option 1: Upload Magazine PDF File (.pdf)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={e => setMagPdfFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3 py-1.5 text-xs text-uday-midnight"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-crimson mb-1 uppercase tracking-wider flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> Option 2: Public PDF / Google Drive Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={magPdfUrl}
                          onChange={e => setMagPdfUrl(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Cover Image File</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setMagCoverFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-1.5 text-xs text-uday-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Cover Image URL (Alternative)</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={magCoverUrl}
                          onChange={e => setMagCoverUrl(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Description / Overview</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed background of the issue..."
                        value={magDesc}
                        onChange={e => setMagDesc(e.target.value)}
                        className="w-full bg-white border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingMagazine}
                      className="px-6 py-3 bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm hover:opacity-95 transition-all"
                    >
                      {uploadingMagazine ? 'Uploading & Releasing Issue...' : 'Release & Publish Magazine PDF'}
                    </button>
                  </form>

                  {/* Existing Magazines List */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-lg text-uday-midnight">Published Magazine Releases ({magazinesList.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {magazinesList.map(mag => (
                        <div key={mag.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-uday-peach/40 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 rounded-lg bg-uday-midnight overflow-hidden shrink-0">
                              <img src={mag.coverImage || '/uday-logo.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-uday-crimson uppercase">Vol {mag.volumeNumber} • {mag.year}</span>
                              <h5 className="font-serif font-bold text-sm text-uday-midnight">{mag.title}</h5>
                              <span className="text-[11px] text-gray-500">{mag.pagesCount} Pages</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {mag.pdfUrl && (
                              <a href={mag.pdfUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-uday-teal hover:text-uday-midnight bg-white rounded-lg border border-gray-200 text-xs font-bold flex items-center gap-1.5" title="View PDF">
                                <FileText className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteMagazine(mag.id)}
                              className="px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                              title="Delete this magazine volume"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Issue</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMMUNITY BLOGS */}
              {activeTab === 'blogs' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-uday-peach/30 pb-3">
                    <h3 className="font-serif text-2xl font-bold text-uday-midnight">Community Blogs Approval Queue</h3>
                    <p className="text-xs text-uday-midnight/70">
                      Submissions from students and researchers. Approved pieces stay live for <strong>30 days</strong>.
                    </p>
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
                                  {isExpired ? 'EXPIRED (30 DAYS COMPLETED)' : blog.status.toUpperCase()}
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

              {/* TAB 3: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-uday-peach/30 pb-3">
                    <h3 className="font-serif text-2xl font-bold text-uday-midnight">Gallery & Google Drive Sync</h3>
                    <p className="text-xs text-uday-midnight/70">
                      Upload photos or paste a public Google Drive share link to reflect live on the gallery.
                    </p>
                  </div>

                  <form onSubmit={handleGallerySubmit} className="bg-[#FAF7F2] p-5 rounded-2xl border border-uday-peach/50 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Image Title *</label>
                        <input
                          type="text"
                          required
                          value={galleryTitle}
                          onChange={e => setGalleryTitle(e.target.value)}
                          placeholder="e.g. Campus Amphitheatre"
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Artist / Photographer *</label>
                        <input
                          type="text"
                          required
                          value={galleryArtist}
                          onChange={e => setGalleryArtist(e.target.value)}
                          placeholder="e.g. Pratigya Kujur"
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
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Option A: Google Drive Share Link</label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={galleryGdriveUrl}
                          onChange={e => setGalleryGdriveUrl(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Option B: Direct File Upload</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-1.5 text-xs text-uday-midnight"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingGallery}
                      className="px-6 py-2.5 bg-uday-teal text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm"
                    >
                      {uploadingGallery ? 'Uploading...' : 'Publish Image to Gallery'}
                    </button>
                  </form>

                  {/* Gallery items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryList.map(item => (
                      <div key={item.id} className="bg-white rounded-2xl border border-uday-peach/60 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                        <div className="relative h-40 bg-black overflow-hidden group">
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-2 left-2 bg-black/75 text-uday-peach text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-3 space-y-2.5">
                          <div>
                            <h5 className="font-serif font-bold text-sm text-uday-midnight truncate" title={item.title}>
                              {item.title}
                            </h5>
                            <p className="text-[11px] text-uday-midnight/60 truncate">
                              by {item.artist}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteGallery(item.id)}
                            className="w-full py-2 px-3 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            title="Permanently remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Image</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: EDITORIAL DIRECTORY, FACULTY ADVISOR & CONTACTS */}
              {activeTab === 'team' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Tab Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-uday-peach/30 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-forest bg-uday-sage/15 px-3 py-1 rounded-full mb-1">
                        <Users className="w-3.5 h-3.5" /> Team & Contact Management
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-uday-midnight">Editorial Directory & Faculty Advisor</h3>
                      <p className="text-xs text-uday-midnight/70">
                        Update faculty advisor when tenure ends, manage lead editors, contributor rosters, and official contact details.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveTeam}
                      disabled={savingTeam}
                      className="px-6 py-2.5 bg-gradient-to-r from-uday-crimson to-uday-orange text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-warm flex items-center gap-2 shrink-0 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingTeam ? 'Saving...' : 'Save & Publish Changes'}</span>
                    </button>
                  </div>

                  {/* Success Alert */}
                  {teamSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{teamSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveTeam} className="space-y-8">
                    
                    {/* SECTION 1: FACULTY ADVISOR (TENURE TRANSITION) */}
                    <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-uday-crimson/10 text-uday-crimson flex items-center justify-center font-bold">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-uday-midnight">Faculty Advisor Details</h4>
                            <p className="text-xs text-uday-midnight/60">Update mentor information whenever faculty tenure transitions occur.</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-uday-crimson/10 text-uday-crimson px-2.5 py-1 rounded-full">
                          Institute Mentor
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Faculty Advisor Full Name</label>
                          <input
                            type="text"
                            required
                            value={teamData.facultyAdvisor?.name || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              facultyAdvisor: { ...prev.facultyAdvisor, name: e.target.value }
                            }))}
                            placeholder="e.g. Dr. Renny Thomas"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Advisor Designation / Title</label>
                          <input
                            type="text"
                            value={teamData.facultyAdvisor?.designation || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              facultyAdvisor: { ...prev.facultyAdvisor, designation: e.target.value }
                            }))}
                            placeholder="e.g. Faculty Advisor / Mentor"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Institute Email Address</label>
                          <input
                            type="email"
                            required
                            value={teamData.facultyAdvisor?.email || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              facultyAdvisor: { ...prev.facultyAdvisor, email: e.target.value }
                            }))}
                            placeholder="e.g. renny@iiserb.ac.in"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Tenure Period / Status</label>
                          <input
                            type="text"
                            value={teamData.facultyAdvisor?.tenure || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              facultyAdvisor: { ...prev.facultyAdvisor, tenure: e.target.value }
                            }))}
                            placeholder="e.g. Current (2023–Present) or 2024–2026"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Department / Affiliation</label>
                          <input
                            type="text"
                            value={teamData.facultyAdvisor?.department || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              facultyAdvisor: { ...prev.facultyAdvisor, department: e.target.value }
                            }))}
                            placeholder="e.g. Assistant Professor, Department of Humanities and Social Sciences (HSS), IISER Bhopal"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PORTAL & WEB LEAD (SOURADIP) */}
                    <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-uday-orange/15 text-uday-orange flex items-center justify-center font-bold">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-uday-midnight">Portal & Web Lead</h4>
                            <p className="text-xs text-uday-midnight/60">Digital release architecture & portal maintainer (Assigned to Souradip).</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-uday-orange/15 text-uday-orange px-2.5 py-1 rounded-full">
                          Web Lead
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Web Lead Name</label>
                          <input
                            type="text"
                            required
                            value={teamData.portalWebLead?.name || 'Souradip'}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              portalWebLead: { ...prev.portalWebLead, name: e.target.value }
                            }))}
                            placeholder="Souradip"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-orange font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Role Title</label>
                          <input
                            type="text"
                            value={teamData.portalWebLead?.role || 'Portal & Web Lead'}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              portalWebLead: { ...prev.portalWebLead, role: e.target.value }
                            }))}
                            placeholder="Portal & Web Lead"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-orange"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Contact Email</label>
                          <input
                            type="email"
                            value={teamData.portalWebLead?.email || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              portalWebLead: { ...prev.portalWebLead, email: e.target.value }
                            }))}
                            placeholder="sayandeep.biswas04@gmail.com"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-orange"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Bio / Role Description</label>
                          <input
                            type="text"
                            value={teamData.portalWebLead?.bio || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              portalWebLead: { ...prev.portalWebLead, bio: e.target.value }
                            }))}
                            placeholder="Oversees the web architecture, digital publications, and portal infrastructure for UDAY Magazine."
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-orange"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: OFFICIAL CONTACT & ADDRESS */}
                    <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-uday-teal/10 text-uday-teal flex items-center justify-center font-bold">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-uday-midnight">Official Contact & Office Details</h4>
                            <p className="text-xs text-uday-midnight/60">Magazine email, telephone, campus room, and mailing address.</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-uday-teal/10 text-uday-teal px-2.5 py-1 rounded-full">
                          Contact Info
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Official Magazine Email</label>
                          <input
                            type="email"
                            required
                            value={teamData.contactDetails?.officialEmail || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              contactDetails: { ...prev.contactDetails, officialEmail: e.target.value }
                            }))}
                            placeholder="udaymagz@iiserb.ac.in"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Telephone / Desk Number</label>
                          <input
                            type="text"
                            value={teamData.contactDetails?.contactPhone || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              contactDetails: { ...prev.contactDetails, contactPhone: e.target.value }
                            }))}
                            placeholder="+91 (0755) 269-2400"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Office Room / Location</label>
                          <input
                            type="text"
                            value={teamData.contactDetails?.officeRoom || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              contactDetails: { ...prev.contactDetails, officeRoom: e.target.value }
                            }))}
                            placeholder="Institute Magazine Office, SAC Building, IISER Bhopal"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Consultation / Meeting Hours</label>
                          <input
                            type="text"
                            value={teamData.contactDetails?.consultationHours || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              contactDetails: { ...prev.contactDetails, consultationHours: e.target.value }
                            }))}
                            placeholder="Mon-Fri, 4:00 PM – 6:00 PM"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Full Campus Postal Address</label>
                          <textarea
                            rows={2}
                            value={teamData.contactDetails?.campusLocation || ''}
                            onChange={e => setTeamData(prev => ({
                              ...prev,
                              contactDetails: { ...prev.contactDetails, campusLocation: e.target.value }
                            }))}
                            placeholder="Indian Institute of Science Education and Research (IISER) Bhopal, Bhopal Bypass Road, Bhauri, Bhopal - 462066, Madhya Pradesh, India"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-teal leading-relaxed"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: LEAD EDITORIAL BOARD MEMBERS */}
                    <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-uday-peach/30 pb-3">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-uday-midnight">
                            Lead Editorial Board Members ({teamData.leadTeam?.length || 0})
                          </h4>
                          <p className="text-xs text-uday-midnight/60">
                            Chief Editors, Section Heads, and Core Team shown prominently on the public contact page.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddLead(!showAddLead)}
                          className="px-4 py-2 bg-uday-teal text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all self-start sm:self-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddLead ? 'Cancel' : 'Add New Member'}</span>
                        </button>
                      </div>

                      {/* ADD NEW LEAD MEMBER DRAWER */}
                      {showAddLead && (
                        <div className="bg-uday-cream/60 border border-uday-peach/80 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn">
                          <h5 className="font-serif text-sm font-bold text-uday-midnight">Add New Board / Lead Member</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-uday-midnight mb-1">Member Name *</label>
                              <input
                                type="text"
                                placeholder="e.g. Souradip Pal"
                                value={newLeadName}
                                onChange={e => setNewLeadName(e.target.value)}
                                className="w-full bg-white border border-uday-peach/70 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-uday-midnight mb-1">Role / Position *</label>
                              <input
                                type="text"
                                placeholder="e.g. Portal & Web Lead / Co-Editor"
                                value={newLeadRole}
                                onChange={e => setNewLeadRole(e.target.value)}
                                className="w-full bg-white border border-uday-peach/70 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-uday-midnight mb-1">Major / Discipline</label>
                              <input
                                type="text"
                                placeholder="e.g. Physics Major / BS-MS"
                                value={newLeadMajor}
                                onChange={e => setNewLeadMajor(e.target.value)}
                                className="w-full bg-white border border-uday-peach/70 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-bold text-uday-midnight mb-1">Short Bio</label>
                              <input
                                type="text"
                                placeholder="Short sentence describing focus, literary interests, or contributions..."
                                value={newLeadBio}
                                onChange={e => setNewLeadBio(e.target.value)}
                                className="w-full bg-white border border-uday-peach/70 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={handleAddLeadMember}
                              className="px-4 py-2 bg-uday-crimson text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add to Lead Roster
                            </button>
                          </div>
                        </div>
                      )}

                      {/* CURRENT MEMBERS GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(teamData.leadTeam || []).map((member, idx) => (
                          <div
                            key={member.id || idx}
                            className="bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-4 space-y-2.5 relative group hover:border-uday-crimson/50 transition-all"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-uday-crimson bg-white px-2 py-0.5 rounded border border-uday-peach/50">
                                #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteLeadMember(member.id || idx)}
                                className="text-red-500 hover:text-red-700 bg-white p-1 rounded-lg border border-red-200 hover:bg-red-50 text-xs flex items-center gap-1 transition-colors"
                                title="Delete this team member"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="text-[10px]">Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-uday-midnight/70 mb-0.5">Name</label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setTeamData(prev => ({
                                      ...prev,
                                      leadTeam: prev.leadTeam.map((m, i) => i === idx ? { ...m, name: val } : m)
                                    }));
                                  }}
                                  className="w-full bg-white border border-uday-peach/60 rounded-lg px-2.5 py-1.5 text-xs text-uday-midnight font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-uday-midnight/70 mb-0.5">Role</label>
                                <input
                                  type="text"
                                  value={member.role}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setTeamData(prev => ({
                                      ...prev,
                                      leadTeam: prev.leadTeam.map((m, i) => i === idx ? { ...m, role: val } : m)
                                    }));
                                  }}
                                  className="w-full bg-white border border-uday-peach/60 rounded-lg px-2.5 py-1.5 text-xs text-uday-midnight"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-uday-midnight/70 mb-0.5">Major / Department</label>
                              <input
                                type="text"
                                value={member.major}
                                onChange={e => {
                                  const val = e.target.value;
                                  setTeamData(prev => ({
                                    ...prev,
                                    leadTeam: prev.leadTeam.map((m, i) => i === idx ? { ...m, major: val } : m)
                                  }));
                                }}
                                className="w-full bg-white border border-uday-peach/60 rounded-lg px-2.5 py-1.5 text-xs text-uday-midnight"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-uday-midnight/70 mb-0.5">Bio / Quote</label>
                              <textarea
                                rows={2}
                                value={member.bio}
                                onChange={e => {
                                  const val = e.target.value;
                                  setTeamData(prev => ({
                                    ...prev,
                                    leadTeam: prev.leadTeam.map((m, i) => i === idx ? { ...m, bio: val } : m)
                                  }));
                                }}
                                className="w-full bg-white border border-uday-peach/60 rounded-lg p-2 text-xs text-uday-midnight leading-relaxed italic"
                              ></textarea>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 5: SUB-TEAMS & ROSTERS (LINE-BY-LINE BULK EDITORS) */}
                    <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-4">
                      <div className="border-b border-uday-peach/30 pb-3">
                        <h4 className="font-serif text-lg font-bold text-uday-midnight">Editorial Sub-Teams & Contributor Rosters</h4>
                        <p className="text-xs text-uday-midnight/60">
                          Enter or update names (one name per line). These are automatically formatted and displayed on the public Contact page.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Editorial Team (English)
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={6}
                            value={englishText}
                            onChange={e => setEnglishText(e.target.value)}
                            placeholder="Siddhant Patra&#10;Kaustubh Nyati"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Editorial Team (Hindi)
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={6}
                            value={hindiText}
                            onChange={e => setHindiText(e.target.value)}
                            placeholder="Himanshu Mishra&#10;Vaishnavi Tripathi"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Reporters & Feature Writers
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={6}
                            value={reportersText}
                            onChange={e => setReportersText(e.target.value)}
                            placeholder="Chirag Sharma&#10;Ilesha Ojha"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Designers & Illustrators
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={5}
                            value={designersText}
                            onChange={e => setDesignersText(e.target.value)}
                            placeholder="Neeshma K P&#10;Abhishek Thakur"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Student Advisors & Senior Mentors
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={5}
                            value={advisorsText}
                            onChange={e => setAdvisorsText(e.target.value)}
                            placeholder="Hitaishi Desai&#10;Md Ishaque Khan"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Save Action Bar */}
                    <div className="bg-[#FAF7F2] border border-uday-peach/60 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-uday-midnight/70 text-center sm:text-left">
                        Changes to the Faculty Advisor, Web Lead (Souradip), Lead Board, and Teams take effect immediately across all website pages upon saving.
                      </div>
                      <button
                        type="submit"
                        disabled={savingTeam}
                        className="px-8 py-3 bg-gradient-to-r from-uday-crimson to-uday-orange text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-warm flex items-center gap-2 shrink-0 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingTeam ? 'Saving...' : 'Save & Publish All Directory Changes'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB 4: FEEDBACK & GOOGLE SHEETS */}
              {activeTab === 'feedback' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-uday-midnight">Google Sheets Feedback Feed</h3>
                      <p className="text-xs text-uday-midnight/70">
                        All student feedback submissions and collected email addresses.
                      </p>
                    </div>

                    <a
                      href="/api/admin/feedback/export-csv"
                      target="_blank"
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download CSV / Excel
                    </a>
                  </div>

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
                  </form>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-uday-cream border-b border-gray-200 text-uday-midnight font-bold">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">User & Email</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Rating</th>
                          <th className="p-3">Message</th>
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

              {/* TAB 5: NOTIFICATION LOGS */}
              {activeTab === 'emails' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-uday-peach/30 pb-3">
                    <h3 className="font-serif text-2xl font-bold text-uday-midnight">Dispatched Email Notifications Log</h3>
                    <p className="text-xs text-uday-midnight/70">
                      Real-time log of review alerts and password OTPs sent strictly to <strong>sayandeep.biswas04@gmail.com</strong>.
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

              {/* TAB 6: PASSWORD & SECURITY (STRICT EMAIL OTP) */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-xl mx-auto animate-fadeIn py-2">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-uday-sage/20 text-uday-forest flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-uday-midnight">Admin Password Security</h3>
                    <p className="text-xs text-uday-midnight/70">
                      Password updates strictly require two-factor confirmation dispatched to <strong>sayandeep.biswas04@gmail.com</strong>.
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
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Current Password *</label>
                        <input
                          type="password"
                          required
                          value={currPass}
                          onChange={e => setCurrPass(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-4 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">New Password * (Min 6 chars)</label>
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
                        <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Confirm New Password *</label>
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
                          Enter 6-Digit Email Verification Code
                        </div>
                        <p className="text-xs text-uday-midnight/75">
                          Sent strictly to <strong>sayandeep.biswas04@gmail.com</strong>.
                        </p>
                      </div>

                      <div>
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
        </div>
      )}

    </div>
  );
};
