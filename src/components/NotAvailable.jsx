// src/components/NotAvailable.jsx
export default function NotAvailable({ feature, detail }) {
  return (
    <div className="bg-card ring-1 ring-edge rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">{feature} is not available yet</h2>
      <p className="text-sm text-gray-400">
        The backend does not provide this feature yet (or the server could not be reached),
        so there is nothing to show here. This page will work once the server supports it.
      </p>
      {detail && <p className="text-xs text-gray-600 mt-3">Technical detail: {detail}</p>}
    </div>
  );
}