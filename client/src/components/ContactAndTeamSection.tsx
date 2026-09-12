import React, { useState } from 'react';
import { Mail, MapPin, User, Send, CheckCircle2, Shield, Heart, ExternalLink } from 'lucide-react';
import { EDITORIAL_BOARD } from '../data/publicationData';

export const ContactAndTeamSection: React.FC = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryBody, setInquiryBody] = useState('');
  const [sent, setSent] = useState(false);

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
      alert("Inquiry dispatched to udaymagz@iiserb.ac.in and sayandeep.biswas04@gmail.com. We'll be in touch soon!");
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 bg-[#FAF7F2] border-t border-uday-peach/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-teal bg-uday-teal/10 px-3 py-1 rounded-full">
            <Mail className="w-3.5 h-3.5" /> Editorial Board & Inquiries
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-uday-midnight">
            Meet the Team & <span className="text-uday-teal">Get in Touch</span>
          </h2>
          <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
            The creative and administrative individuals behind Uday. Connect with our editors, faculty mentors, or portal coordinators.
          </p>
        </div>

        {/* Faculty Advisor Highlight */}
        <div className="bg-white rounded-3xl border border-uday-peach/50 p-6 sm:p-8 shadow-sm mb-14 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-uday-crimson to-uday-orange text-white flex items-center justify-center font-serif text-3xl font-black shrink-0 shadow-warm">
            RT
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-uday-crimson bg-uday-crimson/10 px-2.5 py-0.5 rounded">
              Faculty Advisor
            </span>
            <h3 className="font-serif text-2xl font-bold text-uday-midnight">
              {EDITORIAL_BOARD.facultyAdvisor.name}
            </h3>
            <p className="text-xs sm:text-sm text-uday-midnight/70">
              {EDITORIAL_BOARD.facultyAdvisor.department}
            </p>
          </div>
          <div className="text-xs font-semibold text-uday-teal bg-uday-teal/10 px-4 py-2 rounded-xl">
            {EDITORIAL_BOARD.facultyAdvisor.email}
          </div>
        </div>

        {/* Lead Student Editorial Board */}
        <div className="mb-16">
          <div className="text-center md:text-left mb-8">
            <h3 className="font-serif text-2xl font-bold text-uday-midnight">Editorial Board (Volume 11)</h3>
            <p className="text-xs sm:text-sm text-uday-midnight/70">Chief editors and heads of section from the published edition.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDITORIAL_BOARD.leadTeam.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-uday-peach/40 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-uday-cream text-uday-crimson font-serif font-black flex items-center justify-center text-lg border border-uday-peach">
                    {member.name.split(' ').map(n => n[0]).join('')}
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
            ))}
          </div>
        </div>

        {/* Editorial Sub-Teams & Contributors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
            <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
              Editorial Team (English)
            </h4>
            <ul className="text-xs text-uday-midnight/75 space-y-1">
              {EDITORIAL_BOARD.editorialEnglish.map((name, i) => (
                <li key={i}>• {name}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
            <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
              Editorial Team (Hindi)
            </h4>
            <ul className="text-xs text-uday-midnight/75 space-y-1">
              {EDITORIAL_BOARD.editorialHindi.map((name, i) => (
                <li key={i}>• {name}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
            <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
              Reporters & Writers
            </h4>
            <ul className="text-xs text-uday-midnight/75 space-y-1">
              {EDITORIAL_BOARD.reporters.map((name, i) => (
                <li key={i}>• {name}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-uday-peach/40 space-y-2">
            <h4 className="font-serif font-bold text-sm text-uday-midnight border-b border-uday-peach/30 pb-2">
              Design & Advisors
            </h4>
            <ul className="text-xs text-uday-midnight/75 space-y-1">
              <li className="font-semibold text-uday-teal">Designers:</li>
              {EDITORIAL_BOARD.designers.map((name, i) => (
                <li key={i} className="pl-2">• {name}</li>
              ))}
              <li className="font-semibold text-uday-teal pt-1">Student Advisors:</li>
              {EDITORIAL_BOARD.studentAdvisors.map((name, i) => (
                <li key={i} className="pl-2">• {name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-uday-peach/50 p-6 sm:p-10 shadow-lg">
          
          {/* Left Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-uday-crimson">
                Contact & Address
              </span>
              <h3 className="font-serif text-2xl font-bold text-uday-midnight mt-1">
                Institute Magazine Office
              </h3>
              <p className="text-xs sm:text-sm text-uday-midnight/70 mt-2 leading-relaxed">
                Reach out for article pitches, archive copies, copyright inquiries, or editorial collaborations.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-uday-midnight/80">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-uday-crimson/10 text-uday-crimson flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-uday-midnight">Official Magazine Email</div>
                  <a href="mailto:udaymagz@iiserb.ac.in" className="text-uday-crimson hover:underline">
                    udaymagz@iiserb.ac.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-uday-orange/15 text-uday-orange flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-uday-midnight">Portal & Technical Lead</div>
                  <div className="text-uday-midnight/80">Sayandeep Biswas</div>
                  <a href="mailto:sayandeep.biswas04@gmail.com" className="text-uday-orange hover:underline text-xs">
                    sayandeep.biswas04@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-uday-teal/15 text-uday-teal flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-uday-midnight">Campus Location</div>
                  <p className="text-xs text-uday-midnight/70 leading-relaxed">
                    Indian Institute of Science Education and Research (IISER) Bhopal<br />
                    Bhopal Bypass Road, Bhauri, Bhopal - 462066<br />
                    Madhya Pradesh, India
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-uday-peach/40 text-[11px] text-uday-midnight/70 leading-relaxed">
              <strong>Copyright Notice:</strong> © 2024 UDAY. All rights reserved. No part of the publication may be reproduced without prior permission from udaymagz@iiserb.ac.in.
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-uday-peach/40">
            <h4 className="font-serif text-xl font-bold text-uday-midnight mb-1">Send a Direct Inquiry</h4>
            <p className="text-xs text-uday-midnight/70 mb-5">Have a question or submission suggestion? Drop a message directly to the editorial team.</p>

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
                  placeholder="e.g. Submitting artwork for Volume 12"
                  className="w-full bg-white border border-uday-peach/50 rounded-xl px-3.5 py-2.5 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-uday-midnight mb-1 uppercase tracking-wider">Message</label>
                <textarea
                  required
                  rows={4}
                  value={inquiryBody}
                  onChange={e => setInquiryBody(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-white border border-uday-peach/50 rounded-xl p-3 text-xs text-uday-midnight focus:outline-none focus:border-uday-crimson leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sent}
                className="w-full py-3 bg-uday-midnight hover:bg-uday-crimson text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{sent ? 'Sending...' : 'Dispatch Message'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
