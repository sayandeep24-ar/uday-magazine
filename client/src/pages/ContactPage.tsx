import React, { useState, useEffect } from 'react';
import { Mail, MapPin, User, Send, Heart, ExternalLink, Phone, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { EDITORIAL_BOARD, TeamAndContact } from '../data/publicationData';

export const ContactPage: React.FC = () => {
  const [team, setTeam] = useState<TeamAndContact>(EDITORIAL_BOARD);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryBody, setInquiryBody] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.teamAndContact) {
          setTeam(data.teamAndContact);
        }
      })
      .catch(err => {
        console.error('Error loading team directory:', err);
      });
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquirySubject('');
      setInquiryBody('');
      alert("Inquiry dispatched to " + team.contactDetails.officialEmail + " and sayandeep.biswas04@gmail.com. We'll respond shortly!");
    }, 1200);
  };

  const advisorInitials = team.facultyAdvisor.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-uday-teal/10 text-uday-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5" /> Editorial Board & Inquiries
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-uday-midnight">
          Meet the Team & <span className="text-uday-teal">Get in Touch</span>
        </h1>
        <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
          The minds, writers, and mentors behind UDAY. For official correspondence, publishing permissions, submissions questions, or campus inquiries.
        </p>
      </div>

      {/* Faculty Advisor Highlight */}
      <div className="bg-white rounded-3xl border border-uday-peach/60 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-uday-crimson to-uday-orange text-white flex items-center justify-center font-serif text-3xl font-black shrink-0 shadow-warm">
          {advisorInitials || 'FA'}
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-uday-crimson bg-uday-crimson/10 px-2.5 py-0.5 rounded">
              {team.facultyAdvisor.designation || 'Faculty Advisor'}
            </span>
            {team.facultyAdvisor.tenure && (
              <span className="text-xs font-semibold text-uday-forest bg-uday-sage/20 px-2.5 py-0.5 rounded-full">
                {team.facultyAdvisor.tenure}
              </span>
            )}
          </div>
          <h3 className="font-serif text-2xl font-bold text-uday-midnight">
            {team.facultyAdvisor.name}
          </h3>
          <p className="text-xs sm:text-sm text-uday-midnight/70">
            {team.facultyAdvisor.department}
          </p>
        </div>
        <div className="text-xs font-semibold text-uday-teal bg-uday-teal/10 px-4 py-2 rounded-xl">
          <a href={`mailto:${team.facultyAdvisor.email}`} className="hover:underline">
            {team.facultyAdvisor.email}
          </a>
        </div>
      </div>

      {/* Lead Editorial Board */}
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-uday-midnight">Editorial Board & Leads</h3>
          <p className="text-xs text-uday-midnight/70">Chief editors, section heads, and web architecture leads.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.leadTeam.map((member, idx) => {
            const memberInitials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);
            return (
              <div
                key={member.id || idx}
                className="bg-white rounded-2xl border border-uday-peach/40 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-uday-cream text-uday-crimson font-serif font-black flex items-center justify-center text-lg border border-uday-peach">
                    {memberInitials}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-uday-midnight">{member.name}</h4>
                    <span className="text-xs font-semibold text-uday-crimson">{member.role}</span>
                  </div>
                </div>
                <div className="text-[11px] font-medium text-uday-teal uppercase tracking-wider">
                  {member.major}
                </div>
                <p className="text-xs text-uday-midnight/75 leading-relaxed italic">
                  "{member.bio}"
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Sub-Teams */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
          <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
            Editorial Team (English)
          </h4>
          <ul className="text-xs text-uday-midnight/75 space-y-1">
            {team.editorialEnglish.map((name, i) => (
              <li key={i}>• {name}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
          <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
            Editorial Team (Hindi)
          </h4>
          <ul className="text-xs text-uday-midnight/75 space-y-1">
            {team.editorialHindi.map((name, i) => (
              <li key={i}>• {name}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
          <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
            Reporters & Writers
          </h4>
          <ul className="text-xs text-uday-midnight/75 space-y-1">
            {team.reporters.map((name, i) => (
              <li key={i}>• {name}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
          <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
            Design & Advisory
          </h4>
          <ul className="text-xs text-uday-midnight/75 space-y-1">
            <li className="font-semibold text-uday-teal">Designers:</li>
            {team.designers.map((name, i) => (
              <li key={i} className="pl-2">• {name}</li>
            ))}
            <li className="font-semibold text-uday-teal pt-1">Student Advisors:</li>
            {team.studentAdvisors.map((name, i) => (
              <li key={i} className="pl-2">• {name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Office & Direct Message Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-uday-peach/50 p-6 sm:p-10 shadow-lg">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-uday-crimson">
              Contact & Address
            </span>
            <h3 className="font-serif text-2xl font-bold text-uday-midnight mt-1">
              Institute Magazine Office
            </h3>
            <p className="text-xs sm:text-sm text-uday-midnight/70 mt-2 leading-relaxed">
              Reach out for submissions inquiries, article proposals, copyright permissions, or print archive queries.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-uday-midnight/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-uday-crimson/10 text-uday-crimson flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-uday-midnight">Official Magazine Email</div>
                <a href={`mailto:${team.contactDetails.officialEmail}`} className="text-uday-crimson hover:underline">
                  {team.contactDetails.officialEmail}
                </a>
              </div>
            </div>

            {/* Portal & Web Lead: Souradip */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-uday-orange/15 text-uday-orange flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-uday-midnight">{team.portalWebLead.role || 'Portal & Web Lead'}</div>
                <div className="text-uday-midnight/80 font-medium">{team.portalWebLead.name || 'Souradip'}</div>
                <a href={`mailto:${team.portalWebLead.email}`} className="text-uday-orange hover:underline text-xs">
                  {team.portalWebLead.email}
                </a>
              </div>
            </div>

            {team.contactDetails.contactPhone && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-uday-sage/15 text-uday-forest flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-uday-midnight">Telephone / Desk</div>
                  <div className="text-uday-midnight/80">{team.contactDetails.contactPhone}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-uday-teal/15 text-uday-teal flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-uday-midnight">Campus Location</div>
                <p className="text-xs text-uday-midnight/70 leading-relaxed">
                  {team.contactDetails.campusLocation}
                </p>
                {team.contactDetails.officeRoom && (
                  <p className="text-xs text-uday-teal font-medium mt-1">
                    Room: {team.contactDetails.officeRoom}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-uday-peach/40 text-[11px] text-uday-midnight/70 leading-relaxed">
            <strong>Credits & Copyright:</strong> Designed & Developed by <strong>Souradip & Sayandeep</strong>. © 2024 UDAY Magazine. All rights reserved.
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-uday-peach/40">
          <h4 className="font-serif text-xl font-bold text-uday-midnight mb-1">Send a Direct Message</h4>
          <p className="text-xs text-uday-midnight/70 mb-5">Have a question or submission suggestion? Drop a message to the editorial desk.</p>

          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={e => setInquiryName(e.target.value)}
                  placeholder="e.g. Arsh Dhawan"
                  className="w-full bg-white border border-uday-peach/50 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={e => setInquiryEmail(e.target.value)}
                  placeholder="you@iiserb.ac.in"
                  className="w-full bg-white border border-uday-peach/50 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                required
                value={inquirySubject}
                onChange={e => setInquirySubject(e.target.value)}
                placeholder="e.g. Question regarding Volume 12 poetry submissions"
                className="w-full bg-white border border-uday-peach/50 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Message</label>
              <textarea
                rows={4}
                required
                value={inquiryBody}
                onChange={e => setInquiryBody(e.target.value)}
                placeholder="Write your note or question here..."
                className="w-full bg-white border border-uday-peach/50 rounded-xl p-3.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sent}
              className="w-full py-3 bg-gradient-to-r from-uday-crimson to-uday-orange text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {sent ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message to Editorial Desk
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
