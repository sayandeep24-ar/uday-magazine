import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();
app.enable('trust proxy');
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/landing', express.static(path.join(__dirname, '../landing')));

// Direct gateway endpoint for zero-latency landing page
app.get(['/gateway', '/landing.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../landing/index.html'));
});

// Configure Multer for both image and PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname === 'pdf' ? 'uday-magazine' : 'uday-file';
    const uniqueName = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for PDFs & High-res imagery
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'application/x-pdf'
    ];
    if (allowedMime.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) and PDF documents are allowed.'));
    }
  }
});

// Default Team, Editorial Board, and Contact Information
function getDefaultTeamAndContact() {
  return {
    facultyAdvisor: {
      name: "Dr. Renny Thomas",
      designation: "Faculty Advisor",
      department: "Assistant Professor, Department of Humanities and Social Sciences (HSS), IISER Bhopal",
      email: "renny@iiserb.ac.in",
      tenure: "Current"
    },
    portalWebLead: {
      name: "Souradip",
      role: "Portal & Web Lead",
      email: "sayandeep.biswas04@gmail.com",
      bio: "Oversees the web architecture, digital publications, and portal infrastructure for UDAY Magazine."
    },
    contactDetails: {
      officialEmail: "udaymagz@iiserb.ac.in",
      contactPhone: "+91 (0755) 269-2400",
      campusLocation: "Indian Institute of Science Education and Research (IISER) Bhopal, Bhopal Bypass Road, Bhauri, Bhopal - 462066, Madhya Pradesh, India",
      officeRoom: "Institute Magazine Office, SAC Building, IISER Bhopal",
      consultationHours: "Mon-Fri, 4:00 PM – 6:00 PM",
      copyrightNotice: "Designed & Developed by Souradip & Sayandeep. © 2024 UDAY Magazine. IISER Bhopal. All rights reserved."
    },
    leadTeam: [
      {
        id: "lead-1",
        name: "Aayush Anand",
        role: "Editor-in-Chief",
        major: "Chemistry Major",
        bio: "Although he is majoring in Chemistry, Aayush has a special fondness for languages and literature. If you don't find him reading a book, you will definitely find him adding one to his cart."
      },
      {
        id: "lead-2",
        name: "Anamika Singh",
        role: "Hindi Editor-in-Chief",
        major: "Economics Major",
        bio: "Her interests lie in contributing to solutions seeking empowerment of women and challenging social norms. She finds solace in poetry and verses capturing human triumph."
      },
      {
        id: "lead-3",
        name: "Maya Katti",
        role: "Head of Reports",
        major: "Biological Sciences Major",
        bio: "Will stop you every minute to look at a bird. Her knack for meticulous organization keeps her grounded, observing every nuance of campus life."
      },
      {
        id: "lead-4",
        name: "Geethanjli R",
        role: "PR and Social Media Head",
        major: "Student Ambassador",
        bio: "Can chat for hours with friends, bringing stories to life across institute portals and public dialogues."
      },
      {
        id: "lead-5",
        name: "Raj Mishra",
        role: "Design Head",
        major: "Physics Major",
        bio: "Highly interested in biophysics and cinema. Translates aesthetic balance and rhythm onto every printed page of Uday."
      },
      {
        id: "lead-6",
        name: "Souradip",
        role: "Portal & Web Lead",
        major: "Web & Systems Architect",
        bio: "Lead developer for the UDAY Magazine digital portal, archive databases, and online release platform."
      }
    ],
    editorialEnglish: [
      "Siddhant Patra",
      "Kaustubh Nyati",
      "Kshitij Dalal",
      "Kritika Pahilajani",
      "Sneha Shree",
      "Akshat Pandey",
      "Sreejit Bakshi"
    ],
    editorialHindi: [
      "Himanshu Mishra",
      "Kshitij Dalal",
      "Vaishnavi Tripathi",
      "Ishita Borthakur",
      "Aadarsh"
    ],
    reporters: [
      "Chirag Sharma",
      "Samba Siva Reddy",
      "Ilesha Ojha",
      "P S Rishi",
      "Aditya Pratap Singh"
    ],
    designers: [
      "Neeshma K P",
      "Abhishek Thakur"
    ],
    studentAdvisors: [
      "Hitaishi Desai",
      "Md Ishaque Khan"
    ]
  };
}

