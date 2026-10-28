const colors = {
  Draft: 'bg-gray-500/20 text-gray-300',
  Published: 'bg-sky-500/20 text-sky-300',
  Ongoing: 'bg-emerald-500/20 text-emerald-300',
  Completed: 'bg-fuchsia-500/20 text-fuchsia-300',
  Cancelled: 'bg-red-500/20 text-red-300',
  Pending: 'bg-amber-500/20 text-amber-300',
  Confirmed: 'bg-emerald-500/20 text-emerald-300',
  Failed: 'bg-red-500/20 text-red-300',
}

// Backend sends PENDING / CONFIRMED in capitals; show them as "Pending" / "Confirmed"
function normalize(status) {
  const s = String(status ?? '').toLowerCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function StatusBadge({ status }) {
  const label = normalize(status)
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[label] || 'bg-gray-500/20 text-gray-300'}`}>
      {label}
    </span>
  )
}