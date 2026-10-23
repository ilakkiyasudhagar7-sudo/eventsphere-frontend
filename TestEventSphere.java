import java.sql.*;

public class TestEventSphere {
    public static void main(String[] args) {
        try (Connection con = DBConnect.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(
                 "SELECT event_id, title, status FROM events")) {

            while (rs.next()) {
                System.out.println(
                    rs.getInt("event_id") + " | " +
                    rs.getString("title") + " | " +
                    rs.getString("status")
                );
            }

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}