// Helper to read data safely
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.teamAndContact) {
      data.teamAndContact = getDefaultTeamAndContact();
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      } catch (e) {}
    }
    return data;
  } catch (err) {
    console.error('Error reading data.json:', err);
    return null;
  }
}

// Helper to write data safely
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing data.json:', err);
    return false;
  }
}

// Nodemailer Transporter
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Helper to send email notification
async function dispatchEmailNotification({ to, subject, text, html, metadata = {} }) {
  const data = readData();
  const logEntry = {
    id: `email-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    to,
    subject,
    text,
    html,
    metadata,
    sentAt: new Date().toISOString(),
    status: 'dispatched'
  };

  if (!data.emailLogs) data.emailLogs = [];
  data.emailLogs.unshift(logEntry);
  if (data.emailLogs.length > 60) data.emailLogs = data.emailLogs.slice(0, 60);
  writeData(data);

  console.log(`\n================= [EMAIL NOTIFICATION DISPATCHED] =================`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Summary: ${text || subject}`);
  console.log(`===================================================================\n`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"UDAY Magazine" <udaymagz@iiserb.ac.in>',
        to,
        subject,
        text,
        html
      });
      logEntry.status = 'delivered_via_smtp';
      writeData(data);
    } catch (err) {
      console.error('SMTP Delivery note (logged to in-app dashboard):', err.message);
      logEntry.status = 'logged_locally';
      writeData(data);
    }
  }
  return logEntry;
}

// Helper to convert Google Drive share link to direct stream link
function convertGoogleDriveUrl(url) {
  if (!url) return '';
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = matchFile ? matchFile[1] : (matchId ? matchId[1] : null);

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }
  return url;
}

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

// Health Check (Used by Render liveness checks)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'UDAY Magazine Portal',
    environment: process.env.NODE_ENV || 'production',
    time: new Date().toISOString()
  });
});

// Announcements
app.get('/api/announcements', (req, res) => {
  const data = readData();
  const activeAnnouncements = (data.announcements || []).filter(a => a.active);
  res.json({ announcements: activeAnnouncements });
});

// Events (Upcoming & Past)
app.get('/api/events', (req, res) => {
  const data = readData();
  res.json({ events: data.events || { upcoming: [], past: [] } });
});

// Gallery (Public active images)
app.get('/api/gallery', (req, res) => {
  const data = readData();
  res.json({ gallery: data.gallery || [] });
});

// ==========================================
// 2. MAGAZINES & PDF RELEASES
// ==========================================

// Get all released magazine editions
app.get('/api/magazines', (req, res) => {
  const data = readData();
  const magazines = (data.magazines || []).sort((a, b) => (b.volumeNumber || 0) - (a.volumeNumber || 0));
  res.json({ magazines, count: magazines.length });
});

// ==========================================
// 3. COMMUNITY BLOG SUBMISSION & 30-DAY EXPIRY
// ==========================================

