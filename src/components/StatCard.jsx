export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-card border border-edge rounded-xl p-5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-pink-500/15 text-pink-400">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
      </div>
    </div>
  )
}