// src/pages/Register.jsx
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const empty = {
  FullName: "",
  Email: "",
  PhoneNumber: "",
  Password: "",
  DateOfBirth: "",
  Gender: "Male",
  role: "Attendee",
  Profession: "",
  Organisation: "",
  City: "",
};

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === "Organizer" ? "/" : "/events"} replace />;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.Password.length < 6) return setError("Password must be at least 6 characters");
    if (!/^\d{10}$/.test(form.PhoneNumber)) return setError("Phone number must be 10 digits");

    setLoading(true);
    try {
      const u = await register(form);
      navigate(u.role === "Organizer" ? "/" : "/events", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg ring-1 ring-edge";
  const labelCls = "block text-sm text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-1">
          Event<span className="text-pink-400">Sphere</span>
        </h1>
        <p className="text-center text-gray-400 mb-6">Create your account</p>

        <form onSubmit={handleSubmit} className="bg-card ring-1 ring-edge rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Role toggle */}
          <div>
            <label className={labelCls}>I am an</label>
            <div className="grid grid-cols-2 gap-2">
              {["Attendee", "Organizer"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 rounded-lg ring-1 text-sm font-medium transition ${
                    form.role === r
                      ? "bg-pink-600 ring-pink-500 text-white"
                      : "ring-edge text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Full name</label>
            <input required value={form.FullName} onChange={set("FullName")} className={inputCls} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" required value={form.Email} onChange={set("Email")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone number</label>
              <input required value={form.PhoneNumber} onChange={set("PhoneNumber")} className={inputCls} placeholder="10 digits" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date of birth</label>
              <input type="date" required value={form.DateOfBirth} onChange={set("DateOfBirth")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Gender</label>
              <select value={form.Gender} onChange={set("Gender")} className={inputCls}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <input type="password" required value={form.Password} onChange={set("Password")} className={inputCls} placeholder="At least 6 characters" />
          </div>

          {form.role === "Attendee" && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Profession</label>
                <input required value={form.Profession} onChange={set("Profession")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Organisation</label>
                <input required value={form.Organisation} onChange={set("Organisation")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input required value={form.City} onChange={set("City")} className={inputCls} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-60 text-white font-medium transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-400 hover:text-pink-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}