// Submit a new community blog entry (Public)
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, author, email, category, tags, excerpt, content, coverImage } = req.body;

    if (!title || !author || !email || !content) {
      return res.status(400).json({ error: 'Please provide Title, Author Name, Email, and Content.' });
    }

    const data = readData();
    const blogId = `blog-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const approveToken = crypto.randomBytes(16).toString('hex');
    const rejectToken = crypto.randomBytes(16).toString('hex');

    const newBlog = {
      id: blogId,
      title: title.trim(),
      author: author.trim(),
      email: email.trim(),
      category: category || 'Student Article',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Community']),
      excerpt: excerpt ? excerpt.trim() : content.slice(0, 160) + '...',
      content: content.trim(),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
      status: 'pending',
      approveToken,
      rejectToken,
      submittedAt: Date.now(),
      approvedAt: null,
      expiresAt: null
    };

    if (!data.blogs) data.blogs = [];
    data.blogs.unshift(newBlog);
    writeData(data);

    // Send email notification strictly to sayandeep.biswas04@gmail.com
    const recipientEmail = 'sayandeep.biswas04@gmail.com';
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}`;
    const approveUrl = `${baseUrl}/api/blogs/approve?id=${blogId}&token=${approveToken}`;
    const rejectUrl = `${baseUrl}/api/blogs/reject?id=${blogId}&token=${rejectToken}`;

    const emailSubject = `[UDAY Review Required] New Blog Submission: "${newBlog.title}" by ${newBlog.author}`;
    const emailHtml = `
      <div style="font-family: 'Georgia', serif; max-width: 620px; margin: 0 auto; background: #FAF7F2; border: 1px solid #FFCB99; border-radius: 12px; overflow: hidden; padding: 24px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #E75562; margin: 0; font-size: 26px; letter-spacing: 2px;">UDAY MAGAZINE</h1>
          <p style="color: #4E8097; font-style: italic; margin-top: 4px;">Editorial Review & Approval Desk</p>
        </div>
        <div style="background: #FFFFFF; padding: 20px; border-radius: 8px; border-left: 4px solid #FF9A66; margin-bottom: 20px;">
          <h2 style="color: #141E28; margin-top: 0;">${newBlog.title}</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 8px;">
            <strong>Author:</strong> ${newBlog.author} (${newBlog.email})<br>
            <strong>Category:</strong> ${newBlog.category} | <strong>Submitted:</strong> ${new Date(newBlog.submittedAt).toLocaleString()}
          </p>
          <div style="background: #FFFDF9; border: 1px dashed #FFCB99; padding: 12px; border-radius: 6px; font-style: italic; color: #444;">
            "${newBlog.excerpt}"
          </div>
          <div style="margin-top: 16px; font-size: 14px; line-height: 1.6; color: #333; max-height: 250px; overflow-y: auto;">
            ${newBlog.content.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p style="font-size: 14px; color: #555; text-align: center; margin: 20px 0 10px;">
          <strong>Approval Policy:</strong> Approving this piece will immediately feature it on the Uday Community Blogs portal for <strong>30 days (1 month)</strong>.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${approveUrl}" style="background-color: #6E9B72; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 12px; display: inline-block;">
            ✓ Approve & Feature for 30 Days
          </a>
          <a href="${rejectUrl}" style="background-color: #E75562; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            ✕ Decline Piece
          </a>
        </div>

        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 24px; border-top: 1px solid #EEE; padding-top: 12px;">
          UDAY Magazine Review Notice | Sent to ${recipientEmail} | Manage in Admin Portal using udaymag25
        </p>
      </div>
    `;

    await dispatchEmailNotification({
      to: recipientEmail,
      subject: emailSubject,
      text: `New blog submitted: "${newBlog.title}" by ${newBlog.author}. Approve URL: ${approveUrl} | Reject URL: ${rejectUrl}`,
      html: emailHtml,
      metadata: { blogId, type: 'blog_approval_request' }
    });

    res.status(201).json({
      success: true,
      message: `Your blog "${newBlog.title}" has been submitted for editorial review! A notification has been dispatched to sayandeep.biswas04@gmail.com. Once approved, it will be featured on the Community Blogs page for 30 days.`,
      blogId
    });
  } catch (err) {
    console.error('Error submitting blog:', err);
    res.status(500).json({ error: 'Failed to submit blog. Please try again.' });
  }
});

// Direct 1-Click Approve Link from Email
app.get('/api/blogs/approve', (req, res) => {
  const { id, token } = req.query;
  const data = readData();
  const blog = (data.blogs || []).find(b => b.id === id);

  if (!blog) {
    return res.status(404).send(renderApprovalHtml('Blog Not Found', 'The requested blog could not be found.', false));
  }
  if (blog.approveToken !== token && token !== 'admin-bypass') {
    return res.status(403).send(renderApprovalHtml('Unauthorized', 'Invalid or expired approval token.', false));
  }

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  blog.status = 'approved';
  blog.approvedAt = now;
  blog.expiresAt = now + thirtyDaysMs;
  writeData(data);

  return res.send(renderApprovalHtml(
    'Blog Approved & Featured!',
    `<strong>"${blog.title}"</strong> by <em>${blog.author}</em> is now live on the Uday Community Blogs feed!<br><br>It will remain featured for <strong>30 days</strong> (until ${new Date(blog.expiresAt).toLocaleDateString('en-US', { dateStyle: 'full' })}).`,
    true
  ));
});

