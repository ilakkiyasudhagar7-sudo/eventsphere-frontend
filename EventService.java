
import java.sql.*;
import java.util.*;

public class EventService {

    public static void displayPublishedEvents() {
        String sql = "SELECT event_id, title, status " +
                     "FROM vw_published_events " +
                     "ORDER BY start_time";

        try (Connection con = DBConnect.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            System.out.println("\n=== EVENTSPHERE EVENTS ===");

            while (rs.next()) {
                System.out.println("--------------------------");
                System.out.println("ID: " + rs.getInt("event_id"));
                System.out.println("Title: " + rs.getString("title"));
                System.out.println("Status: " + rs.getString("status"));
            }

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        displayPublishedEvents();
    }
}
