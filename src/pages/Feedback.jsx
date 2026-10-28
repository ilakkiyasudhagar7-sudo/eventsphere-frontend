// src/pages/Feedback.jsx
import { useState } from "react";
import { Star } from "lucide-react";

const mockSessions = [
  {
    SessionID: "s1",
    SessionTitle: "Keynote: Graph DBs vs Relational SQL",
    EventTitle: "EventSphere Launch Summit",
    SessionType: "Keynote",
    MyFeedback: { Rating: 5, Comments: "Awesome session on Neo4j relationships!" }
  },
  {
    SessionID: "s2",
    SessionTitle: "Hands-on Cypher Query Workshop",
    EventTitle: "EventSphere Launch Summit",
    SessionType: "Workshop",
    MyFeedback: null
  }
];

function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} className={n <= value ? "text-pink-400 fill-pink-400" : "text-gray-600"} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
          <Star
            size={20}
            className={n <= value ? "text-pink-400 fill-pink-400" : "text-gray-600 hover:text-pink-300"}
          />
        </button>
      ))}
    </span>
  );
}

function SessionCard({ s }) {
  const [rating, setRating] = useState(s.MyFeedback ? s.MyFeedback.Rating : 0);
  const [comments, setComments] = useState(s.MyFeedback ? s.MyFeedback.Comments : "");
  const [submitted, setSubmitted] = useState(!!s.MyFeedback);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-card ring-1 ring-edge rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-white font-medium text-sm">{s.SessionTitle}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{s.EventTitle}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300">{s.SessionType}</span>
      </div>

      {submitted ? (
        <div className="mt-3 border-t border-edge pt-3 text-sm">
          <div className="flex items-center justify-between">
            <Stars value={rating} />
            <span className="text-xs text-emerald-300">Submitted</span>
          </div>
          {comments && <p className="text-gray-300 text-xs mt-1">{comments}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 border-t border-edge pt-3 space-y-3">
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            placeholder="Add comments..."
            className="w-full px-3 py-2 rounded-lg ring-1 ring-edge text-xs bg-card text-gray-100 focus:outline-none"
          />
          <button
            type="submit"
            disabled={rating === 0}
            className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-xs transition"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
}

export default function Feedback() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Feedback</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {mockSessions.map((s) => (
          <SessionCard key={s.SessionID} s={s} />
        ))}
      </div>
    </div>
  );
}