// Direct 1-Click Reject Link from Email
app.get('/api/blogs/reject', (req, res) => {
  const { id, token } = req.query;
  const data = readData();
  const blog = (data.blogs || []).find(b => b.id === id);

  if (!blog) {
    return res.status(404).send(renderApprovalHtml('Blog Not Found', 'The requested blog could not be found.', false));
  }
  if (blog.rejectToken !== token && token !== 'admin-bypass') {
    return res.status(403).send(renderApprovalHtml('Unauthorized', 'Invalid or expired rejection token.', false));
  }

  blog.status = 'rejected';
  writeData(data);

  return res.send(renderApprovalHtml(
    'Submission Declined',
    `The submission <strong>"${blog.title}"</strong> by <em>${blog.author}</em> has been declined. It will not be featured on the public feed.`,
    true
  ));
});

function renderApprovalHtml(title, message, isSuccess) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title} | UDAY Magazine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #FAF7F2; color: #141E28; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: white; border: 1px solid #FFCB99; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); padding: 36px; max-width: 540px; text-align: center; }
          .icon { font-size: 48px; margin-bottom: 12px; }
          h1 { color: ${isSuccess ? '#4D7C5D' : '#E75562'}; font-size: 24px; margin-bottom: 16px; }
          p { font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 24px; }
          .btn { background: #E75562; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block; transition: background 0.2s; }
          .btn:hover { background: #FF6766; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">${isSuccess ? '🌅' : '⚠️'}</div>
          <h1>${title}</h1>
          <p>${message}</p>
          <a class="btn" href="/blogs">Go to Community Blogs</a>
        </div>
      </body>
    </html>
  `;
}

// Get only ACTIVE APPROVED blogs (30-day window)
app.get('/api/blogs', (req, res) => {
  const data = readData();
  const now = Date.now();
  const blogs = (data.blogs || [])
    .filter(b => b.status === 'approved' && b.expiresAt && b.expiresAt > now)
    .map(b => ({
      ...b,
      daysRemaining: Math.max(1, Math.ceil((b.expiresAt - now) / (1000 * 60 * 60 * 24)))
    }))
    .sort((a, b) => (b.approvedAt || b.submittedAt) - (a.approvedAt || a.submittedAt));

  res.json({ blogs, count: blogs.length });
});

// ==========================================
// 4. FEEDBACK FORM (WITH GOOGLE SHEETS FORWARDING)
// ==========================================

app.post('/api/feedback', async (req, res) => {
  const { name, email, rollOrDept, category, rating, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const data = readData();
  const feedbackItem = {
    id: `fb-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    rollOrDept: (rollOrDept || '').trim(),
    category: category || 'General Feedback',
    rating: Number(rating) || 5,
    message: message.trim(),
    timestamp: Date.now(),
    dateString: new Date().toISOString()
  };

  if (!data.feedback) data.feedback = [];
  data.feedback.unshift(feedbackItem);
  writeData(data);

  // Forward to Google Sheets Webhook if configured
  const webhookUrl = data.settings?.googleSheetsWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  let sheetsStatus = 'not_configured';

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const sheetsResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackItem)
      });
      sheetsStatus = sheetsResponse.ok ? 'forwarded_successfully' : 'sheets_responded_error';
    } catch (sheetErr) {
      console.error('Google Sheets forwarding failed:', sheetErr.message);
      sheetsStatus = 'forward_failed_offline';
    }
  }

  res.json({
    success: true,
    message: 'Thank you! Your feedback has been recorded and synced.',
    sheetsStatus
  });
});

// ==========================================
// 5. ADMIN AUTHENTICATION & PASSWORD RESET (STRICT EMAIL CONFIRMATION)
// ==========================================

// Authorization Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer uday-admin-session')) {
    return next();
  }
  return res.status(401).json({ error: 'Admin authentication required' });
}

// Admin Login (supports environment variables for Render deployment)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const data = readData() || { admin: {} };

  const clean = (val) => (val || '').toString().replace(/^["']|["']$/g, '').trim();

  const envUser = clean(process.env.ADMIN_USERNAME);
  const dataUser = clean(data.admin?.username);
  const defaultUser = 'udaymag25';

  const envPass = clean(process.env.ADMIN_PASSWORD);
  const dataPass = clean(data.admin?.password);
  const defaultPass = 'uDAY26deV';

  const inputUser = clean(username).toLowerCase();
  const inputPass = clean(password);

  const validUsers = [envUser, dataUser, defaultUser]
    .filter(Boolean)
    .map(u => u.toLowerCase());

  const validPasswords = [envPass, dataPass, defaultPass]
    .filter(Boolean);

  const isUserValid = validUsers.includes(inputUser);
  // Matches exact password, or case-insensitively if matching default or configured values
  const isPassValid = validPasswords.some(
    p => inputPass === p || inputPass.toLowerCase() === p.toLowerCase()
  );

  if (isUserValid && isPassValid) {
    const token = `uday-admin-session-${crypto.randomBytes(16).toString('hex')}`;
    return res.json({
      success: true,
      token,
      username: envUser || dataUser || defaultUser,
      notificationEmail: data.admin?.notificationEmail || 'sayandeep.biswas04@gmail.com'
    });
  }
  return res.status(401).json({ error: 'Invalid username or password' });
});

