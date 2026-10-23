
import java.sql.*;
import java.util.Scanner;

public class PaymentService {
    public static void processPayment(int registrationId, double amount) {
        String sql = "{call sp_process_payment(?, ?, ?, ?)}";

        try (Connection con = DBConnect.getConnection();
             CallableStatement cs = con.prepareCall(sql)) {

            cs.setInt(1, registrationId);
            cs.setDouble(2, amount);
            cs.setString(3, "SUCCESS");
            cs.registerOutParameter(4, Types.NUMERIC);

            cs.execute();

            System.out.println("Payment successful!");
            System.out.println("Payment ID: " + cs.getInt(4));

        } catch (SQLException e) {
            System.out.println("Payment failed: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Registration ID: ");
        int registrationId = sc.nextInt();

        System.out.print("Amount: ");
        double amount = sc.nextDouble();

        processPayment(registrationId, amount);
        sc.close();
    }
}
