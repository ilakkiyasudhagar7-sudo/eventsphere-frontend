import java.sql.*;
import java.util.Scanner;

public class EventSphereApp {
    static Scanner sc = new Scanner(System.in);

    static void listEvents() {
        String sql = "SELECT event_id, title, city FROM vw_published_events";

        try (Connection con = DBConnect.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                System.out.println(
                    rs.getInt("event_id") + " | " +
                    rs.getString("title") + " | " +
                    rs.getString("city")
                );
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    static void register() {
        System.out.print("Attendee ID: ");
        int attendee = sc.nextInt();
        System.out.print("Ticket ID: ");
        int ticket = sc.nextInt();

        try (Connection con = DBConnect.getConnection();
             CallableStatement cs =
                 con.prepareCall("{call sp_register_attendee(?, ?, ?, ?)}")) {

            cs.setInt(1, attendee);
            cs.setInt(2, ticket);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.registerOutParameter(4, Types.NUMERIC);
            cs.execute();

            System.out.println("Status: " + cs.getString(3));
            if ("SUCCESS".equals(cs.getString(3)))
                System.out.println("Registration ID: " + cs.getInt(4));

        } catch (SQLException e) {
            System.out.println("Registration error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        while (true) {
            System.out.println("\n=== EVENTSPHERE ===");
            System.out.println("1. Browse published events");
            System.out.println("2. Register for a ticket");
            System.out.println("3. Organizer dashboard");
            System.out.println("4. Exit");
            System.out.print("Choose: ");

            int choice = sc.nextInt();

            switch (choice) {
                case 1 -> listEvents();
                case 2 -> register();
                case 3 -> OrganizerDashboard.main(new String[]{});
                case 4 -> {
                    System.out.println("Goodbye!");
                    return;
                }
                default -> System.out.println("Invalid choice.");
            }
        }
    }
}