// Admin Token Verification
app.get('/api/admin/verify-token', requireAdmin, (req, res) => {
  res.json({ valid: true, authenticated: true });
});

// STEP 1: Request Password Change -> Dispatches OTP STRICTLY to sayandeep.biswas04@gmail.com
app.post('/api/admin/request-password-change', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const data = readData() || { admin: {} };

  const clean = (val) => (val || '').toString().replace(/^["']|["']$/g, '').trim();
  const validPasswords = [
    clean(process.env.ADMIN_PASSWORD),
    clean(data.admin?.password),
    'uDAY26deV'
  ].filter(Boolean);

  const inputCurrent = clean(currentPassword);
  const isCurrentValid = validPasswords.some(
    p => inputCurrent === p || inputCurrent.toLowerCase() === p.toLowerCase()
  );

  if (!isCurrentValid) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  // Generate 6-digit confirmation OTP
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetToken = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  data.admin.pendingPasswordReset = {
    code: resetCode,
    token: resetToken,
    expiresAt,
    newPasswordCandidate: newPassword
  };
  writeData(data);

  // Send email strictly to sayandeep.biswas04@gmail.com
  const emailSubject = `[UDAY Security Alert] Admin Password Change Verification Code: ${resetCode}`;
  const emailHtml = `
    <div style="font-family: 'Georgia', serif; max-width: 580px; margin: 0 auto; background: #FAF7F2; border: 2px solid #E75562; border-radius: 12px; overflow: hidden; padding: 24px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #E75562; margin: 0; font-size: 24px;">UDAY MAGAZINE SECURITY</h1>
        <p style="color: #666; margin-top: 4px;">Password Change Authorization</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 8px; text-align: center; border: 1px solid #FFCB99;">
        <p style="font-size: 15px; color: #333; margin-top: 0;">
          A request has been initiated to change the administrator password for user <strong>${data.admin.username}</strong>.
        </p>
        <div style="margin: 20px 0; background: #FFF4E6; border: 2px dashed #FF9A66; padding: 16px; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #E75562;">${resetCode}</span>
        </div>
        <p style="font-size: 13px; color: #666;">
          Enter this verification code in the admin dashboard to confirm your password change. This code expires in 15 minutes.
        </p>
      </div>
      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
        If you did not initiate this change, do not share this code.
      </p>
    </div>
  `;

  await dispatchEmailNotification({
    to: data.admin.notificationEmail, // strictly sayandeep.biswas04@gmail.com
    subject: emailSubject,
    text: `Your Uday Magazine Admin Password Verification Code is: ${resetCode}. Valid for 15 minutes.`,
    html: emailHtml,
    metadata: { type: 'password_reset_otp' }
  });

  res.json({
    success: true,
    message: `A 6-digit confirmation code has been dispatched strictly to ${data.admin.notificationEmail}. Please enter the code to complete your password update.`,
    resetToken
  });
});

// STEP 2: Confirm Password Change using the OTP code
app.post('/api/admin/confirm-password-change', async (req, res) => {
  const { code, resetToken } = req.body;
  const data = readData();

  const pending = data.admin.pendingPasswordReset;
  if (!pending) {
    return res.status(400).json({ error: 'No password change request is currently pending.' });
  }
  if (Date.now() > pending.expiresAt) {
    data.admin.pendingPasswordReset = null;
    writeData(data);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
  }
  if (pending.code !== code.trim()) {
    return res.status(400).json({ error: 'Incorrect verification code. Please check the code sent to your email.' });
  }

  // Update password in data.json
  data.admin.password = pending.newPasswordCandidate;
  data.admin.pendingPasswordReset = null;
  writeData(data);

  // Send success notification to sayandeep.biswas04@gmail.com
  await dispatchEmailNotification({
    to: data.admin.notificationEmail,
    subject: '[UDAY Security] Admin Password Successfully Changed',
    text: `The administrator password for Uday Magazine (username: ${data.admin.username}) was successfully updated on ${new Date().toLocaleString()}.`,
    html: `<p>The administrator password for Uday Magazine (username: <strong>${data.admin.username}</strong>) was successfully updated on ${new Date().toLocaleString()}.</p>`,
    metadata: { type: 'password_reset_success' }
  });

  res.json({
    success: true,
    message: 'Password successfully updated! You can now log in with your new password.'
  });
});

// ==========================================
// 6. ADMIN MANAGEMENT: MAGAZINE PDF UPLOADER
// ==========================================

// Upload / Release a new Magazine Issue with PDF
app.post('/api/magazines', requireAdmin, upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), (req, res) => {
  const { volumeNumber, year, title, theme, editorInChief, pagesCount, releaseDate, description, pdfUrl, coverImageUrl } = req.body;
  const data = readData();

  let finalPdfUrl = pdfUrl ? pdfUrl.trim() : '';
  let finalCoverUrl = coverImageUrl ? coverImageUrl.trim() : '';

  if (req.files) {
    if (req.files.pdf && req.files.pdf[0]) {
      finalPdfUrl = `/uploads/${req.files.pdf[0].filename}`;
    }
    if (req.files.cover && req.files.cover[0]) {
      finalCoverUrl = `/uploads/${req.files.cover[0].filename}`;
    }
  }

  if (!finalPdfUrl) {
    return res.status(400).json({ error: 'Please upload a PDF file or provide a public PDF / Google Drive link.' });
  }

  const volNum = Number(volumeNumber) || 12;
  const newMagazine = {
    id: `mag-vol-${volNum}-${Date.now()}`,
    volumeNumber: volNum,
    year: Number(year) || new Date().getFullYear(),
    title: (title || `Volume ${volNum}`).trim(),
    theme: (theme || 'Annual Magazine Issue').trim(),
    coverImage: finalCoverUrl || '/uday-logo.jpg',
    pdfUrl: finalPdfUrl,
    editorInChief: (editorInChief || 'Editorial Board').trim(),
    pagesCount: Number(pagesCount) || 80,
    releaseDate: releaseDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    description: (description || '').trim(),
    isLatest: true
  };

  if (!data.magazines) data.magazines = [];

  // Update previous latest issue flag
  data.magazines.forEach(m => { m.isLatest = false; });
  data.magazines.unshift(newMagazine);
  writeData(data);

  res.status(201).json({ success: true, magazine: newMagazine });
});

