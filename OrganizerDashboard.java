
import java.sql.*;

public class OrganizerDashboard {
    public static void main(String[] args) {
        String sql = "SELECT organization_name, title, " +
                     "total_registrations, total_revenue " +
                     "FROM vw_organizer_analytics";

        try (Connection con = DBConnect.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            System.out.println("\n=== ORGANIZER DASHBOARD ===");

            while (rs.next()) {
                System.out.println("----------------------------");
                System.out.println("Organizer: " +
                    rs.getString("organization_name"));
                System.out.println("Event: " +
                    rs.getString("title"));
                System.out.println("Registrations: " +
                    rs.getInt("total_registrations"));
                System.out.println("Revenue: Rs. " +
                    rs.getDouble("total_revenue"));
            }

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
