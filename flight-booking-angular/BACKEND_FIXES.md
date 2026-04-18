# Backend Payment Service Fixes

## 1. Fix createOrder method in PaymentService.java:

```java
public ResponseDTO createOrder(Long bookingId, Double amount) throws Exception {
    // Add proper null validation
    if (bookingId == null || amount == null || amount <= 0) {
        throw new IllegalArgumentException("BookingId and amount are required and amount must be positive");
    }

    RazorpayClient client = new RazorpayClient(keyId, keySecret);

    JSONObject orderRequest = new JSONObject();
    orderRequest.put("amount", (int)(amount * 100)); // Convert to paise
    orderRequest.put("currency", "INR");
    orderRequest.put("receipt", "txn_" + bookingId);

    Order order = client.orders.create(orderRequest);
    savePayment(order.get("id"), amount, "INR", order.get("status"));

    System.out.println("Creating payment order for bookingId = " + bookingId + ", amount = " + amount);
    System.out.println("Order ID: " + order.get("id"));
    System.out.println("Order status: " + order.get("status"));

    return new ResponseDTO(
            order.get("id"),
            order.get("status"),
            keyId,
            amount
    );
}
```

## 2. Update ResponseDTO to match frontend expectations:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO {
    private String orderId;  // Make sure this matches frontend
    private String status;
    private String currency;
    private Double amount;
}
```

## 3. Add proper error handling in PaymentController:

```java
@PostMapping("/create-order")
public ResponseEntity<?> createOrder(@RequestParam Long bookingId, @RequestParam Double amount) {
    try {
        if (bookingId == null || amount == null) {
            return ResponseEntity.badRequest().body("BookingId and amount are required");
        }
        
        ResponseDTO response = paymentService.createOrder(bookingId, amount);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        System.err.println("Payment order creation failed: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500).body("Failed to create payment order: " + e.getMessage());
    }
}
```

## 4. Check your application.properties:

```properties
razorpay.key_id=rzp_test_YOUR_KEY_HERE
razorpay.key_secret=YOUR_SECRET_HERE
```

## 5. Verify booking exists before creating payment:

```java
public ResponseDTO createOrder(Long bookingId, Double amount) throws Exception {
    // Validate inputs
    if (bookingId == null || amount == null || amount <= 0) {
        throw new IllegalArgumentException("Invalid booking ID or amount");
    }
    
    // Check if booking exists (add this validation)
    try {
        String bookingStatus = bookingInterface.getBookingStatus(bookingId);
        if (!"PENDING".equals(bookingStatus)) {
            throw new IllegalStateException("Booking is not in pending state");
        }
    } catch (Exception e) {
        throw new IllegalStateException("Booking not found or invalid: " + e.getMessage());
    }
    
    // Rest of your code...
}
```