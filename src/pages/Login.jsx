// src/pages/Login.jsx
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === "Organizer" ? "/" : "/events"} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(email, password);
      navigate(u.role === "Organizer" ? "/" : "/events", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (em, pw) => {
    setEmail(em);
    setPassword(pw);
    setError("");
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-1">
          Event<span className="text-pink-400">Sphere</span>
        </h1>
        <p className="text-center text-gray-400 mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="bg-card ring-1 ring-edge rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg ring-1 ring-edge"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg ring-1 ring-edge"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-60 text-white font-medium transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-sm text-gray-400 text-center">
            New here?{" "}
            <Link to="/register" className="text-pink-400 hover:text-pink-300">
              Create an account
            </Link>
          </p>
        </form>

        <div className="mt-4 bg-card ring-1 ring-edge rounded-xl p-4 text-sm">
          <p className="text-gray-400 mb-2">Demo accounts (click to fill):</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo("organizer@eventsphere.com", "organizer123")}
              className="px-3 py-1 rounded-lg ring-1 ring-edge text-pink-300 hover:bg-white/5"
            >
              Organizer
            </button>
            <button
              type="button"
              onClick={() => fillDemo("attendee@eventsphere.com", "attendee123")}
              className="px-3 py-1 rounded-lg ring-1 ring-edge text-pink-300 hover:bg-white/5"
            >
              Attendee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}