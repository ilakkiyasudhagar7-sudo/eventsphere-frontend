// src/data/mockDetail.js
export const sessions = [
  { SessionID: 1, SessionTitle: "Opening Keynote", SessionDescription: "Kick-off talk on the future of the industry.", StartTime: "2026-11-10T09:00", EndTime: "2026-11-10T10:00", SessionType: "Keynote", EventID: 1 },
  { SessionID: 2, SessionTitle: "Hands-on Workshop", SessionDescription: "Build a small project live with the speakers.", StartTime: "2026-11-10T11:00", EndTime: "2026-11-10T13:00", SessionType: "Workshop", EventID: 1 },
  { SessionID: 3, SessionTitle: "Panel Discussion", SessionDescription: "Industry leaders answer audience questions.", StartTime: "2026-11-10T14:00", EndTime: "2026-11-10T15:00", SessionType: "Panel", EventID: 1 },
  { SessionID: 4, SessionTitle: "Intro Session", SessionDescription: "Welcome and agenda walkthrough.", StartTime: "2026-12-01T10:00", EndTime: "2026-12-01T11:00", SessionType: "Talk", EventID: 2 },
  { SessionID: 5, SessionTitle: "Networking Hour", SessionDescription: "Meet other attendees.", StartTime: "2026-12-01T11:30", EndTime: "2026-12-01T12:30", SessionType: "Networking", EventID: 2 },
  { SessionID: 6, SessionTitle: "Closing Talk", SessionDescription: "Wrap-up and next steps.", StartTime: "2026-12-15T16:00", EndTime: "2026-12-15T17:00", SessionType: "Talk", EventID: 3 },
];

// Original total quantity per TicketID (QuantityAvailable = remaining)
export const ticketTotals = { 1: 100, 2: 100, 3: 50, 4: 20 };

export const feedback = [
  { FeedbackID: 1, Rating: 5, Comments: "Inspiring keynote!", FeedbackDate: "2026-11-10", AttendeeID: 1, SessionID: 1 },
  { FeedbackID: 2, Rating: 4, Comments: "Good, but a bit long.", FeedbackDate: "2026-11-10", AttendeeID: 2, SessionID: 1 },
  { FeedbackID: 3, Rating: 5, Comments: "Loved the hands-on part.", FeedbackDate: "2026-11-10", AttendeeID: 3, SessionID: 2 },
  { FeedbackID: 4, Rating: 3, Comments: "Needed more time for Q&A.", FeedbackDate: "2026-12-01", AttendeeID: 1, SessionID: 4 },
];