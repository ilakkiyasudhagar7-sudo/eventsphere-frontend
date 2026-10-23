// src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import AddEvent from "./pages/AddEvent";
import Registrations from "./pages/Registrations";
import Venues from "./pages/Venues";
import Payments from "./pages/Payments";
import Connections from "./pages/Connections";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Layout() {
  return (
    <div className="flex min-h-screen bg-page text-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

const ORG = ["Organizer"];
const ATT = ["Attendee"];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<ProtectedRoute roles={ORG}><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<ProtectedRoute roles={ORG}><AddEvent /></ProtectedRoute>} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/venues" element={<ProtectedRoute roles={ORG}><Venues /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute roles={ORG}><Payments /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute roles={ATT}><Connections /></ProtectedRoute>} />
        <Route path="/feedback" element={<Feedback />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}