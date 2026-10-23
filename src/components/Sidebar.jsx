// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  ClipboardList,
  CreditCard,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["Organizer"] },
  { to: "/events", label: "Events", icon: CalendarDays, roles: ["Organizer", "Attendee"] },
  { to: "/venues", label: "Venues", icon: MapPin, roles: ["Organizer"] },
  { to: "/registrations", label: "Registrations", icon: ClipboardList, roles: ["Organizer", "Attendee"] },
  { to: "/payments", label: "Payments", icon: CreditCard, roles: ["Organizer"] },
  { to: "/connections", label: "Connections", icon: Users, roles: ["Attendee"] },
  { to: "/feedback", label: "Feedback", icon: MessageSquare, roles: ["Organizer", "Attendee"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visible = links.filter((l) => l.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-60 shrink-0 min-h-screen bg-[#09050d] border-r border-edge flex flex-col">
      <div className="px-5 py-5 text-xl font-bold text-white">
        Event<span className="text-pink-400">Sphere</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {visible.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-pink-500/15 text-pink-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-edge">
        <p className="text-sm text-white truncate">{user.FullName}</p>
        <p className="text-xs text-pink-300 mb-3">{user.role}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-300 transition"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}