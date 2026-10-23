// src/data/mockUsers.js
export const users = [
  { UserID: 1, FullName: "Aarav Mehta", Email: "organizer@eventsphere.com", PhoneNumber: "9876500001", PasswordHash: "organizer123", DateOfBirth: "1990-05-12", Gender: "Male", CreatedAt: "2026-01-10" },
  { UserID: 2, FullName: "Priya Nair", Email: "attendee@eventsphere.com", PhoneNumber: "9876500002", PasswordHash: "attendee123", DateOfBirth: "2002-08-21", Gender: "Female", CreatedAt: "2026-02-03" },
  { UserID: 3, FullName: "Rohan Iyer", Email: "rohan@eventsphere.com", PhoneNumber: "9876500003", PasswordHash: "attendee123", DateOfBirth: "2001-03-14", Gender: "Male", CreatedAt: "2026-02-10" },
  { UserID: 4, FullName: "Sneha Kapoor", Email: "sneha@eventsphere.com", PhoneNumber: "9876500004", PasswordHash: "attendee123", DateOfBirth: "1999-11-02", Gender: "Female", CreatedAt: "2026-03-01" },
  { UserID: 5, FullName: "Karthik Rao", Email: "karthik@eventsphere.com", PhoneNumber: "9876500005", PasswordHash: "attendee123", DateOfBirth: "1997-07-25", Gender: "Male", CreatedAt: "2026-03-15" },
  { UserID: 6, FullName: "Ananya Das", Email: "ananya@eventsphere.com", PhoneNumber: "9876500006", PasswordHash: "attendee123", DateOfBirth: "2000-01-30", Gender: "Female", CreatedAt: "2026-04-02" },
];

// subclass of USER
export const organizers = [{ UserID: 1 }];

// subclass of USER (AttendeeID 1 = Priya, the demo attendee)
export const attendees = [
  { AttendeeID: 1, UserID: 2, Profession: "Student", Organisation: "ABC College", City: "Bengaluru" },
  { AttendeeID: 2, UserID: 3, Profession: "Software Engineer", Organisation: "TechNova", City: "Hyderabad" },
  { AttendeeID: 3, UserID: 4, Profession: "Designer", Organisation: "PixelWorks", City: "Mumbai" },
  { AttendeeID: 4, UserID: 5, Profession: "Data Analyst", Organisation: "InsightLabs", City: "Chennai" },
  { AttendeeID: 5, UserID: 6, Profession: "Student", Organisation: "XYZ University", City: "Pune" },
];