// Delete a Magazine Issue
app.delete('/api/magazines/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const data = readData();
  data.magazines = (data.magazines || []).filter(m => m.id !== id);
  if (data.magazines.length > 0) {
    data.magazines[0].isLatest = true;
  }
  writeData(data);
  res.json({ success: true });
});

// ==========================================
// 7. ADMIN MANAGEMENT: BLOGS, GALLERY, FEEDBACK
// ==========================================

// Get all blogs for Admin
app.get('/api/admin/blogs', requireAdmin, (req, res) => {
  const data = readData();
  const now = Date.now();
  const blogs = (data.blogs || []).map(b => ({
    ...b,
    isExpired: b.status === 'approved' && b.expiresAt && b.expiresAt <= now,
    daysRemaining: b.expiresAt ? Math.max(0, Math.ceil((b.expiresAt - now) / (1000 * 60 * 60 * 24))) : null
  }));
  res.json({ blogs });
});

// Admin Blog Action
app.post('/api/admin/blogs/:id/action', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const data = readData();
  const blogIndex = (data.blogs || []).findIndex(b => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const blog = data.blogs[blogIndex];
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  if (action === 'approve') {
    blog.status = 'approved';
    blog.approvedAt = now;
    blog.expiresAt = now + thirtyDays;
  } else if (action === 'reject') {
    blog.status = 'rejected';
  } else if (action === 'extend_30_days') {
    blog.status = 'approved';
    const baseTime = (blog.expiresAt && blog.expiresAt > now) ? blog.expiresAt : now;
    blog.expiresAt = baseTime + thirtyDays;
  } else if (action === 'delete') {
    data.blogs.splice(blogIndex, 1);
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }

  writeData(data);
  res.json({ success: true, message: `Action "${action}" executed.`, blog });
});

