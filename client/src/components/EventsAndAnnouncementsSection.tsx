import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, ChevronRight, Bell, CheckCircle2 } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  venue: string;
  description: string;
  badge?: string;
  cta?: string;
}

interface PastEventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  description: string;
  attendees: string;
}

interface EventsSectionProps {
  events: {
    upcoming: EventItem[];
    past: PastEventItem[];
  };
}

export const EventsAndAnnouncementsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [rsvpState, setRsvpState] = useState<Record<string, boolean>>({});

  const handleRsvp = (id: string) => {
    setRsvpState(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert("RSVP Confirmed! You will receive a calendar invite and reminders for this session.");
    }, 100);
  };

  return (
    <section id="events" className="py-20 bg-white border-t border-uday-peach/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-uday-crimson bg-uday-crimson/10 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" /> Institute Literary Calendar
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-uday-midnight">
              Events & <span className="text-uday-crimson">Announcements</span>
            </h2>
            <p className="text-sm sm:text-base text-uday-midnight/70 leading-relaxed">
              Stay tuned for editorial workshops, open mic sessions, magazine release galas, and past campus milestones.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 bg-uday-cream rounded-2xl border border-uday-peach/50 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-uday-crimson text-white shadow-sm'
                  : 'text-uday-midnight/70 hover:text-uday-crimson'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Upcoming Announcements</span>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'past'
                  ? 'bg-uday-teal text-white shadow-sm'
                  : 'text-uday-midnight/70 hover:text-uday-teal'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Past Events Archive</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Upcoming Announcements */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(events.upcoming || []).map(event => (
                <div
                  key={event.id}
                  className="bg-[#FAF7F2] rounded-3xl border border-uday-peach/60 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
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

                  <div className="pt-6 mt-6 border-t border-uday-peach/40">
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
          </div>
        )}

        {/* Tab 2: Past Events Archive */}
        {activeTab === 'past' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
            {(events.past || []).map(pevent => (
              <div
                key={pevent.id}
                className="bg-[#FAF7F2] rounded-3xl border border-uday-peach/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={pevent.image}
                      alt={pevent.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-uday-peach" />
                      <span>{pevent.attendees}</span>
                    </div>
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

                <div className="p-4 bg-white border-t border-uday-peach/30 text-xs font-semibold text-uday-teal text-center">
                  Archive Recorded in Uday Chronicles
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
