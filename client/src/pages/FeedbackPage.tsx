import React, { useState } from 'react';
import { FileSpreadsheet, Send, Star, CheckCircle2, AlertCircle, HelpCircle, Copy, Check } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollOrDept, setRollOrDept] = useState('');
  const [category, setCategory] = useState('Magazine Content');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSheetsGuide, setShowSheetsGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please enter your Name, Email, and Feedback Message.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          rollOrDept,
          category,
          rating,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setRollOrDept('');
      setMessage('');
      setRating(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  const sampleAppsScript = `// ----------------------------------------------------
// Google Apps Script to connect Uday Magazine Feedback directly to Google Sheets
// 1. Open your Google Sheet -> Extensions -> Apps Script
// 2. Paste this code and click Deploy -> New Deployment -> Web App
// 3. Set "Execute as: Me" and "Who has access: Anyone"
// 4. Copy the Web App URL and paste it in Uday Admin Portal Settings!
// ----------------------------------------------------

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Roll/Dept", "Category", "Rating", "Message"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.rollOrDept || "",
      data.category || "",
      data.rating || 5,
      data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(sampleAppsScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-uday-sage/15 text-uday-forest font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Direct Google Sheets Collection
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-uday-midnight">
          Feedback & <span className="text-uday-crimson">Suggestions Desk</span>
        </h1>
        <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
          Your feedback, critiques, and ideas directly shape future editions of Uday. All entries and email addresses are logged directly into our centralized editorial Google Sheet.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-uday-peach/60 p-6 sm:p-10 shadow-xl relative">
        
        {/* Status bar */}
        <div className="flex items-center justify-between bg-[#FAF7F2] border border-uday-peach/40 rounded-2xl p-3 px-4 mb-6 text-xs text-uday-midnight/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Google Sheets Sync Active</span>
          </div>
          <button
            onClick={() => setShowSheetsGuide(true)}
            className="text-uday-teal hover:text-uday-midnight font-bold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Setup Guide
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-12 space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-uday-midnight">Feedback Received!</h3>
            <p className="text-sm text-uday-midnight/75 max-w-md mx-auto">
              Thank you for contributing to Uday. Your email and thoughts have been recorded and synced to our editorial records.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-uday-crimson text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-warm"
            >
              Send Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sayandeep Biswas"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-uday-peach/50 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                  Email Address * (Synced to Google Sheets)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@iiserb.ac.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-uday-peach/50 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                  Roll No / Department (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BS-MS Batch '22 / Faculty"
                  value={rollOrDept}
                  onChange={e => setRollOrDept(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-uday-peach/50 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-uday-peach/50 rounded-xl px-4 py-3 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson"
                >
                  <option value="Magazine Content">Magazine Content (Vol 11)</option>
                  <option value="Layout & Design">Visual Layout & Artwork</option>
                  <option value="Website Experience">Website Experience</option>
                  <option value="Submissions Inquiry">Submissions & Entries</option>
                  <option value="General Suggestion">General Suggestion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-2 uppercase tracking-wider">
                Rating of Uday Magazine & Editorial Experience
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-uday-orange fill-uday-orange'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-uday-midnight/70 font-semibold ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">
                Your Feedback or Suggestion *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Share your thoughts, suggestions for Volume 12, or critique..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-uday-peach/50 rounded-xl p-4 text-sm text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Recording to Google Sheets...' : 'Submit Feedback to Google Sheets'}</span>
            </button>
          </form>
        )}

      </div>

      {/* Guide Modal */}
      {showSheetsGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-uday-peach p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl animate-scaleUp max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowSheetsGuide(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-uday-sage font-bold text-xs uppercase tracking-widest mb-1">
              <FileSpreadsheet className="w-4 h-4" /> Google Sheets Integration Guide
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-uday-midnight mb-2">
              Connect Feedback Directly to Google Sheets
            </h3>
            
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-uday-midnight/80 mb-4 bg-[#FAF7F2] p-4 rounded-xl border border-uday-peach/40">
              <li>Create a Google Sheet in your Google Drive.</li>
              <li>Go to <strong>Extensions &gt; Apps Script</strong> and paste the snippet below.</li>
              <li>Click <strong>Deploy &gt; New Deployment &gt; Web App</strong> (Execute as: Me, Access: Anyone).</li>
              <li>Copy the resulting Web App URL and paste it into the <strong>Admin Dashboard Settings</strong>.</li>
            </ol>

            <div className="relative mb-6">
              <pre className="bg-uday-midnight text-uday-peach p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-56">
                {sampleAppsScript}
              </pre>
              <button
                onClick={copyScript}
                className="absolute top-3 right-3 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSheetsGuide(false)}
                className="px-6 py-2.5 bg-uday-midnight text-white text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