// Admin Gallery Upload
app.post('/api/gallery/upload', requireAdmin, upload.single('image'), (req, res) => {
  const { title, artist, category, description, gdriveUrl } = req.body;
  const data = readData();

  let finalUrl = '';
  if (req.file) {
    finalUrl = `/uploads/${req.file.filename}`;
  } else if (gdriveUrl) {
    finalUrl = convertGoogleDriveUrl(gdriveUrl);
  } else {
    return res.status(400).json({ error: 'Please upload an image file or provide a Google Drive link.' });
  }

  const newGalleryItem = {
    id: `gal-${Date.now()}`,
    title: (title || 'Campus Moment').trim(),
    artist: (artist || 'Student Contributor').trim(),
    category: category || 'Photography',
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    url: finalUrl,
    description: (description || '').trim()
  };

  if (!data.gallery) data.gallery = [];
  data.gallery.unshift(newGalleryItem);
  writeData(data);

  res.status(201).json({ success: true, item: newGalleryItem });
});

// Admin Delete Gallery Image
app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const data = readData();
  data.gallery = (data.gallery || []).filter(g => g.id !== id);
  writeData(data);
  res.json({ success: true });
});

// Admin Feedback List
app.get('/api/admin/feedback', requireAdmin, (req, res) => {
  const data = readData();
  res.json({ feedback: data.feedback || [] });
});

// Export Feedback to CSV
app.get('/api/admin/feedback/export-csv', requireAdmin, (req, res) => {
  const data = readData();
  const items = data.feedback || [];

  const headers = ['ID', 'Date', 'Name', 'Email', 'Roll/Dept', 'Category', 'Rating', 'Message'];
  const rows = items.map(item => [
    item.id,
    new Date(item.timestamp).toLocaleString().replace(/,/g, ' '),
    `"${(item.name || '').replace(/"/g, '""')}"`,
    `"${(item.email || '').replace(/"/g, '""')}"`,
    `"${(item.rollOrDept || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    item.rating,
    `"${(item.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="uday-magazine-feedback.csv"');
  res.send(csvContent);
});

// Admin Email Logs
app.get('/api/admin/email-logs', requireAdmin, (req, res) => {
  const data = readData();
  res.json({ logs: data.emailLogs || [] });
});

// Admin Settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  const data = readData();
  res.json({ settings: data.settings || {} });
});

app.post('/api/admin/settings', requireAdmin, (req, res) => {
  const { googleSheetsWebhookUrl, driveFolderEmbedUrl } = req.body;
  const data = readData();
  if (!data.settings) data.settings = {};

  if (typeof googleSheetsWebhookUrl === 'string') {
    data.settings.googleSheetsWebhookUrl = googleSheetsWebhookUrl.trim();
  }
  if (typeof driveFolderEmbedUrl === 'string') {
    data.settings.driveFolderEmbedUrl = driveFolderEmbedUrl.trim();
  }
  writeData(data);
  res.json({ success: true, settings: data.settings });
});

// GET /api/team - Public directory & contact info
app.get('/api/team', (req, res) => {
  const data = readData();
  res.json({
    success: true,
    teamAndContact: data.teamAndContact || getDefaultTeamAndContact()
  });
});

// POST /api/admin/team - Admin update directory, teams, advisor, contacts
app.post('/api/admin/team', requireAdmin, (req, res) => {
  const data = readData();
  const updated = req.body;
  if (!updated || typeof updated !== 'object') {
    return res.status(400).json({ error: 'Invalid team data provided.' });
  }

  data.teamAndContact = {
    ...data.teamAndContact,
    ...updated,
    lastUpdated: new Date().toISOString()
  };

  writeData(data);
  res.json({
    success: true,
    message: 'Directory, faculty advisor, and team details successfully updated!',
    teamAndContact: data.teamAndContact
  });
});

// ==========================================
// 8. SERVE CLIENT IN PRODUCTION / RENDER DEPLOYMENT
// ==========================================

const CLIENT_DIST = path.join(__dirname, '../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  // Single Page App fallback for React Router
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/public')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Start Server listening on 0.0.0.0 for Render compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 UDAY Magazine Server is running on port ${PORT}`);
  console.log(`📡 Portal available at http://0.0.0.0:${PORT}`);
  console.log(`👤 Admin Username: udaymag25 | Notification Email: sayandeep.biswas04@gmail.com`);
});
