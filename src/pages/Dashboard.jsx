import { useEffect, useState } from 'react'
import { CalendarDays, Ticket, IndianRupee, Star } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import StatCard from '../components/StatCard'
import NotAvailable from '../components/NotAvailable'
import { getOverview } from '../api/stats'

const PIE_COLORS = ['#6b7280', '#f472b6', '#34d399', '#c026d3', '#f87171']

const tooltipProps = {
  cursor: { fill: 'rgba(236,72,153,0.1)' },
  contentStyle: { background: '#170f1f', border: '1px solid #2c2038', borderRadius: 8 },
  labelStyle: { color: '#f3f4f6' },
  itemStyle: { color: '#f9a8d4' },
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch((err) => setError(err.message || 'Request failed'))
  }, [])

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Dashboard</h2>
        <NotAvailable feature="Dashboard statistics" detail={error} />
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Dashboard</h2>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  const { stats, registrationsByMonth, ticketsByEvent, statusCounts } = data

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Events" value={stats.totalEvents} icon={CalendarDays} />
        <StatCard label="Registrations" value={stats.totalRegistrations} icon={Ticket} />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={IndianRupee} />
        <StatCard label="Avg Rating" value={stats.avgRating} icon={Star} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card ring-1 ring-edge rounded-xl p-5">
          <h3 className="font-semibold text-gray-200 mb-4">Registrations over time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={registrationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2038" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip {...tooltipProps} />
              <Line type="monotone" dataKey="registrations" stroke="#ec4899" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card ring-1 ring-edge rounded-xl p-5">
          <h3 className="font-semibold text-gray-200 mb-4">Tickets sold per event</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ticketsByEvent}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2038" />
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="sold" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card ring-1 ring-edge rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-200 mb-4">Events by status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" outerRadius={100} label>
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}