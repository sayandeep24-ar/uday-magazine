import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight, Bell, CheckCircle2, ExternalLink, Megaphone } from 'lucide-react';

interface EventsPageProps {
  events: {
    upcoming: any[];
    past: any[];
  };
  announcements?: any[];
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, announcements }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [rsvpState, setRsvpState] = useState<Record<string, boolean>>({});

  const handleRsvp = (id: string) => {
    setRsvpState(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert("RSVP Confirmed! You will receive calendar reminders for this session.");
    }, 100);
  };

  const activeAnnouncements = (announcements || []).filter(a => a.active !== false);

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-uday-peach/40 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-crimson bg-uday-crimson/10 px-3 py-1 rounded-full">
            <Calendar className="w-3.5 h-3.5" /> Institute Literary Calendar
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-uday-midnight">
            Events & <span className="text-uday-crimson">Announcements</span>
          </h1>
          <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
            Stay updated with call for entries deadlines, poetry open mics, writing masterclasses, and past magazine release milestones.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 bg-uday-cream rounded-2xl border border-uday-peach/50 shrink-0">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-uday-crimson text-white shadow-sm'
                : 'text-uday-midnight/70 hover:text-uday-crimson'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Upcoming ({events.upcoming?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'past'
                ? 'bg-uday-teal text-white shadow-sm'
                : 'text-uday-midnight/70 hover:text-uday-teal'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Past Archives ({events.past?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Active Announcements Banner with Direct Action Links */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-uday-midnight via-[#1c2937] to-uday-midnight text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-uday-peach/20">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-uday-peach mb-5">
            <Megaphone className="w-4 h-4 text-uday-flame" />
            <span>Official Campus Announcements & Notices</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeAnnouncements.map(ann => (
              <div
                key={ann.id}
                className="bg-white/10 hover:bg-white/15 transition-all rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-uday-crimson text-white">
                    {ann.tag || 'NOTICE'}
                  </span>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                    {ann.text}
                  </p>
                </div>
                {ann.linkUrl && (
                  <div className="pt-2 border-t border-white/10">
                    <a
                      href={ann.linkUrl}
                      target={ann.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-uday-peach hover:text-white transition-colors"
                    >
                      <span>{ann.linkText || 'Details & RSVP'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Upcoming */}
      {activeTab === 'upcoming' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {(events.upcoming || []).map(event => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-uday-peach/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Event Cover Image Banner */}
              {event.image && (
                <div className="h-48 w-full overflow-hidden relative bg-uday-midnight">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {event.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold bg-uday-crimson/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        {event.badge}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-4 flex-1">
                {!event.image && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-uday-orange/15 text-uday-orange px-2.5 py-1 rounded-lg">
                      {event.category}
                    </span>
                    {event.badge && (
                      <span className="text-[10px] font-bold bg-uday-crimson text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {event.badge}
                      </span>
                    )}
                  </div>
                )}
                {event.image && (
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-uday-orange/15 text-uday-orange px-2.5 py-1 rounded-lg inline-block">
                    {event.category}
                  </span>
                )}

                <h3 className="font-serif text-xl font-bold text-uday-midnight leading-snug">
                  {event.title}
                </h3>

                <div className="space-y-2 text-xs text-uday-midnight/75 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-uday-crimson shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-uday-orange shrink-0" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-uday-teal shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-uday-midnight/70 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="p-6 pt-0 sm:p-7 sm:pt-0 space-y-2.5 border-t border-uday-peach/40 mt-auto">
                {/* Event External Link Button */}
                {event.link && (
                  <a
                    href={event.link}
                    target={event.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-uday-teal text-uday-teal hover:bg-uday-teal hover:text-white transition-all shadow-sm"
                  >
                    <span>{event.linkText || 'Open Event Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => handleRsvp(event.id)}
                  disabled={rsvpState[event.id]}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    rsvpState[event.id]
                      ? 'bg-uday-sage text-white'
                      : 'bg-uday-midnight text-white hover:bg-uday-crimson shadow-sm'
                  }`}
                >
                  {rsvpState[event.id] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> RSVP Confirmed
                    </>
                  ) : (
                    <>
                      <span>{event.cta || 'RSVP Now'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Past */}
      {activeTab === 'past' && (
        <div className="space-y-6 animate-fadeIn">
          {(!events.past || events.past.length === 0) ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-uday-peach/40 space-y-3">
              <Calendar className="w-10 h-10 text-uday-teal/50 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-uday-midnight">No Past Events Archived Yet</h4>
              <p className="text-xs text-uday-midnight/60 max-w-md mx-auto">
                Completed events will appear here once marked as past by the editorial board.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.past.map(pevent => (
                <div
                  key={pevent.id}
                  className="bg-white rounded-3xl border border-uday-peach/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-uday-midnight">
                      <img
                        src={pevent.image || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop&q=80'}
                        alt={pevent.title}
                        onError={(e: any) => { e.currentTarget.src = '/uday-logo.jpg'; }}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-uday-peach" />
                        <span>{pevent.attendees || 'Campus Community'}</span>
                      </div>
                      {pevent.category && (
                        <div className="absolute bottom-3 left-3 bg-uday-midnight/80 backdrop-blur-md text-uday-peach text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {pevent.category}
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-uday-teal font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{pevent.date}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{pevent.venue}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-uday-midnight leading-snug">
                        {pevent.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-uday-midnight/70 leading-relaxed">
                        {pevent.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-uday-cream/40 border-t border-uday-peach/30 text-xs font-semibold text-uday-teal text-center">
                    Preserved in UDAY Institute Archives
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
