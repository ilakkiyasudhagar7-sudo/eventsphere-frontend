
import java.sql.*;
import java.util.Scanner;

public class RegistrationService {
    public static void register(int attendeeId, int ticketId) {
        String sql = "{call sp_register_attendee(?, ?, ?, ?)}";

        try (Connection con = DBConnect.getConnection();
             CallableStatement cs = con.prepareCall(sql)) {

            cs.setInt(1, attendeeId);
            cs.setInt(2, ticketId);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.registerOutParameter(4, Types.NUMERIC);

            cs.execute();

            String status = cs.getString(3);
            int registrationId = cs.getInt(4);

            System.out.println("Registration status: " + status);
            if (status.equals("SUCCESS")) {
                System.out.println("Registration ID: " + registrationId);
            }

        } catch (SQLException e) {
            System.out.println("Database error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Attendee ID: ");
        int attendeeId = sc.nextInt();

        System.out.print("Ticket ID: ");
        int ticketId = sc.nextInt();

        register(attendeeId, ticketId);
        sc.close();
    }
}
