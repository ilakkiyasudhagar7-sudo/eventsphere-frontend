export const stats = {
  totalEvents: 12,
  totalRegistrations: 486,
  revenue: 245000,
  avgRating: 4.3,
};

export const registrationsByMonth = [
  { month: 'May', registrations: 40 },
  { month: 'Jun', registrations: 65 },
  { month: 'Jul', registrations: 90 },
  { month: 'Aug', registrations: 120 },
  { month: 'Sep', registrations: 95 },
  { month: 'Oct', registrations: 76 },
];

export const ticketsByEvent = [
  { event: 'TechFest', sold: 180 },
  { event: 'DevCon', sold: 120 },
  { event: 'AI Summit', sold: 95 },
  { event: 'Startup Meet', sold: 60 },
  { event: 'Design Day', sold: 31 },
];

export const statusCounts = [
  { name: 'Draft', value: 2 },
  { name: 'Published', value: 4 },
  { name: 'Ongoing', value: 1 },
  { name: 'Completed', value: 4 },
  { name: 'Cancelled', value: 1 },
];

export const events = [
  { EventID: 1, EventTitle: 'TechFest 2026', EventCategory: 'Technology', StartDate: '2026-11-05', EventStatus: 'Published', Capacity: 300 },
  { EventID: 2, EventTitle: 'DevCon', EventCategory: 'Conference', StartDate: '2026-10-22', EventStatus: 'Ongoing', Capacity: 200 },
  { EventID: 3, EventTitle: 'AI Summit', EventCategory: 'Technology', StartDate: '2026-09-10', EventStatus: 'Completed', Capacity: 150 },
  { EventID: 4, EventTitle: 'Startup Meet', EventCategory: 'Networking', StartDate: '2026-12-01', EventStatus: 'Draft', Capacity: 100 },
  { EventID: 5, EventTitle: 'Design Day', EventCategory: 'Workshop', StartDate: '2026-08-14', EventStatus: 'Cancelled', Capacity: 80 },
];

export const tickets = [
  { TicketID: 1, EventID: 1, TicketType: 'General', Price: 500, QuantityAvailable: 120 },
  { TicketID: 2, EventID: 1, TicketType: 'VIP', Price: 1500, QuantityAvailable: 0 },
  { TicketID: 3, EventID: 2, TicketType: 'General', Price: 800, QuantityAvailable: 40 },
  { TicketID: 4, EventID: 2, TicketType: 'Workshop Pass', Price: 1200, QuantityAvailable: 15 },
]