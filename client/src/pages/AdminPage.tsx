import React, { useState, useEffect } from 'react';
import {
  Lock, Shield, BookOpen, Feather, Image as ImageIcon, MessageSquare,
  Key, LogOut, Check, Clock, Trash2, ExternalLink, Mail, FolderUp,
  PlusCircle, Download, RefreshCw, AlertCircle, CheckCircle2, Upload, FileText,
  Users, UserCheck, Edit3, Plus, Save, Phone, MapPin, Eye, EyeOff,
  Calendar, Bell, Sparkles, Bookmark, Search, Star, Copy, ChevronDown, ChevronUp,
  SlidersHorizontal, Filter, MessageCircle, X
} from 'lucide-react';
import { GalleryItem } from '../components/ImageGallerySection';
import { EDITORIAL_BOARD, TeamAndContact, LeadTeamMember } from '../data/publicationData';

interface AdminPageProps {
  onRefreshGlobalData?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onRefreshGlobalData }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('uday_admin_token'));
  
  // Login input fields start COMPLETELY BLANK for security
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'magazines' | 'blogs' | 'gallery' | 'team' | 'events' | 'feedback' | 'security' | 'emails'>('magazines');

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

  // Chief Editor's Note Editor State
  const [selectedMagIdForNote, setSelectedMagIdForNote] = useState('');
  const [editorNoteTitle, setEditorNoteTitle] = useState('');
  const [editorNoteAuthor, setEditorNoteAuthor] = useState('');
  const [editorNoteRole, setEditorNoteRole] = useState('');
  const [editorNoteText, setEditorNoteText] = useState('');
  const [savingEditorNote, setSavingEditorNote] = useState(false);
  const [editorNoteMsg, setEditorNoteMsg] = useState('');

  // Blog management state & review controls
  const [adminBlogs, setAdminBlogs] = useState<any[]>([]);
  const [readingBlogModal, setReadingBlogModal] = useState<any | null>(null);
  const [expandedBlogIds, setExpandedBlogIds] = useState<string[]>([]);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState<'all' | 'pending' | 'approved' | 'expired'>('all');

  const toggleExpandBlog = (id: string) => {
    setExpandedBlogIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Gallery state
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryArtist, setGalleryArtist] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Photography');
  const [galleryGdriveUrl, setGalleryGdriveUrl] = useState('');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryDesc, setGalleryDesc] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);

  // Events and Announcements State
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventCategory, setEventCategory] = useState('Featured Event');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventLinkText, setEventLinkText] = useState('RSVP Online');
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'past'>('upcoming');
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [eventSuccessMsg, setEventSuccessMsg] = useState('');

  const parseEventsList = (raw: any): any[] => {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      const up = Array.isArray(raw.upcoming) ? raw.upcoming.map((e: any) => ({ ...e, eventType: 'upcoming' })) : [];
      const pa = Array.isArray(raw.past) ? raw.past.map((e: any) => ({ ...e, eventType: 'past' })) : [];
      return [...up, ...pa];
    }
    return [];
  };

  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTag, setAnnouncementTag] = useState('Call for Submissions');
  const [announcementLinkUrl, setAnnouncementLinkUrl] = useState('');
  const [announcementLinkText, setAnnouncementLinkText] = useState('');
  const [uploadingAnnouncement, setUploadingAnnouncement] = useState(false);
  const [announcementSuccessMsg, setAnnouncementSuccessMsg] = useState('');

  // Feedback state & UI controls
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('ALL');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState('ALL');
  const [feedbackSortOrder, setFeedbackSortOrder] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low'>('newest');
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [copiedFeedbackId, setCopiedFeedbackId] = useState<string | null>(null);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(null);

  // Email Logs
  const [emailLogs, setEmailLogs] = useState<any[]>([]);

  // Password Change & Cloud Persistence State
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStep, setPassStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });
  const [passLoading, setPassLoading] = useState(false);
  const [githubTokenInput, setGithubTokenInput] = useState('');
  const [savingGithubToken, setSavingGithubToken] = useState(false);
  const [githubSyncMsg, setGithubSyncMsg] = useState('');
 
  // Directory, Faculty Advisor, and Team Management state
  const [teamData, setTeamData] = useState<TeamAndContact>(EDITORIAL_BOARD);
  const [savingTeam, setSavingTeam] = useState(false);
  const [teamSuccessMsg, setTeamSuccessMsg] = useState('');

  // Sub-teams textarea string states (line-delimited for easy editing)
  const [englishText, setEnglishText] = useState(EDITORIAL_BOARD.editorialEnglish.join('\n'));
  const [hindiText, setHindiText] = useState(EDITORIAL_BOARD.editorialHindi.join('\n'));
  const [reportersText, setReportersText] = useState(EDITORIAL_BOARD.reporters.join('\n'));
  const [prText, setPrText] = useState((EDITORIAL_BOARD.prTeam || []).join('\n'));
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
        const mags = data.magazines || [];
        setMagazinesList(mags);
        if (mags.length > 0 && !selectedMagIdForNote) {
          const featured = mags.find((m: any) => m.isLatest) || mags[0];
          setSelectedMagIdForNote(featured.id);
          if (featured.editorNote) {
            setEditorNoteTitle(featured.editorNote.title || '');
            setEditorNoteAuthor(featured.editorNote.author || '');
            setEditorNoteRole(featured.editorNote.role || '');
            setEditorNoteText(featured.editorNote.text || '');
          }
        }
      }

      // Events
      const resEvents = await fetch('/api/events');
      if (resEvents.ok) {
        const data = await resEvents.json();
        setEventsList(parseEventsList(data.events));
      }

      // Announcements
      const resAnn = await fetch('/api/admin/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resAnn.ok) {
        const data = await resAnn.json();
        setAnnouncementsList(data.announcements || []);
      } else {
        const resPublicAnn = await fetch('/api/announcements');
        if (resPublicAnn.ok) {
          const data = await resPublicAnn.json();
          setAnnouncementsList(data.announcements || []);
        }
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
        if (data.settings?.githubToken) {
          setGithubTokenInput(data.settings.githubToken);
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
          setPrText((data.teamAndContact.prTeam || []).join('\n'));
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
        prTeam: prText.split('\n').map(s => s.trim()).filter(Boolean),
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

  // Chief Editor's Note Handlers
  const handleSaveEditorNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMagIdForNote) {
      alert("Please select a magazine volume first.");
      return;
    }
    setSavingEditorNote(true);
    setEditorNoteMsg('');
    try {
      const res = await fetch(`/api/admin/magazines/${selectedMagIdForNote}/editor-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editorNoteTitle.trim(),
          author: editorNoteAuthor.trim(),
          role: editorNoteRole.trim(),
          text: editorNoteText.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update Chief Editor's Note");

      setEditorNoteMsg("Chief Editor's Note successfully published! It is live on the /magazines page.");
      setMagazinesList(data.magazines || []);
      setTimeout(() => setEditorNoteMsg(''), 5000);
    } catch (err: any) {
      alert("Error saving Editor's Note: " + err.message);
    } finally {
      setSavingEditorNote(false);
    }
  };

  const handleSelectMagazineForNote = (magId: string) => {
    setSelectedMagIdForNote(magId);
    const mag = magazinesList.find(m => m.id === magId);
    if (mag && mag.editorNote) {
      setEditorNoteTitle(mag.editorNote.title || '');
      setEditorNoteAuthor(mag.editorNote.author || '');
      setEditorNoteRole(mag.editorNote.role || '');
      setEditorNoteText(mag.editorNote.text || '');
    } else {
      setEditorNoteTitle('');
      setEditorNoteAuthor('');
      setEditorNoteRole('');
      setEditorNoteText('');
    }
  };

  // Events & Announcements Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim() || !eventTime.trim()) {
      alert("Please provide the event title, date, and time.");
      return;
    }
    setUploadingEvent(true);
    setEventSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('title', eventTitle.trim());
      formData.append('date', eventDate.trim());
      formData.append('time', eventTime.trim());
      formData.append('venue', eventVenue.trim());
      formData.append('category', eventCategory.trim() || 'Featured Event');
      formData.append('description', eventDesc.trim());
      formData.append('link', eventLink.trim());
      formData.append('linkText', eventLinkText.trim() || 'RSVP Online');
      formData.append('status', eventStatus);
      if (eventImageFile) {
        formData.append('image', eventImageFile);
        formData.append('eventImage', eventImageFile);
      } else if (eventImageUrl.trim()) {
        formData.append('imageUrl', eventImageUrl.trim());
      }

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      setEventSuccessMsg(`Event successfully published to ${eventStatus === 'past' ? 'Past Archives' : 'Upcoming Events'}!`);
      setEventsList(parseEventsList(data.events));
      setEventTitle('');
      setEventDate('');
      setEventTime('');
      setEventVenue('');
      setEventCategory('Featured Event');
      setEventDesc('');
      setEventLink('');
      setEventLinkText('RSVP Online');
      setEventImageFile(null);
      setEventImageUrl('');
      setEventStatus('upcoming');
      setTimeout(() => setEventSuccessMsg(''), 5000);
    } catch (err: any) {
      alert('Error creating event: ' + err.message);
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete event');
      setEventsList(parseEventsList(data.events));
    } catch (err: any) {
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleToggleEventStatus = async (id: string, currentType?: string) => {
    const isPast = currentType === 'past' || id.startsWith('pev');
    const targetEndpoint = isPast 
      ? `/api/admin/events/${id}/mark-upcoming` 
      : `/api/admin/events/${id}/mark-past`;
    try {
      const res = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update event status');
      setEventsList(parseEventsList(data.events));
    } catch (err: any) {
      alert('Error updating event status: ' + err.message);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) {
      alert("Please provide the announcement message.");
      return;
    }
    setUploadingAnnouncement(true);
    setAnnouncementSuccessMsg('');
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: announcementText.trim(),
          tag: announcementTag.trim() || 'Notice',
          linkUrl: announcementLinkUrl.trim(),
          linkText: announcementLinkText.trim(),
          active: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post announcement');

      setAnnouncementSuccessMsg('Announcement successfully published with active link!');
      setAnnouncementsList(data.announcements || []);
      setAnnouncementText('');
      setAnnouncementTag('Call for Submissions');
      setAnnouncementLinkUrl('');
      setAnnouncementLinkText('');
      setTimeout(() => setAnnouncementSuccessMsg(''), 5000);
    } catch (err: any) {
      alert('Error posting announcement: ' + err.message);
    } finally {
      setUploadingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete announcement');
      setAnnouncementsList(data.announcements || []);
    } catch (err: any) {
      alert('Error deleting announcement: ' + err.message);
    }
  };

  // GitHub Auto-Sync & Backup Handlers
  const handleSaveGithubToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGithubToken(true);
    setGithubSyncMsg('');
    try {
      const res = await fetch('/api/admin/sync-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ token: githubTokenInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sync with GitHub');
      setGithubSyncMsg('Repository sync successful! data.json is backed up to GitHub.');
      setTimeout(() => setGithubSyncMsg(''), 5000);
    } catch (err: any) {
      alert('GitHub Sync error: ' + err.message);
    } finally {
      setSavingGithubToken(false);
    }
  };

  const handleDownloadBackup = () => {
    window.open('/api/admin/backup-data', '_blank');
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
      if (res.ok) {
        loadAllAdminData();
        setReadingBlogModal((prev: any) => (prev && prev.id === id ? null : prev));
      }
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

  // Delete Feedback Entry
  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this reader response?')) return;
    setDeletingFeedbackId(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFeedbackList(prev => prev.filter(item => item.id !== id));
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Failed to delete feedback entry');
      }
    } catch (err) {
      alert('Network error while deleting feedback');
    } finally {
      setDeletingFeedbackId(null);
    }
  };

  const handleCopyFeedback = (item: any) => {
    const text = `Reader Feedback:\nName: ${item.name}\nEmail: ${item.email}${item.rollOrDept ? `\nRoll/Dept: ${item.rollOrDept}` : ''}\nCategory: ${item.category}\nRating: ${item.rating}/5 stars\nDate: ${new Date(item.timestamp).toLocaleString()}\n\n"${item.message}"`;
    navigator.clipboard.writeText(text);
    setCopiedFeedbackId(item.id);
    setTimeout(() => setCopiedFeedbackId(null), 2000);
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                placeholder="Enter admin username (e.g. udaymag25)"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl pl-4 pr-11 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-uday-midnight/40 hover:text-uday-midnight transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'events'
                    ? 'bg-uday-crimson text-white shadow-warm'
                    : 'text-uday-midnight/75 hover:bg-uday-peach/20'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Events & Notices</span>
                {(eventsList.length > 0 || announcementsList.length > 0) && (
                  <span className="ml-auto bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {eventsList.length + announcementsList.length}
                  </span>
                )}
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

                  {/* Chief Editor's Note Editor */}
                  <div className="pt-6 border-t border-uday-peach/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-uday-crimson bg-uday-crimson/10 px-3 py-1 rounded-full mb-1">
                          <Bookmark className="w-3.5 h-3.5" /> Chief Editor's Note Control
                        </div>
                        <h4 className="font-serif font-bold text-xl text-uday-midnight">Edit Chief Editor's Letter / Note</h4>
                        <p className="text-xs text-uday-midnight/70">
                          Customize the Editor's Note featured directly on the public Magazine page for each issue.
                        </p>
                      </div>
                    </div>

                    {editorNoteMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{editorNoteMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveEditorNote} className="space-y-4 bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-uday-peach/50">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Select Magazine Volume to Update *</label>
                        <select
                          value={selectedMagIdForNote}
                          onChange={e => handleSelectMagazineForNote(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-medium"
                        >
                          {magazinesList.map(m => (
                            <option key={m.id} value={m.id}>
                              Vol. {m.volumeNumber} - {m.title} ({m.year}) {m.isLatest ? '★ Current Featured' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Note Heading / Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. A Confluence of Melodies & Thought"
                            value={editorNoteTitle}
                            onChange={e => setEditorNoteTitle(e.target.value)}
                            className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Author Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Pranay Goel / Editorial Board"
                            value={editorNoteAuthor}
                            onChange={e => setEditorNoteAuthor(e.target.value)}
                            className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Designation / Role</label>
                          <input
                            type="text"
                            placeholder="e.g. Faculty Advisor & Editorial Board"
                            value={editorNoteRole}
                            onChange={e => setEditorNoteRole(e.target.value)}
                            className="w-full bg-white border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">Editor's Note Message / Body Text</label>
                        <textarea
                          rows={6}
                          required
                          placeholder="Write or paste the complete Chief Editor's Note..."
                          value={editorNoteText}
                          onChange={e => setEditorNoteText(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingEditorNote}
                        className="px-6 py-2.5 bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm hover:opacity-95 transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingEditorNote ? 'Saving Editor’s Note...' : 'Save & Publish Chief Editor’s Note'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: COMMUNITY BLOGS */}
              {activeTab === 'blogs' && (() => {
                const pendingCount = adminBlogs.filter(b => b.status === 'pending').length;
                const approvedCount = adminBlogs.filter(b => b.status === 'approved' && !b.isExpired).length;
                const expiredCount = adminBlogs.filter(b => b.isExpired || b.status === 'rejected').length;

                const filteredBlogs = adminBlogs.filter(blog => {
                  const matchesStatus =
                    blogStatusFilter === 'all'
                      ? true
                      : blogStatusFilter === 'pending'
                      ? blog.status === 'pending'
                      : blogStatusFilter === 'approved'
                      ? blog.status === 'approved' && !blog.isExpired
                      : blog.isExpired || blog.status === 'rejected';

                  const q = blogSearchQuery.toLowerCase().trim();
                  const matchesQuery =
                    !q ||
                    (blog.title || '').toLowerCase().includes(q) ||
                    (blog.author || '').toLowerCase().includes(q) ||
                    (blog.email || '').toLowerCase().includes(q) ||
                    (blog.category || '').toLowerCase().includes(q) ||
                    (blog.content || '').toLowerCase().includes(q);

                  return matchesStatus && matchesQuery;
                });

                return (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-uday-peach/30 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-serif text-2xl font-bold text-uday-midnight">Community Blogs Approval Queue</h3>
                          {pendingCount > 0 && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              {pendingCount} Pending Review
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-uday-midnight/70 mt-1">
                          Review student and researcher articles. Read the complete text inline or in the full reader modal before approving. Approved pieces stay live for <strong>30 days</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Filter Tabs and Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-uday-peach/50 shadow-sm space-y-3">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Status Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBlogStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              blogStatusFilter === 'all'
                                ? 'bg-uday-midnight text-white'
                                : 'bg-[#FAF7F2] text-uday-midnight/70 hover:text-uday-midnight'
                            }`}
                          >
                            All ({adminBlogs.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogStatusFilter('pending')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              blogStatusFilter === 'pending'
                                ? 'bg-amber-500 text-white'
                                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <span>Pending Review</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                              blogStatusFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
                            }`}>
                              {pendingCount}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogStatusFilter('approved')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              blogStatusFilter === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#FAF7F2] text-uday-midnight/70 hover:text-uday-midnight'
                            }`}
                          >
                            Approved & Live ({approvedCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogStatusFilter('expired')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              blogStatusFilter === 'expired'
                                ? 'bg-stone-600 text-white'
                                : 'bg-[#FAF7F2] text-uday-midnight/70 hover:text-uday-midnight'
                            }`}
                          >
                            Archived / Expired ({expiredCount})
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[240px]">
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search by title, author, keyword..."
                            value={blogSearchQuery}
                            onChange={e => setBlogSearchQuery(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl pl-8 pr-7 py-1.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                          {blogSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setBlogSearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Blog Cards List */}
                    {filteredBlogs.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-uday-peach/40 p-10 text-center space-y-2">
                        <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
                        <h5 className="font-serif text-base font-bold text-uday-midnight">No Articles Found</h5>
                        <p className="text-xs text-gray-500">
                          {blogSearchQuery || blogStatusFilter !== 'all'
                            ? 'No blog submissions match your current filters.'
                            : 'There are currently no blog submissions in this queue.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredBlogs.map(blog => {
                          const isPending = blog.status === 'pending';
                          const isApproved = blog.status === 'approved';
                          const isExpired = blog.isExpired;
                          const isExpanded = expandedBlogIds.includes(blog.id);
                          const wordCount = (blog.content || '').split(/\s+/).filter(Boolean).length;
                          const estReadTime = Math.max(1, Math.ceil(wordCount / 200));

                          return (
                            <div
                              key={blog.id}
                              className={`p-5 rounded-2xl border transition-all ${
                                isPending
                                  ? 'bg-amber-50/60 border-amber-300 shadow-sm'
                                  : isApproved && !isExpired
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                  {/* Badge & Category Row */}
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                        isPending
                                          ? 'bg-amber-200 text-amber-900 border border-amber-300'
                                          : isApproved && !isExpired
                                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                                          : 'bg-gray-200 text-gray-800'
                                      }`}
                                    >
                                      {isExpired ? 'EXPIRED (30 DAYS COMPLETED)' : blog.status.toUpperCase()}
                                    </span>
                                    <span className="text-xs font-semibold text-uday-teal bg-uday-teal/10 px-2 py-0.5 rounded-full">
                                      {blog.category}
                                    </span>
                                    <span className="text-[11px] text-gray-500 font-medium">
                                      {wordCount} words • ~{estReadTime} min read
                                    </span>
                                  </div>

                                  {/* Title */}
                                  <h4 className="font-serif text-xl font-bold text-uday-midnight leading-snug">
                                    {blog.title}
                                  </h4>

                                  {/* Author & Submission Date */}
                                  <p className="text-xs text-uday-midnight/70 font-medium flex flex-wrap items-center gap-1.5">
                                    <span>By <strong>{blog.author}</strong></span>
                                    <span>•</span>
                                    <a
                                      href={`mailto:${blog.email}?subject=Regarding your Uday Blog: ${encodeURIComponent(blog.title)}`}
                                      className="text-uday-crimson hover:underline inline-flex items-center gap-1"
                                    >
                                      <Mail className="w-3 h-3" />
                                      {blog.email}
                                    </a>
                                    <span>•</span>
                                    <span>Submitted: {new Date(blog.submittedAt).toLocaleDateString()}</span>
                                  </p>

                                  {/* Tags */}
                                  {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      {blog.tags.map((tag: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="text-[10px] font-medium bg-white text-uday-teal px-2 py-0.5 rounded-full border border-uday-peach/50"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Excerpt Box */}
                                  <div className="bg-white/90 p-3 rounded-xl border border-uday-peach/40 text-xs text-uday-midnight/80 italic">
                                    "{blog.excerpt}"
                                  </div>

                                  {/* Approved 30-Day Window Status */}
                                  {isApproved && (
                                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5 pt-0.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>
                                        {isExpired
                                          ? 'Featured period expired'
                                          : `Featured live on website: ${blog.daysRemaining} days remaining (Expires: ${new Date(blog.expiresAt).toLocaleDateString()})`}
                                      </span>
                                    </div>
                                  )}

                                  {/* INLINE EXPANDED FULL ARTICLE BODY */}
                                  {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-uday-peach/40 space-y-4 animate-scaleUp">
                                      {blog.coverImage && (
                                        <div className="rounded-xl overflow-hidden max-h-72 w-full border border-uday-peach/40 shadow-sm">
                                          <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}

                                      <div className="bg-white rounded-xl p-5 border border-uday-peach/50 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                          <span className="text-[11px] font-bold text-uday-crimson uppercase tracking-wider flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5" /> Full Article Content ({wordCount} words)
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => setReadingBlogModal(blog)}
                                            className="text-xs text-uday-teal hover:underline flex items-center gap-1 font-semibold"
                                          >
                                            <Eye className="w-3.5 h-3.5" /> Open In Fullscreen Modal
                                          </button>
                                        </div>

                                        <div className="text-uday-midnight font-serif text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line select-text">
                                          {blog.content}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Right Side Actions Toolbar */}
                                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                                  {/* Toggle Inline Full Text */}
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandBlog(blog.id)}
                                    className="px-3.5 py-2 bg-white hover:bg-stone-100 text-uday-midnight border border-uday-peach/60 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 text-uday-crimson" />
                                    <span>{isExpanded ? 'Hide Article' : 'Read Full Article'}</span>
                                  </button>

                                  {/* Distraction-Free Modal Button */}
                                  <button
                                    type="button"
                                    onClick={() => setReadingBlogModal(blog)}
                                    className="px-3.5 py-2 bg-white hover:bg-stone-100 text-uday-teal border border-uday-teal/40 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Full Reader View</span>
                                  </button>

                                  {isPending && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleBlogAction(blog.id, 'approve')}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                      >
                                        <Check className="w-3.5 h-3.5" /> Approve (30 Days)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleBlogAction(blog.id, 'reject')}
                                        className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-all"
                                      >
                                        Decline
                                      </button>
                                    </>
                                  )}

                                  {isApproved && (
                                    <button
                                      type="button"
                                      onClick={() => handleBlogAction(blog.id, 'extend_30_days')}
                                      className="px-3 py-1.5 bg-uday-teal/15 hover:bg-uday-teal/25 text-uday-teal rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                                    >
                                      <RefreshCw className="w-3 h-3" /> +30 Days Extend
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleBlogAction(blog.id, 'delete')}
                                    className="px-3 py-1.5 text-gray-400 hover:text-red-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* DEDICATED FULLSCREEN EDITORIAL REVIEW READER MODAL */}
                    {readingBlogModal && (() => {
                      const modalPending = readingBlogModal.status === 'pending';
                      const modalApproved = readingBlogModal.status === 'approved';
                      const modalWordCount = (readingBlogModal.content || '').split(/\s+/).filter(Boolean).length;
                      const modalReadTime = Math.max(1, Math.ceil(modalWordCount / 200));

                      return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
                          <div className="bg-[#FAF7F2] rounded-3xl border border-uday-peach shadow-2xl max-w-3xl w-full my-6 overflow-hidden relative animate-scaleUp flex flex-col max-h-[92vh]">
                            {/* Modal Header */}
                            <div className="bg-white border-b border-uday-peach/40 px-6 py-4 flex items-center justify-between shrink-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                                    modalPending
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : modalApproved
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {readingBlogModal.status.toUpperCase()}
                                </span>
                                <span className="text-xs font-bold text-uday-teal bg-uday-teal/10 px-2.5 py-0.5 rounded-full">
                                  {readingBlogModal.category}
                                </span>
                                <span className="text-xs text-gray-400 hidden sm:inline">
                                  {modalWordCount} words • ~{modalReadTime} min read
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setReadingBlogModal(null)}
                                className="p-2 text-gray-400 hover:text-uday-midnight hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Modal Scrollable Article Body */}
                            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
                              {readingBlogModal.coverImage && (
                                <div className="rounded-2xl overflow-hidden max-h-72 w-full border border-uday-peach/30 shadow-sm">
                                  <img
                                    src={readingBlogModal.coverImage}
                                    alt={readingBlogModal.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}

                              <div className="space-y-3 text-center border-b border-uday-peach/40 pb-6">
                                <h1 className="font-serif text-2xl sm:text-4xl font-black text-uday-midnight leading-tight">
                                  {readingBlogModal.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-uday-midnight/70 font-semibold">
                                  <span>By <strong>{readingBlogModal.author}</strong></span>
                                  <span>•</span>
                                  <a
                                    href={`mailto:${readingBlogModal.email}`}
                                    className="text-uday-crimson hover:underline flex items-center gap-1"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    {readingBlogModal.email}
                                  </a>
                                  <span>•</span>
                                  <span>Submitted {new Date(readingBlogModal.submittedAt).toLocaleDateString()}</span>
                                </div>

                                {readingBlogModal.tags && readingBlogModal.tags.length > 0 && (
                                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                                    {readingBlogModal.tags.map((tag: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="text-[11px] font-medium bg-white text-uday-teal px-2.5 py-0.5 rounded-full border border-uday-peach/40"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Excerpt callout */}
                              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs italic text-amber-900 leading-relaxed">
                                <strong>Excerpt:</strong> "{readingBlogModal.excerpt}"
                              </div>

                              {/* Full Article Content */}
                              <div className="bg-white rounded-2xl p-6 border border-uday-peach/40 shadow-sm text-uday-midnight font-serif text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-line select-text">
                                {readingBlogModal.content}
                              </div>
                            </div>

                            {/* Sticky Modal Action Footer */}
                            <div className="bg-white border-t border-uday-peach/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                              <div className="text-xs text-gray-500">
                                Decision for <strong>{readingBlogModal.author}</strong>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setReadingBlogModal(null)}
                                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all"
                                >
                                  Close Reader
                                </button>

                                {modalPending && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleBlogAction(readingBlogModal.id, 'reject')}
                                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-all"
                                    >
                                      Decline Piece
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleBlogAction(readingBlogModal.id, 'approve')}
                                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                      <Check className="w-4 h-4" /> Approve & Publish (30 Days)
                                    </button>
                                  </>
                                )}

                                {modalApproved && (
                                  <button
                                    type="button"
                                    onClick={() => handleBlogAction(readingBlogModal.id, 'extend_30_days')}
                                    className="px-4 py-2 bg-uday-teal hover:bg-uday-teal/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" /> Extend 30 Days
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

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
                            Reporting Team
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
                            PR & Social Media Team
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={6}
                            value={prText}
                            onChange={e => setPrText(e.target.value)}
                            placeholder="Ananya Verma&#10;Karan Mehta"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Design Team & Illustrators
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={6}
                            value={designersText}
                            onChange={e => setDesignersText(e.target.value)}
                            placeholder="Neeshma K P&#10;Abhishek Thakur"
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">
                            Student Advisory Team
                          </label>
                          <p className="text-[10px] text-uday-midnight/60 mb-1.5">One name per line</p>
                          <textarea
                            rows={6}
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

              {/* TAB: EVENTS & ANNOUNCEMENTS MANAGEMENT */}
              {activeTab === 'events' && (
                <div className="space-y-10 animate-fadeIn">
                  {/* Tab Header */}
                  <div className="border-b border-uday-peach/30 pb-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-crimson bg-uday-crimson/10 px-3 py-1 rounded-full mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Events & Announcements Control
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-uday-midnight">Publish Events & Campus Announcements</h3>
                    <p className="text-xs text-uday-midnight/70">
                      Upload upcoming literary events with banners & RSVP links, and broadcast instant notices across the homepage and events section.
                    </p>
                  </div>

                  {/* SECTION 1: CREATE NEW EVENT */}
                  <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-uday-crimson/10 text-uday-crimson flex items-center justify-center font-bold">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-uday-midnight">Publish New Upcoming Event</h4>
                          <p className="text-xs text-uday-midnight/60">Includes event banner image and registration / RSVP links.</p>
                        </div>
                      </div>
                    </div>

                    {eventSuccessMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{eventSuccessMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleCreateEvent} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Event Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Annual Literary Festival: Kavya Sandhya 2024"
                            value={eventTitle}
                            onChange={e => setEventTitle(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Event Category</label>
                          <select
                            value={eventCategory}
                            onChange={e => setEventCategory(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-medium"
                          >
                            <option value="Featured Event">Featured Event</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Literary Talk">Literary Talk</option>
                            <option value="Exhibition">Exhibition</option>
                            <option value="Reading Session">Reading Session</option>
                            <option value="Poetry Slam">Poetry Slam</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Schedule Section / Status</label>
                          <select
                            value={eventStatus}
                            onChange={e => setEventStatus(e.target.value as 'upcoming' | 'past')}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-medium"
                          >
                            <option value="upcoming">Upcoming Events (Active / Live)</option>
                            <option value="past">Past Events Archive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Date String *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. OCT 28, 2024"
                            value={eventDate}
                            onChange={e => setEventDate(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Time & Duration *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 5:30 PM - 7:30 PM"
                            value={eventTime}
                            onChange={e => setEventTime(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Venue / Location</label>
                          <input
                            type="text"
                            placeholder="e.g. L-4 Lecture Hall Complex"
                            value={eventVenue}
                            onChange={e => setEventVenue(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">External Registration / RSVP Link (URL)</label>
                          <input
                            type="url"
                            placeholder="https://forms.google.com/... or event page link"
                            value={eventLink}
                            onChange={e => setEventLink(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Link Button Label</label>
                          <input
                            type="text"
                            placeholder="e.g. RSVP Online or Register Now"
                            value={eventLinkText}
                            onChange={e => setEventLinkText(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Event Cover Image (Upload or Web URL)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    setEventImageFile(e.target.files[0]);
                                  }
                                }}
                                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-uday-crimson/10 file:text-uday-crimson hover:file:bg-uday-crimson/20"
                              />
                            </div>
                            <div>
                              <input
                                type="url"
                                placeholder="Or paste image URL (https://...)"
                                value={eventImageUrl}
                                onChange={e => setEventImageUrl(e.target.value)}
                                className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Event Description</label>
                          <textarea
                            rows={3}
                            placeholder="A concise summary of what this event entails, guest speakers, themes, etc."
                            value={eventDesc}
                            onChange={e => setEventDesc(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={uploadingEvent}
                        className="px-6 py-3 bg-gradient-to-r from-uday-crimson to-uday-orange text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-warm flex items-center gap-2 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{uploadingEvent ? 'Publishing Event...' : 'Publish Event to Website'}</span>
                      </button>
                    </form>

                    {/* Existing Events List */}
                    <div className="pt-6 border-t border-uday-peach/40 space-y-4">
                      <h4 className="font-serif font-bold text-base text-uday-midnight">Currently Scheduled Events ({eventsList.length})</h4>
                      {eventsList.length === 0 ? (
                        <p className="text-xs text-uday-midnight/60 italic">No events currently scheduled.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {eventsList.map(ev => (
                            <div key={ev.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-uday-peach/50 flex flex-col justify-between gap-3">
                              <div className="space-y-2">
                                {ev.image && (
                                  <div className="w-full h-32 rounded-xl overflow-hidden bg-uday-midnight/5 border border-uday-peach/40">
                                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                      (ev.eventType === 'past' || ev.id.startsWith('pev'))
                                        ? 'text-uday-teal bg-uday-teal/10 border border-uday-teal/30'
                                        : 'text-emerald-700 bg-emerald-100 border border-emerald-300'
                                    }`}>
                                      {(ev.eventType === 'past' || ev.id.startsWith('pev')) ? 'Past Archive' : 'Upcoming Event'}
                                    </span>
                                    <span className="text-[10px] font-bold text-uday-crimson uppercase tracking-wider bg-uday-crimson/10 px-2 py-0.5 rounded">
                                      {ev.category || 'Event'}
                                    </span>
                                  </div>
                                  <span className="text-xs font-semibold text-uday-midnight/70">{ev.date}</span>
                                </div>
                                <h5 className="font-serif font-bold text-sm text-uday-midnight">{ev.title}</h5>
                                <p className="text-xs text-uday-midnight/70 line-clamp-2">{ev.description}</p>
                                {ev.link && (
                                  <div className="text-xs text-uday-teal font-semibold flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    <span className="truncate">{ev.linkText || 'Link'}: {ev.link}</span>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t border-uday-peach/30 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] text-gray-500">{ev.time} • {ev.venue}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleEventStatus(ev.id, ev.eventType)}
                                    className="px-2.5 py-1.5 text-uday-teal bg-uday-teal/10 hover:bg-uday-teal hover:text-white rounded-lg text-xs font-bold transition-all border border-uday-teal/20"
                                    title="Toggle between Upcoming and Past Archives"
                                  >
                                    {(ev.eventType === 'past' || ev.id.startsWith('pev')) ? 'Make Upcoming' : 'Mark as Past'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEvent(ev.id)}
                                    className="px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 2: ANNOUNCEMENTS MANAGEMENT */}
                  <div className="bg-white rounded-2xl border border-uday-peach/60 p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-uday-peach/30 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-uday-teal/10 text-uday-teal flex items-center justify-center font-bold">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-uday-midnight">Broadcast Campus Announcements</h4>
                          <p className="text-xs text-uday-midnight/60">Displays active announcements with clickable links on public pages.</p>
                        </div>
                      </div>
                    </div>

                    {announcementSuccessMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{announcementSuccessMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Tag / Category</label>
                          <input
                            type="text"
                            placeholder="e.g. Call for Submissions or Urgent Notice"
                            value={announcementTag}
                            onChange={e => setAnnouncementTag(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Action Link URL (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://... (e.g. submission form or doc)"
                            value={announcementLinkUrl}
                            onChange={e => setAnnouncementLinkUrl(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Link Button Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Submit Here or Read Notice"
                            value={announcementLinkText}
                            onChange={e => setAnnouncementLinkText(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-uday-midnight mb-1">Announcement Message *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Enter the announcement message to display on the website..."
                            value={announcementText}
                            onChange={e => setAnnouncementText(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={uploadingAnnouncement}
                        className="px-6 py-3 bg-gradient-to-r from-uday-teal to-uday-midnight text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-warm flex items-center gap-2 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{uploadingAnnouncement ? 'Posting Announcement...' : 'Post Announcement Banner'}</span>
                      </button>
                    </form>

                    {/* Existing Announcements List */}
                    <div className="pt-6 border-t border-uday-peach/40 space-y-3">
                      <h4 className="font-serif font-bold text-base text-uday-midnight">Live Announcements ({announcementsList.length})</h4>
                      {announcementsList.length === 0 ? (
                        <p className="text-xs text-uday-midnight/60 italic">No active announcements.</p>
                      ) : (
                        <div className="space-y-3">
                          {announcementsList.map(an => (
                            <div key={an.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-uday-peach/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-uday-teal uppercase tracking-wider bg-uday-teal/10 px-2 py-0.5 rounded">
                                    {an.tag || 'Notice'}
                                  </span>
                                  {an.active && (
                                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-uday-midnight font-medium">{an.text}</p>
                                {an.linkUrl && (
                                  <a href={an.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-uday-crimson font-bold hover:underline inline-flex items-center gap-1">
                                    <span>{an.linkText || 'Open Link'}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteAnnouncement(an.id)}
                                className="px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-center shrink-0 shadow-sm"
                                title="Delete Announcement"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FEEDBACK & GOOGLE SHEETS */}
              {activeTab === 'feedback' && (() => {
                const feedbackCategories = Array.from(new Set([
                  'Magazine Content',
                  'Layout & Design',
                  'Website Experience',
                  'Submissions Inquiry',
                  'General Suggestion',
                  ...feedbackList.map(f => f.category).filter(Boolean)
                ]));

                const filteredFeedback = feedbackList
                  .filter(item => {
                    const q = feedbackSearch.toLowerCase().trim();
                    const matchesSearch = !q || (
                      (item.name || '').toLowerCase().includes(q) ||
                      (item.email || '').toLowerCase().includes(q) ||
                      (item.rollOrDept || '').toLowerCase().includes(q) ||
                      (item.category || '').toLowerCase().includes(q) ||
                      (item.message || '').toLowerCase().includes(q)
                    );

                    const matchesCat = feedbackCategoryFilter === 'ALL' || item.category === feedbackCategoryFilter;
                    const matchesRating = feedbackRatingFilter === 'ALL' || String(item.rating) === feedbackRatingFilter;

                    return matchesSearch && matchesCat && matchesRating;
                  })
                  .sort((a, b) => {
                    if (feedbackSortOrder === 'oldest') {
                      return (a.timestamp || 0) - (b.timestamp || 0);
                    }
                    if (feedbackSortOrder === 'rating_high') {
                      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
                    }
                    if (feedbackSortOrder === 'rating_low') {
                      return (Number(a.rating) || 0) - (Number(b.rating) || 0);
                    }
                    return (b.timestamp || 0) - (a.timestamp || 0);
                  });

                const totalFeedbackCount = feedbackList.length;
                const avgFeedbackRating = totalFeedbackCount > 0
                  ? (feedbackList.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / totalFeedbackCount).toFixed(1)
                  : '5.0';
                const fiveStarFeedbackCount = feedbackList.filter(f => Number(f.rating) === 5).length;
                const fourStarFeedbackCount = feedbackList.filter(f => Number(f.rating) === 4).length;
                const positiveSentimentPct = totalFeedbackCount > 0
                  ? Math.round(((fiveStarFeedbackCount + fourStarFeedbackCount) / totalFeedbackCount) * 100)
                  : 100;
                const uniqueFeedbackEmails = new Set(feedbackList.map(f => (f.email || '').toLowerCase().trim()).filter(Boolean)).size;
                const hasActiveFilters = feedbackSearch.trim() !== '' || feedbackCategoryFilter !== 'ALL' || feedbackRatingFilter !== 'ALL';

                return (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Top Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-uday-peach/30 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-2xl font-bold text-uday-midnight">Reader Feedback & Reviews</h3>
                          <span className="bg-uday-crimson/10 text-uday-crimson text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {totalFeedbackCount} responses
                          </span>
                        </div>
                        <p className="text-xs text-uday-midnight/70 mt-1">
                          Browse, filter, and respond to feedback and suggestions submitted by readers.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setShowWebhookConfig(!showWebhookConfig)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                            showWebhookConfig
                              ? 'bg-uday-midnight text-white border-uday-midnight'
                              : 'bg-white hover:bg-stone-50 text-uday-midnight border-uday-peach/60'
                          }`}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-uday-crimson" />
                          <span>Google Sheets Sync</span>
                          {sheetsWebhookUrl && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Webhook configured" />
                          )}
                          {showWebhookConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href="/api/admin/feedback/export-csv"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Export CSV
                        </a>
                      </div>
                    </div>

                    {/* Collapsible Google Sheets Webhook Configuration */}
                    {showWebhookConfig && (
                      <div className="bg-white rounded-2xl border border-uday-peach/60 p-5 shadow-sm space-y-4 animate-scaleUp">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-uday-midnight flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              Google Apps Script Web App Integration
                            </h4>
                            <p className="text-xs text-uday-midnight/70 mt-0.5">
                              Incoming feedback forms automatically forward directly to your Google Sheet in real-time.
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleSaveWebhook} className="space-y-3">
                          <label className="block text-[11px] font-bold text-uday-midnight uppercase tracking-wider">
                            Webhook Deployment URL (Exec)
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="url"
                              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                              value={sheetsWebhookUrl}
                              onChange={e => setSheetsWebhookUrl(e.target.value)}
                              className="flex-1 bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-mono"
                            />
                            <button
                              type="submit"
                              disabled={savingWebhook}
                              className="px-5 py-2.5 bg-uday-midnight hover:bg-uday-crimson text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                            >
                              {savingWebhook ? 'Saving...' : 'Save Webhook URL'}
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            Forwarded fields: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Timestamp</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Name</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Email</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Roll/Dept</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Category</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Rating</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Message</code>.
                          </p>
                        </form>
                      </div>
                    )}

                    {/* Summary Statistics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {/* Card 1 */}
                      <div className="bg-white p-4 rounded-2xl border border-uday-peach/40 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Feedback</span>
                          <div className="w-8 h-8 rounded-xl bg-uday-crimson/10 flex items-center justify-center text-uday-crimson">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-2xl sm:text-3xl font-serif font-black text-uday-midnight">
                            {totalFeedbackCount}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {uniqueFeedbackEmails} unique {uniqueFeedbackEmails === 1 ? 'reader' : 'readers'}
                          </div>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-white p-4 rounded-2xl border border-uday-peach/40 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Rating</span>
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Star className="w-4 h-4 fill-amber-500" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-2xl sm:text-3xl font-serif font-black text-uday-midnight flex items-baseline gap-1">
                            {avgFeedbackRating}
                            <span className="text-xs text-gray-400 font-sans font-normal">/ 5.0</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map(starNum => (
                              <Star
                                key={starNum}
                                className={`w-3 h-3 ${
                                  starNum <= Math.round(Number(avgFeedbackRating))
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-white p-4 rounded-2xl border border-uday-peach/40 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Satisfaction</span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-2xl sm:text-3xl font-serif font-black text-uday-midnight">
                            {positiveSentimentPct}%
                          </div>
                          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                            {fiveStarFeedbackCount + fourStarFeedbackCount} ratings with 4-5 stars
                          </div>
                        </div>
                      </div>

                      {/* Card 4 */}
                      <div className="bg-white p-4 rounded-2xl border border-uday-peach/40 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">5-Star Reviews</span>
                          <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-2xl sm:text-3xl font-serif font-black text-uday-midnight">
                            {fiveStarFeedbackCount}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {totalFeedbackCount > 0 ? Math.round((fiveStarFeedbackCount / totalFeedbackCount) * 100) : 0}% of all submissions
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search and Filters Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-uday-peach/50 shadow-sm space-y-3">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search by name, email, department, or keyword in message..."
                            value={feedbackSearch}
                            onChange={e => setFeedbackSearch(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-uday-peach/60 rounded-xl pl-9 pr-9 py-2 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                          />
                          {feedbackSearch && (
                            <button
                              type="button"
                              onClick={() => setFeedbackSearch('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                          <select
                            value={feedbackCategoryFilter}
                            onChange={e => setFeedbackCategoryFilter(e.target.value)}
                            className="bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight font-medium focus:outline-none focus:border-uday-crimson"
                          >
                            <option value="ALL">All Categories</option>
                            {feedbackCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>

                          {/* Rating Filter */}
                          <select
                            value={feedbackRatingFilter}
                            onChange={e => setFeedbackRatingFilter(e.target.value)}
                            className="bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight font-medium focus:outline-none focus:border-uday-crimson"
                          >
                            <option value="ALL">All Ratings</option>
                            <option value="5">★ 5 Stars Only</option>
                            <option value="4">★ 4 Stars</option>
                            <option value="3">★ 3 Stars</option>
                            <option value="2">★ 2 Stars</option>
                            <option value="1">★ 1 Star</option>
                          </select>

                          {/* Sort Order */}
                          <select
                            value={feedbackSortOrder}
                            onChange={e => setFeedbackSortOrder(e.target.value as any)}
                            className="bg-[#FAF7F2] border border-uday-peach/60 rounded-xl px-3 py-2 text-xs text-uday-midnight font-medium focus:outline-none focus:border-uday-crimson"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="rating_high">Highest Rated</option>
                            <option value="rating_low">Lowest Rated</option>
                          </select>

                          {hasActiveFilters && (
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackSearch('');
                                setFeedbackCategoryFilter('ALL');
                                setFeedbackRatingFilter('ALL');
                              }}
                              className="px-3 py-2 text-xs font-bold text-uday-crimson hover:bg-uday-crimson/10 rounded-xl transition-colors whitespace-nowrap"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Result summary indicator */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                        <div>
                          Showing <strong className="text-uday-midnight">{filteredFeedback.length}</strong> of {totalFeedbackCount} responses
                          {hasActiveFilters && <span className="text-uday-crimson font-medium ml-1">(filtered)</span>}
                        </div>
                      </div>
                    </div>

                    {/* Feedback Reader Cards Feed */}
                    {filteredFeedback.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-uday-peach/40 p-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-uday-midnight">
                          {hasActiveFilters ? 'No Matching Feedback Found' : 'No Feedback Responses Yet'}
                        </h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          {hasActiveFilters
                            ? 'Try clearing your search query or adjusting your category and star rating filters.'
                            : 'When readers submit thoughts via the website feedback form, their messages will appear here.'}
                        </p>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackSearch('');
                              setFeedbackCategoryFilter('ALL');
                              setFeedbackRatingFilter('ALL');
                            }}
                            className="mt-2 px-4 py-2 bg-uday-midnight hover:bg-uday-crimson text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredFeedback.map(item => {
                          const initials = (item.name || 'Anonymous')
                            .split(' ')
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase();
                          const isCopied = copiedFeedbackId === item.id;
                          const isDeleting = deletingFeedbackId === item.id;

                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-2xl border border-uday-peach/50 hover:border-uday-peach/90 shadow-sm hover:shadow-md transition-all p-5 space-y-4"
                            >
                              {/* Card Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-3">
                                  {/* Avatar Initials */}
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-uday-midnight to-uday-crimson text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                    {initials}
                                  </div>

                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="font-serif text-base font-bold text-uday-midnight">
                                        {item.name}
                                      </h4>
                                      {item.rollOrDept && (
                                        <span className="bg-amber-50 text-amber-900 border border-amber-200/70 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                                          {item.rollOrDept}
                                        </span>
                                      )}
                                    </div>
                                    <a
                                      href={`mailto:${item.email}`}
                                      className="inline-flex items-center gap-1 text-xs text-uday-crimson hover:underline mt-0.5"
                                    >
                                      <Mail className="w-3 h-3" />
                                      <span>{item.email}</span>
                                    </a>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                                  {/* Category Badge */}
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                    {item.category || 'General Feedback'}
                                  </span>

                                  {/* Star Rating Badge */}
                                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold">
                                    <span className="text-amber-500 font-bold">★</span>
                                    <span>{item.rating}/5</span>
                                  </div>

                                  {/* Timestamp */}
                                  <div className="flex items-center gap-1 text-[11px] text-gray-400 pl-1">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Reader Message Content */}
                              <div className="bg-[#FAF7F2] rounded-xl p-4 sm:p-5 border border-uday-peach/30 text-uday-midnight text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans select-text">
                                {item.message}
                              </div>

                              {/* Card Footer Toolbar */}
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                  {/* Copy Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyFeedback(item)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                      isCopied
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                    }`}
                                  >
                                    {isCopied ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Text</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Direct Email Reply */}
                                  <a
                                    href={`mailto:${item.email}?subject=Regarding your Uday Magazine feedback`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Reply via Email</span>
                                  </a>
                                </div>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => handleDeleteFeedback(item.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

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

                  {/* DATA PERSISTENCE & GITHUB AUTO-SYNC CARD */}
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-uday-peach/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-uday-crimson/10 text-uday-crimson flex items-center justify-center font-bold shrink-0">
                        <Download className="w-5 h-5 text-uday-crimson" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-uday-midnight">Cloud Persistence & Database Backup</h4>
                        <p className="text-xs text-uday-midnight/70">
                          Prevent Render free-tier data loss when the web service spins down or restarts.
                        </p>
                      </div>
                    </div>

                    {githubSyncMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{githubSyncMsg}</span>
                      </div>
                    )}

                    <div className="text-xs text-uday-midnight/70 space-y-2">
                      <p>
                        On Render's free tier, the file system resets when the server goes to sleep after 15 minutes of inactivity. To ensure your magazine uploads, events, announcements, and directory changes <strong>persist permanently</strong>:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Option A: GitHub Auto-Sync:</strong> Enter your GitHub Personal Access Token (repo scope). Any change will automatically be committed to your repository's <code>server/data.json</code> file.</li>
                        <li><strong>Option B: 1-Click Backup:</strong> Download your live <code>data.json</code> directly to your computer at any time.</li>
                      </ul>
                    </div>

                    {/* GitHub Sync Form */}
                    <form onSubmit={handleSaveGithubToken} className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-uday-midnight mb-1">GitHub Personal Access Token (PAT)</label>
                        <input
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          value={githubTokenInput}
                          onChange={e => setGithubTokenInput(e.target.value)}
                          className="w-full bg-white border border-uday-peach/60 rounded-xl px-4 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={savingGithubToken}
                          className="px-5 py-2.5 bg-uday-midnight hover:bg-uday-crimson text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${savingGithubToken ? 'animate-spin' : ''}`} />
                          <span>{savingGithubToken ? 'Saving & Syncing...' : 'Save Token & Sync to GitHub'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadBackup}
                          className="px-5 py-2.5 bg-white border border-uday-peach/70 hover:bg-uday-cream text-uday-midnight rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5 text-uday-crimson" />
                          <span>Download data.json Backup</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
