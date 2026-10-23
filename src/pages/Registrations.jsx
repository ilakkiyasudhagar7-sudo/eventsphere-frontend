import { useEffect, useState } from 'react'
import { getTickets } from '../api/tickets'
import { registerForTicket, processPayment, getMyRegistrations } from '../api/registrations'
import { getEvents } from '../api/events'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'

export default function Registrations() {
  const { user } = useAuth()
  const isAttendee = user?.role === 'Attendee'

  const [openEvents, setOpenEvents] = useState([])
  const [eventId, setEventId] = useState(null)
  const [tickets, setTickets] = useState([])
  const [myRegs, setMyRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [paying, setPaying] = useState(null)
  const [method, setMethod] = useState('UPI')
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getEvents()
      .then((list) => {
        const open = list.filter((e) =>
          ['Published', 'Ongoing'].includes(e.EventStatus)
        )
        setOpenEvents(open)
        if (open.length > 0) setEventId(open[0].EventID)
      })
      .catch((err) => setMessage({ type: 'error', text: err.message }))
      .finally(() => setLoading(false))
  }, [])

  async function refresh() {
    try {
      if (eventId !== null) {
        setTickets(await getTickets(eventId))
      }
      setMyRegs(await getMyRegistrations())
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  useEffect(() => {
    refresh()
  }, [eventId])

  async function handleRegister(ticket) {
    setBusy(true)
    setMessage(null)
    try {
      const reg = await registerForTicket(ticket.TicketID)
      setMessage({
        type: 'success',
        text: 'Successfully registered. Complete the payment to confirm.',
      })
      setPaying(reg)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
      refresh()
    }
  }

  async function handlePay(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await processPayment(paying.RegistrationID, {
        PaymentMethod: method,
        TransactionReference: reference,
      })
      setMessage({
        type: 'success',
        text: 'Successfully paid. Registration confirmed.',
      })
      setPaying(null)
      setReference('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
      refresh()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Registrations</h2>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'error'
              ? 'bg-red-500/10 text-red-300'
              : 'bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {isAttendee && (
        <div className="bg-card ring-1 ring-edge rounded-xl p-5 mb-6">
          {loading && <p className="text-gray-500">Loading events...</p>}

          {!loading && openEvents.length === 0 && (
            <p className="text-gray-400">
              No events are open for registration right now.
            </p>
          )}

          {!loading && openEvents.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Event
                </label>
                <select
                  value={eventId ?? ''}
                  onChange={(e) => setEventId(Number(e.target.value))}
                  className="px-3 py-2 border border-edge rounded-lg text-sm"
                >
                  {openEvents.map((ev) => (
                    <option key={ev.EventID} value={ev.EventID}>
                      {ev.EventTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tickets.map((t) => (
                  <div
                    key={t.TicketID}
                    className="border border-edge rounded-xl p-4"
                  >
                    <p className="font-semibold text-gray-100">
                      {t.TicketType}
                    </p>
                    <p className="text-2xl font-bold text-pink-400 my-1">
                      ₹{t.Price}
                    </p>
                    <p
                      className={`text-sm mb-3 ${
                        t.QuantityAvailable === 0
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {t.QuantityAvailable === 0
                        ? 'Sold out'
                        : `${t.QuantityAvailable} left`}
                    </p>
                    <button
                      disabled={busy || t.QuantityAvailable === 0}
                      onClick={() => handleRegister(t)}
                      className="w-full py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
                    >
                      Register
                    </button>
                  </div>
                ))}

                {tickets.length === 0 && (
                  <p className="text-gray-400">No tickets for this event.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {isAttendee && paying && (
        <form
          onSubmit={handlePay}
          className="bg-card ring-1 ring-edge rounded-xl p-5 mb-6 border-2 border-pink-500/40"
        >
          <h3 className="font-semibold text-gray-200 mb-1">
            Pay for {paying.EventTitle} – {paying.TicketType}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Amount: ₹{paying.Price}
          </p>

          <div className="flex flex-wrap gap-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 border border-edge rounded-lg text-sm"
            >
              {['UPI', 'Card', 'Net Banking', 'Cash'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Transaction reference"
              className="px-3 py-2 border border-edge rounded-lg text-sm"
            />

            <button
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
            >
              Pay now
            </button>

            <button
              type="button"
              onClick={() => setPaying(null)}
              className="px-4 py-2 rounded-lg border border-edge text-sm"
            >
              Later
            </button>
          </div>
        </form>
      )}

      <div className="bg-card ring-1 ring-edge rounded-xl overflow-x-auto">
        <h3 className="font-semibold text-gray-200 p-5 pb-3">
          {isAttendee ? 'My registrations' : 'All registrations'}
        </h3>

        <table className="w-full text-sm text-left">
          <thead className="bg-edge/40 text-gray-300">
            <tr>
              <th className="px-4 py-3">ID</th>
              {!isAttendee && <th className="px-4 py-3">Attendee ID</th>}
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {myRegs.map((r) => (
              <tr key={r.RegistrationID} className="border-t border-edge">
                <td className="px-4 py-3">{r.RegistrationID}</td>
                {!isAttendee && (
                  <td className="px-4 py-3">{r.AttendeeID}</td>
                )}
                <td className="px-4 py-3 font-medium">{r.EventTitle}</td>
                <td className="px-4 py-3">{r.TicketType}</td>
                <td className="px-4 py-3">{r.RegistrationDate}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.RegistrationStatus} />
                </td>
                <td className="px-4 py-3">
                  {isAttendee && r.RegistrationStatus === 'Pending' && (
                    <button
                      onClick={() => setPaying(r)}
                      className="text-pink-400 hover:underline"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {myRegs.length === 0 && (
              <tr>
                <td
                  colSpan={isAttendee ? 6 : 7}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No registrations yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}