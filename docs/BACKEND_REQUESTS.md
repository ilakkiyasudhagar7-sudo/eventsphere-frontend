# Backend requests from the frontend (Member 1)

Frontend status: browse events, event detail, ticket selection, registration and
simulated payment work. Tested so far against a development stand-in server that
copies ApiServer.java, not against the real Java/Oracle backend.

## Needed to test against the real backend
1. Setup steps, schema script, and one attendee and one organizer login.
2. CORS: currently only http://localhost:5174 is allowed.

## Bugs / fixes
3. Number parsing: Gson returns numbers as doubles, so "3" fails with "3.0".
   Use `(int) Double.parseDouble(...)` for `ticketId` and `RegistrationID`.
   (Frontend sends IDs as strings as a workaround.)
4. Ticket stock: ApiServer.java (registration handler, ~lines 285-345) checks
   `quantity_available > 0` but never updates `quantity_available` or
   `quantity_sold` anywhere in the Java code (grep for "UPDATE tickets" and
   "quantity_sold" returns nothing). Is there an Oracle trigger that updates
   them? If not, please update them in the booking or payment transaction.
   Until then the frontend displays remaining = QuantityAvailable - QuantitySold.
   4b. Payment handler (~lines 365-430) inserts only registration_id, amount and
    payment_status, and does not update ticket counts. Method and transaction
    reference are not stored, so the Payments page columns for them will be empty.
    Please say if you plan to store them.

## Missing in the API (frontend shows "not available yet")
5. EventCategory and Capacity in the events response.
6. Connections and attendee directory.
7. Feedback (submit, list, my sessions).
8. Stats / dashboard overview.
9. All-payments list and all-registrations list (organizer).
10. Create event, create venue, create ticket.

Please reply with which of items 6-10 you will build.