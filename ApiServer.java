
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.google.gson.Gson;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.sql.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class ApiServer {
    static final Gson gson = new Gson();
    static final Map<String, Map<String, Object>> tokens =
        new ConcurrentHashMap<>();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(
            new InetSocketAddress(5000), 0);
        server.createContext("/api", ApiServer::handleRequest);
        server.start();
        System.out.println(
            "EventSphere API running at http://localhost:5000/api");
    }

    static void handleRequest(HttpExchange ex) throws IOException {
        ex.getResponseHeaders().set(
            "Access-Control-Allow-Origin", "http://localhost:5174");
        ex.getResponseHeaders().set(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().set(
            "Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (ex.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            ex.sendResponseHeaders(204, -1);
            ex.close();
            return;
        }

        String path = ex.getRequestURI().getPath();
        String method = ex.getRequestMethod();

        try {
            if (method.equals("POST") && path.equals("/api/auth/register")) {
                register(ex);
            } else if (method.equals("POST") && path.equals("/api/auth/login")) {
                login(ex);
            } else if (method.equals("GET") && path.equals("/api/health")) {
                send(ex, 200, Map.of("message", "EventSphere API is running"));
            } else if (method.equals("GET") && path.equals("/api/events")) {
                send(ex, 200, getEvents());
            } else if (method.equals("GET") && path.equals("/api/venues")) {
                send(ex, 200, getVenues());
            } else if (method.equals("GET") && path.matches("/api/events/\\d+")) {
                int id = Integer.parseInt(path.substring("/api/events/".length()));
                Map<String, Object> event = getEventById(id);
                if (event == null) {
                    send(ex, 404, Map.of("message", "Event does not exist"));
                } else {
                    send(ex, 200, event);
                }
            } else if (method.equals("GET") &&
                       path.matches("/api/events/\\d+/sessions")) {
                send(ex, 200, getSessions(
                    Integer.parseInt(path.split("/")[3])));
            } else if (method.equals("GET") &&
                       path.matches("/api/events/\\d+/tickets")) {
                send(ex, 200, getTickets(
                    Integer.parseInt(path.split("/")[3])));
            } else if (method.equals("POST") &&
                       path.equals("/api/registrations")) {
                createRegistration(ex);
            } else if (method.equals("GET") &&
                       path.equals("/api/registrations/me")) {
                getMyRegistrations(ex);
            } else if (method.equals("POST") &&
                       path.equals("/api/payments")) {
                processPayment(ex);
            } else {
                send(ex, 404, Map.of("message", "Endpoint does not exist"));
            }
        } catch ( IllegalArgumentException e) {
            send(ex, 400, Map.of("message", "Invalid request"));
        } catch (SQLException e) {
            e.printStackTrace();
            send(ex, 500, Map.of("message", "Database error"));
        } catch (Exception e) {
            e.printStackTrace();
            send(ex, 500, Map.of("message", "Server error"));
        }
    }

    static Map<String, Object> readBody(HttpExchange ex) throws IOException {
        String body = new String(
            ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Map<String, Object> data = gson.fromJson(body, Map.class);
        return data == null ? new HashMap<>() : data;
    }

    static String str(Map<String, Object> b, String key) {
        Object v = b.get(key);
        return v == null ? "" : String.valueOf(v).trim();
    }

    static void register(HttpExchange ex) throws Exception {
        Map<String, Object> b = readBody(ex);
        String name = str(b, "FullName");
        String email = str(b, "Email").toLowerCase(Locale.ROOT);
        String password = str(b, "Password");
        String phone = str(b, "PhoneNumber");
        String role = str(b, "role").toUpperCase(Locale.ROOT);

        if (name.isBlank() || email.isBlank() || password.length() < 8 ||
            !(role.equals("ATTENDEE") || role.equals("ORGANIZER"))) {
            send(ex, 400, Map.of("message",
                "FullName, Email, Password (8+ characters), and valid role are required"));
            return;
        }

        try (Connection c = DBConnect.getConnection()) {
            c.setAutoCommit(false);
            try {
                try (PreparedStatement p = c.prepareStatement(
                    "SELECT user_id FROM users WHERE LOWER(email)=?")) {
                    p.setString(1, email);
                    try (ResultSet r = p.executeQuery()) {
                        if (r.next()) {
                            c.rollback();
                            send(ex, 409, Map.of("message", "Email already registered"));
                            return;
                        }
                    }
                }

                int userId;
                try (PreparedStatement p = c.prepareStatement(
                    "INSERT INTO users (email,password_hash,user_role) VALUES (?,?,?)",
                    new String[]{"USER_ID"})) {
                    p.setString(1, email);
                    p.setString(2, hashPassword(password));
                    p.setString(3, role);
                    p.executeUpdate();
                    try (ResultSet keys = p.getGeneratedKeys()) {
                        if (!keys.next()) throw new SQLException("Could not retrieve USER_ID");
                        userId = keys.getInt(1);
                    }
                }

                Integer attendeeId = null;
                if (role.equals("ATTENDEE")) {
                    try (PreparedStatement p = c.prepareStatement(
                        "INSERT INTO attendees (user_id,full_name,phone_number) VALUES (?,?,?)",
                        new String[]{"ATTENDEE_ID"})) {
                        p.setInt(1, userId);
                        p.setString(2, name);
                        if (phone.isBlank()) p.setNull(3, Types.VARCHAR);
                        else p.setString(3, phone);
                        p.executeUpdate();
                        try (ResultSet keys = p.getGeneratedKeys()) {
                            if (!keys.next()) throw new SQLException("Could not retrieve ATTENDEE_ID");
                            attendeeId = keys.getInt(1);
                        }
                    }
                } else {
                    String orgName = str(b, "Organisation");
                    if (orgName.isBlank()) orgName = name;
                    try (PreparedStatement p = c.prepareStatement(
                        "INSERT INTO organizers (user_id,organization_name,contact_email) VALUES (?,?,?)")) {
                        p.setInt(1, userId);
                        p.setString(2, orgName);
                        p.setString(3, email);
                        p.executeUpdate();
                    }
                }

                c.commit();
                Map<String, Object> response = new LinkedHashMap<>();
                response.put("UserID", userId);
                response.put("FullName", name);
                response.put("Email", email);
                response.put("role", role);
                response.put("AttendeeID", attendeeId);
                response.put("token", newToken(userId, role, attendeeId));
                send(ex, 201, response);
            } catch (Exception e) {
                c.rollback();
                throw e;
            } finally {
                c.setAutoCommit(true);
            }
        }
    }

    static void login(HttpExchange ex) throws Exception {
        Map<String, Object> b = readBody(ex);
        String email = str(b, "Email").toLowerCase(Locale.ROOT);
        String password = str(b, "Password");

        try (Connection c = DBConnect.getConnection();
             PreparedStatement p = c.prepareStatement(
                 "SELECT user_id,email,password_hash,user_role FROM users WHERE LOWER(email)=?")) {
            p.setString(1, email);
            try (ResultSet r = p.executeQuery()) {
                if (!r.next() || !verifyPassword(password, r.getString("password_hash"))) {
                    send(ex, 401, Map.of("message", "Invalid email or password"));
                    return;
                }

                int userId = r.getInt("user_id");
                String role = r.getString("user_role").toUpperCase(Locale.ROOT);
                String name = "";
                Integer attendeeId = null;

                if (role.equals("ATTENDEE")) {
                    try (PreparedStatement q = c.prepareStatement(
                        "SELECT attendee_id,full_name FROM attendees WHERE user_id=?")) {
                        q.setInt(1, userId);
                        try (ResultSet a = q.executeQuery()) {
                            if (a.next()) {
                                attendeeId = a.getInt("attendee_id");
                                name = a.getString("full_name");
                            }
                        }
                    }
                } else if (role.equals("ORGANIZER")) {
                    try (PreparedStatement q = c.prepareStatement(
                        "SELECT organization_name FROM organizers WHERE user_id=?")) {
                        q.setInt(1, userId);
                        try (ResultSet o = q.executeQuery()) {
                            if (o.next()) name = o.getString("organization_name");
                        }
                    }
                }

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("UserID", userId);
                response.put("FullName", name);
                response.put("Email", email);
                response.put("role", role);
                response.put("AttendeeID", attendeeId);
                response.put("token", newToken(userId, role, attendeeId));
                send(ex, 200, response);
            }
        }
    }

    static String newToken(int userId, String role, Integer attendeeId) {
        String token = UUID.randomUUID().toString() + UUID.randomUUID();
        Map<String, Object> info = new HashMap<>();
        info.put("UserID", userId);
        info.put("role", role);
        info.put("AttendeeID", attendeeId);
        tokens.put(token, info);
        return token;
    }

    static Map<String, Object> requireUser(HttpExchange ex) throws IOException {
        String header = ex.getRequestHeaders().getFirst("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            send(ex, 401, Map.of("message", "Please log in first"));
            return null;
        }
        Map<String, Object> user = tokens.get(header.substring(7).trim());
        if (user == null) {
            send(ex, 401, Map.of("message", "Session expired. Please log in again."));
            return null;
        }
        return user;
    }

    static void createRegistration(HttpExchange ex) throws Exception {
        Map<String, Object> user = requireUser(ex);
        if (user == null) return;
        if (!"ATTENDEE".equals(user.get("role")) || user.get("AttendeeID") == null) {
            send(ex, 403, Map.of("message", "Only attendees can register for tickets"));
            return;
        }

        Map<String, Object> body = readBody(ex);
        int ticketId;
        try {
            ticketId = Integer.parseInt(str(body, "ticketId"));
        } catch (NumberFormatException e) {
            send(ex, 400, Map.of("message", "TicketID is required"));
            return;
        }
        int attendeeId = ((Number) user.get("AttendeeID")).intValue();

        try (Connection c = DBConnect.getConnection()) {
            c.setAutoCommit(false);
            try {
                int quantity;
                try (PreparedStatement p = c.prepareStatement(
                    "SELECT quantity_available FROM tickets WHERE ticket_id=? FOR UPDATE")) {
                    p.setInt(1, ticketId);
                    try (ResultSet r = p.executeQuery()) {
                        if (!r.next()) {
                            c.rollback();
                            send(ex, 404, Map.of("message", "Ticket does not exist"));
                            return;
                        }
                        quantity = r.getInt("quantity_available");
                    }
                }

                if (quantity <= 0) {
                    c.rollback();
                    send(ex, 400, Map.of("message", "No ticket inventory available"));
                    return;
                }

                try (PreparedStatement p = c.prepareStatement(
                    "SELECT registration_id FROM registrations WHERE attendee_id=? AND ticket_id=?")) {
                    p.setInt(1, attendeeId);
                    p.setInt(2, ticketId);
                    try (ResultSet r = p.executeQuery()) {
                        if (r.next()) {
                            c.rollback();
                            send(ex, 409, Map.of("message", "You already have a registration for this ticket"));
                            return;
                        }
                    }
                }

                int registrationId;
                try (PreparedStatement p = c.prepareStatement(
                    "INSERT INTO registrations (attendee_id,ticket_id,registration_status) VALUES (?,?,'PENDING')",
                    new String[]{"REGISTRATION_ID"})) {
                    p.setInt(1, attendeeId);
                    p.setInt(2, ticketId);
                    p.executeUpdate();
                    try (ResultSet keys = p.getGeneratedKeys()) {
                        if (!keys.next()) throw new SQLException("Could not retrieve registration ID");
                        registrationId = keys.getInt(1);
                    }
                }

                c.commit();
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("RegistrationID", registrationId);
                result.put("AttendeeID", attendeeId);
                result.put("TicketID", ticketId);
                result.put("RegistrationStatus", "PENDING");
                send(ex, 201, result);
            } catch (SQLException e) {
                c.rollback();
                if (e.getErrorCode() == 1) {
                    send(ex, 409, Map.of("message", "A registration already exists for this ticket"));
                    return;
                }
                throw e;
            } finally {
                c.setAutoCommit(true);
            }
        }
    }

    static void processPayment(HttpExchange ex) throws Exception {
        Map<String, Object> user = requireUser(ex);
        if (user == null) return;
        if (!"ATTENDEE".equals(user.get("role")) || user.get("AttendeeID") == null) {
            send(ex, 403, Map.of("message", "Only attendees can pay for registrations"));
            return;
        }

        Map<String, Object> body = readBody(ex);
        int registrationId;
        try {
            registrationId = Integer.parseInt(str(body, "RegistrationID"));
        } catch (NumberFormatException e) {
            send(ex, 400, Map.of("message", "RegistrationID is required"));
            return;
        }
        int attendeeId = ((Number) user.get("AttendeeID")).intValue();

        try (Connection c = DBConnect.getConnection()) {
            c.setAutoCommit(false);
            try {
                java.math.BigDecimal amount;
                try (PreparedStatement p = c.prepareStatement(
                    "SELECT t.price FROM registrations r JOIN tickets t ON t.ticket_id=r.ticket_id " +
                    "WHERE r.registration_id=? AND r.attendee_id=? AND r.registration_status='PENDING' FOR UPDATE")) {
                    p.setInt(1, registrationId);
                    p.setInt(2, attendeeId);
                    try (ResultSet r = p.executeQuery()) {
                        if (!r.next()) {
                            c.rollback();
                            send(ex, 404, Map.of("message", "Pending registration not found"));
                            return;
                        }
                        amount = r.getBigDecimal("price");
                    }
                }

                try (PreparedStatement p = c.prepareStatement(
                    "INSERT INTO payments (registration_id,amount,payment_status) VALUES (?,?,'SUCCESS')")) {
                    p.setInt(1, registrationId);
                    p.setBigDecimal(2, amount);
                    p.executeUpdate();
                }

                try (PreparedStatement p = c.prepareStatement(
                    "UPDATE registrations SET registration_status='CONFIRMED' " +
                    "WHERE registration_id=? AND attendee_id=? AND registration_status='PENDING'")) {
                    p.setInt(1, registrationId);
                    p.setInt(2, attendeeId);
                    if (p.executeUpdate() != 1) throw new SQLException("Could not confirm registration");
                }

                c.commit();
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("RegistrationID", registrationId);
                result.put("Amount", amount);
                result.put("PaymentStatus", "SUCCESS");
                result.put("RegistrationStatus", "CONFIRMED");
                send(ex, 201, result);
            } catch (SQLException e) {
                c.rollback();
                if (e.getErrorCode() == 1) {
                    send(ex, 409, Map.of("message", "A payment already exists for this registration"));
                    return;
                }
                throw e;
            } finally {
                c.setAutoCommit(true);
            }
        }
    }

    static void getMyRegistrations(HttpExchange ex) throws Exception {
        Map<String, Object> user = requireUser(ex);
        if (user == null) return;
        if (!"ATTENDEE".equals(user.get("role")) || user.get("AttendeeID") == null) {
            send(ex, 403, Map.of("message", "This endpoint is for attendees"));
            return;
        }

        int attendeeId = ((Number) user.get("AttendeeID")).intValue();
        String sql =
            "SELECT r.registration_id,r.attendee_id,r.registration_date,r.registration_status," +
            "t.ticket_type,t.price,e.title AS event_title " +
            "FROM registrations r JOIN tickets t ON t.ticket_id=r.ticket_id " +
            "JOIN events e ON e.event_id=t.event_id " +
            "WHERE r.attendee_id=? ORDER BY r.registration_date DESC";

        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection c = DBConnect.getConnection();
             PreparedStatement p = c.prepareStatement(sql)) {
            p.setInt(1, attendeeId);
            try (ResultSet r = p.executeQuery()) {
                while (r.next()) {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("RegistrationID", r.getInt("registration_id"));
                    item.put("AttendeeID", r.getInt("attendee_id"));
                    java.sql.Timestamp date = r.getTimestamp("registration_date");
                    item.put("RegistrationDate", date == null ? "" : date.toString());
                    item.put("RegistrationStatus", r.getString("registration_status"));
                    item.put("TicketType", r.getString("ticket_type"));
                    item.put("Price", r.getBigDecimal("price"));
                    item.put("EventTitle", r.getString("event_title"));
                    list.add(item);
                }
            }
        }
        send(ex, 200, list);
    }

    static String hashPassword(String password) throws Exception {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 120000, 256);
        byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(spec).getEncoded();
        spec.clearPassword();
        return "PBKDF2$" + Base64.getEncoder().encodeToString(salt) + "$" +
            Base64.getEncoder().encodeToString(hash);
    }

    static boolean verifyPassword(String password, String stored) throws Exception {
        if (stored == null || !stored.startsWith("PBKDF2$")) return false;
        String[] parts = stored.split("\\$");
        if (parts.length != 3) return false;
        byte[] salt = Base64.getDecoder().decode(parts[1]);
        byte[] expected = Base64.getDecoder().decode(parts[2]);
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 120000, 256);
        byte[] actual = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(spec).getEncoded();
        spec.clearPassword();
        return MessageDigest.isEqual(expected, actual);
    }

    static List<Map<String, Object>> getEvents() throws SQLException {
        String sql = "SELECT event_id,title,description,status,organizer_id,venue_id," +
            "TO_CHAR(start_time,'YYYY-MM-DD\"T\"HH24:MI:SS') start_date," +
            "TO_CHAR(end_time,'YYYY-MM-DD\"T\"HH24:MI:SS') end_date " +
            "FROM events ORDER BY event_id";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection c = DBConnect.getConnection();
             Statement s = c.createStatement();
             ResultSet r = s.executeQuery(sql)) {
            while (r.next()) list.add(mapEvent(r));
        }
        return list;
    }

    static Map<String, Object> getEventById(int id) throws SQLException {
        String sql = "SELECT event_id,title,description,status,organizer_id,venue_id," +
            "TO_CHAR(start_time,'YYYY-MM-DD\"T\"HH24:MI:SS') start_date," +
            "TO_CHAR(end_time,'YYYY-MM-DD\"T\"HH24:MI:SS') end_date " +
            "FROM events WHERE event_id=?";
        try (Connection c = DBConnect.getConnection();
             PreparedStatement p = c.prepareStatement(sql)) {
            p.setInt(1, id);
            try (ResultSet r = p.executeQuery()) {
                if (r.next()) return mapEvent(r);
            }
        }
        return null;
    }

    static Map<String, Object> mapEvent(ResultSet r) throws SQLException {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("EventID", r.getInt("event_id"));
        m.put("EventTitle", r.getString("title"));
        m.put("EventDescription", r.getString("description"));
        m.put("EventStatus", r.getString("status"));
        m.put("OrganizerID", r.getInt("organizer_id"));
        m.put("VenueID", r.getInt("venue_id"));
        m.put("StartDate", r.getString("start_date"));
        m.put("EndDate", r.getString("end_date"));
        return m;
    }

    static List<Map<String, Object>> getVenues() throws SQLException {
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection c = DBConnect.getConnection();
             Statement s = c.createStatement();
             ResultSet r = s.executeQuery(
                 "SELECT venue_id,venue_name,address,city,capacity FROM venues ORDER BY venue_id")) {
            while (r.next()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("VenueID", r.getInt("venue_id"));
                m.put("VenueName", r.getString("venue_name"));
                m.put("Address", r.getString("address"));
                m.put("City", r.getString("city"));
                m.put("Capacity", r.getInt("capacity"));
                list.add(m);
            }
        }
        return list;
    }

    static List<Map<String, Object>> getSessions(int id) throws SQLException {
        String sql = "SELECT session_id,event_id,title,speaker_name," +
            "TO_CHAR(start_time,'YYYY-MM-DD\"T\"HH24:MI:SS') st," +
            "TO_CHAR(end_time,'YYYY-MM-DD\"T\"HH24:MI:SS') et " +
            "FROM sessions WHERE event_id=? ORDER BY start_time";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection c = DBConnect.getConnection();
             PreparedStatement p = c.prepareStatement(sql)) {
            p.setInt(1, id);
            try (ResultSet r = p.executeQuery()) {
                while (r.next()) {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("SessionID", r.getInt("session_id"));
                    m.put("EventID", r.getInt("event_id"));
                    m.put("SessionTitle", r.getString("title"));
                    m.put("SpeakerName", r.getString("speaker_name"));
                    m.put("StartTime", r.getString("st"));
                    m.put("EndTime", r.getString("et"));
                    list.add(m);
                }
            }
        }
        return list;
    }

    static List<Map<String, Object>> getTickets(int id) throws SQLException {
        String sql = "SELECT t.ticket_id,t.event_id,t.ticket_type,t.price,t.quantity_available," +
            "(SELECT COUNT(*) FROM registrations r WHERE r.ticket_id=t.ticket_id " +
            "AND UPPER(r.registration_status) IN ('PENDING','CONFIRMED')) sold " +
            "FROM tickets t WHERE t.event_id=? ORDER BY t.ticket_id";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection c = DBConnect.getConnection();
             PreparedStatement p = c.prepareStatement(sql)) {
            p.setInt(1, id);
            try (ResultSet r = p.executeQuery()) {
                while (r.next()) {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("TicketID", r.getInt("ticket_id"));
                    m.put("TicketType", r.getString("ticket_type"));
                    m.put("Price", r.getBigDecimal("price"));
                    m.put("QuantityAvailable", r.getInt("quantity_available"));
                    m.put("QuantitySold", r.getInt("sold"));
                    m.put("EventID", r.getInt("event_id"));
                    list.add(m);
                }
            }
        }
        return list;
    }

    static void send(HttpExchange ex, int status, Object data) throws IOException {
        byte[] bytes = gson.toJson(data).getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = ex.getResponseBody()) {
            out.write(bytes);
        }
    }
}
