# Payment Gateway Integration Guide

## Overview
This guide explains how to integrate real payment gateways with your flight booking application.

## Supported Payment Methods

### 1. Razorpay Integration

#### Setup Steps:
1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up for a business account
   - Complete KYC verification

2. **Get API Keys**
   - Login to Razorpay Dashboard
   - Go to Settings > API Keys
   - Generate Key ID and Key Secret
   - Copy Test keys for development, Live keys for production

3. **Update Configuration**
   ```typescript
   // In src/environments/environment.ts (for development)
   razorpay: {
     keyId: 'rzp_test_YOUR_TEST_KEY_HERE',
     enabled: true
   }
   
   // In src/environments/environment.prod.ts (for production)
   razorpay: {
     keyId: 'rzp_live_YOUR_LIVE_KEY_HERE',
     enabled: true
   }
   ```

4. **Backend Integration Required**
   - Create order endpoint: `POST /api/payment/create-order`
   - Verify payment endpoint: `POST /api/payment/verify-payment`
   - Webhook endpoint: `POST /api/payment/webhook`

#### Backend Code Example (Spring Boot):
```java
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrder> createOrder(@RequestBody PaymentRequest request) {
        // Create Razorpay order
        RazorpayClient razorpay = new RazorpayClient("YOUR_KEY_ID", "YOUR_KEY_SECRET");
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + request.getBookingId());
        
        Order order = razorpay.orders.create(orderRequest);
        
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setOrderId(order.get("id"));
        paymentOrder.setAmount(request.getAmount());
        paymentOrder.setCurrency("INR");
        paymentOrder.setStatus("CREATED");
        
        return ResponseEntity.ok(paymentOrder);
    }
    
    @PostMapping("/verify-payment")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody PaymentVerification verification) {
        // Verify payment signature
        String signature = verification.getRazorpaySignature();
        String orderId = verification.getRazorpayOrderId();
        String paymentId = verification.getRazorpayPaymentId();
        
        String payload = orderId + "|" + paymentId;
        String expectedSignature = Utils.getHash(payload, "YOUR_KEY_SECRET");
        
        if (signature.equals(expectedSignature)) {
            // Payment verified - update booking status
            bookingService.confirmBooking(verification.getBookingId());
            
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setPaymentId(paymentId);
            response.setMessage("Payment verified successfully");
            
            return ResponseEntity.ok(response);
        } else {
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(false);
            response.setMessage("Payment verification failed");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
```

### 2. UPI Integration

#### Direct UPI Links:
```typescript
// Generate UPI payment URL
const upiUrl = `upi://pay?pa=${merchantVpa}&pn=${merchantName}&am=${amount}&cu=INR&tn=${description}`;

// For mobile devices
if (this.isMobileDevice()) {
  window.location.href = upiUrl;
}
```

#### UPI QR Code Generation:
```typescript
// Use QR code library to generate UPI QR
import * as QRCode from 'qrcode';

generateUPIQR(upiUrl: string) {
  QRCode.toDataURL(upiUrl, (err, url) => {
    if (!err) {
      // Display QR code to user
      this.showQRCode(url);
    }
  });
}
```

### 3. Stripe Integration (Optional)

#### Setup Steps:
1. Create Stripe account at https://stripe.com
2. Get publishable and secret keys
3. Install Stripe SDK: `npm install @stripe/stripe-js`

#### Frontend Integration:
```typescript
import { loadStripe } from '@stripe/stripe-js';

async initiateStripePayment() {
  const stripe = await loadStripe(environment.payment.stripe.publishableKey);
  
  // Create payment intent on backend
  const response = await this.paymentService.createStripePaymentIntent(paymentData);
  
  // Confirm payment
  const result = await stripe.confirmCardPayment(response.clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: this.currentUser.name,
        email: this.currentUser.email
      }
    }
  });
  
  if (result.error) {
    this.handlePaymentError(result.error.message);
  } else {
    this.handlePaymentSuccess(result.paymentIntent);
  }
}
```

## Security Best Practices

### 1. API Key Management
- Never expose secret keys in frontend code
- Use environment variables for sensitive data
- Rotate keys regularly
- Use different keys for test and production

### 2. Payment Verification
- Always verify payments on backend
- Use webhook signatures for validation
- Implement idempotency for payment processing
- Log all payment transactions

### 3. Error Handling
- Implement proper error handling for failed payments
- Provide clear error messages to users
- Retry mechanisms for network failures
- Fallback payment methods

## Testing

### 1. Test Cards (Razorpay)
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

### 2. Test UPI IDs
- Success: success@razorpay
- Failure: failure@razorpay

## Webhook Configuration

### Razorpay Webhooks:
1. Go to Razorpay Dashboard > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: payment.captured, payment.failed
4. Add webhook secret for verification

### Webhook Handler Example:
```java
@PostMapping("/webhook")
public ResponseEntity<String> handleWebhook(@RequestBody String payload, 
                                          @RequestHeader("X-Razorpay-Signature") String signature) {
    // Verify webhook signature
    if (verifyWebhookSignature(payload, signature)) {
        // Process webhook event
        JSONObject event = new JSONObject(payload);
        String eventType = event.getString("event");
        
        switch (eventType) {
            case "payment.captured":
                handlePaymentSuccess(event);
                break;
            case "payment.failed":
                handlePaymentFailure(event);
                break;
        }
        
        return ResponseEntity.ok("OK");
    }
    
    return ResponseEntity.badRequest().body("Invalid signature");
}
```

## Go Live Checklist

### Before Production:
- [ ] Replace test keys with live keys
- [ ] Complete KYC verification with payment gateway
- [ ] Test all payment flows thoroughly
- [ ] Set up webhook endpoints
- [ ] Configure SSL certificates
- [ ] Implement proper logging and monitoring
- [ ] Set up payment reconciliation
- [ ] Test refund functionality
- [ ] Implement payment retry mechanisms
- [ ] Set up fraud detection rules

### Compliance:
- [ ] PCI DSS compliance (if handling card data)
- [ ] Data protection regulations (GDPR, etc.)
- [ ] Local payment regulations
- [ ] Tax compliance for digital payments

## Support and Documentation

### Razorpay:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

### Stripe:
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com/

### UPI:
- NPCI Guidelines: https://www.npci.org.in/what-we-do/upi

## Troubleshooting

### Common Issues:
1. **Payment Gateway Not Loading**
   - Check if SDK scripts are loaded
   - Verify API keys are correct
   - Check network connectivity

2. **Payment Verification Failing**
   - Verify webhook signatures
   - Check server-side validation logic
   - Ensure proper error handling

3. **Mobile UPI Not Working**
   - Check UPI URL format
   - Verify device has UPI apps installed
   - Test on different devices

### Debug Mode:
Enable debug logging in development:
```typescript
// In payment service
console.log('Payment request:', paymentRequest);
console.log('Payment response:', response);
```

## Contact Information
For technical support with payment integration, contact your development team or payment gateway support.