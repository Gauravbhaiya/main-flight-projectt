export interface PaymentConfig {
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paytm: {
    merchantId: string;
    merchantKey: string;
    website: string;
    industryType: string;
  };
  upi: {
    merchantVpa: string;
    merchantName: string;
  };
}

// Environment-based configuration
export const PAYMENT_CONFIG: PaymentConfig = {
  razorpay: {
    keyId: 'rzp_live_YOUR_LIVE_KEY_HERE', // Replace with your live key
    keySecret: 'YOUR_RAZORPAY_SECRET', // Keep this on backend only
    webhookSecret: 'YOUR_WEBHOOK_SECRET'
  },
  stripe: {
    publishableKey: 'pk_live_YOUR_STRIPE_PUBLISHABLE_KEY',
    secretKey: 'sk_live_YOUR_STRIPE_SECRET_KEY', // Keep this on backend only
    webhookSecret: 'whsec_YOUR_WEBHOOK_SECRET'
  },
  paytm: {
    merchantId: 'YOUR_PAYTM_MERCHANT_ID',
    merchantKey: 'YOUR_PAYTM_MERCHANT_KEY', // Keep this on backend only
    website: 'WEBSTAGING', // or 'DEFAULT' for production
    industryType: 'Retail'
  },
  upi: {
    merchantVpa: '8445621552@ybl', // Your UPI ID
    merchantName: ''
  }
};

// Test configuration (for development)
export const TEST_PAYMENT_CONFIG: PaymentConfig = {
  razorpay: {
    keyId: 'rzp_test_PifQBzW71QUioe', // Your actual test key ID
    keySecret: 'MoQS1lZjVJuhubwgCpUoNPQY', // Your actual test secret
    webhookSecret: 'YOUR_TEST_WEBHOOK_SECRET'
  },
  stripe: {
    publishableKey: 'pk_test_YOUR_TEST_KEY',
    secretKey: 'sk_test_YOUR_TEST_SECRET',
    webhookSecret: 'whsec_YOUR_TEST_WEBHOOK'
  },
  paytm: {
    merchantId: 'YOUR_TEST_MERCHANT_ID',
    merchantKey: 'YOUR_TEST_MERCHANT_KEY',
    website: 'Bhartiye Airline',
    industryType: 'Retail'
  },
  upi: {
    merchantVpa: 'test@upi',
    merchantName: 'FlightHub Test'
  }
};

// Get configuration based on environment
export function getPaymentConfig(): PaymentConfig {
  const isProduction = window.location.hostname !== 'localhost';
  return isProduction ? PAYMENT_CONFIG : TEST_PAYMENT_CONFIG;
}