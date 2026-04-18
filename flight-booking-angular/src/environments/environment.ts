export const environment = {
  production: false,
  apiUrl: 'http://localhost:8765',
  payment: {
    razorpay: {
      keyId: 'rzp_test_pdQFHMNndEZa99', // Match your backend key
      enabled: true
    },
    stripe: {
      publishableKey: 'pk_test_YOUR_STRIPE_TEST_KEY',
      enabled: false
    },
    paytm: {
      merchantId: 'YOUR_TEST_MERCHANT_ID',
      enabled: false
    },
    upi: {
      enabled: true,
      merchantVpa: 'test@upi'
    }
  }
};