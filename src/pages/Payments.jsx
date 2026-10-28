// src/pages/Payments.jsx
import { useEffect, useState } from "react";
import { getAllPayments } from "../api/registrations";
import NotAvailable from "../components/NotAvailable";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getAllPayments()
      .then((p) => setPayments(Array.isArray(p) ? p : []))
      .catch((err) => setLoadError(err.message || "Request failed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white mb-6">Payments</h1>
        <p className="text-gray-500">Loading payments...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white mb-6">Payments</h1>
        <NotAvailable feature="The payments list" detail={loadError} />
      </div>
    );
  }

  const total = payments.reduce((sum, p) => sum + Number(p.Amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Payments</h1>

      <div className="grid gap-4 sm:grid-cols-2 mb-6 max-w-xl">
        <div className="bg-card ring-1 ring-edge rounded-xl p-4">
          <p className="text-xs text-gray-400">Total collected</p>
          <p className="text-2xl font-semibold text-pink-300">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-card ring-1 ring-edge rounded-xl p-4">
          <p className="text-xs text-gray-400">Payments received</p>
          <p className="text-2xl font-semibold text-white">{payments.length}</p>
        </div>
      </div>

      <div className="bg-card ring-1 ring-edge rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-edge">
            <tr>
              <th className="px-4 py-3 font-medium">Payment ID</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Attendee</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Transaction ref</th>
              <th className="px-4 py-3 font-medium">Registration</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.PaymentID} className="border-b border-edge last:border-0 hover:bg-white/5">
                <td className="px-4 py-3 text-gray-400">{p.PaymentID}</td>
                <td className="px-4 py-3 text-white">{p.EventTitle}</td>
                <td className="px-4 py-3 text-gray-300">{p.TicketType}</td>
                <td className="px-4 py-3 text-gray-300">{p.AttendeeName}</td>
                <td className="px-4 py-3 text-pink-300">₹{Number(p.Amount).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-gray-300">{p.PaymentMethod}</td>
                <td className="px-4 py-3 text-gray-300">{p.TransactionReference}</td>
                <td className="px-4 py-3 text-gray-400">#{p.RegistrationID}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No payments yet. They appear here once an attendee pays for a registration.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}