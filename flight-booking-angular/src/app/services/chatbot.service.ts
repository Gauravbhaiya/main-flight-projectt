import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'card' | 'action' | 'form' | 'media';
  quickReplies?: QuickReply[];
  actions?: ChatAction[];
  metadata?: any;
}

export interface QuickReply {
  text: string;
  payload: string;
  icon?: string;
}

export interface ChatAction {
  type: 'search' | 'book' | 'pay' | 'cancel' | 'redirect' | 'call' | 'email';
  label: string;
  data?: any;
  icon?: string;
}

export interface UserContext {
  name?: string;
  email?: string;
  lastBooking?: any;
  preferences?: any;
  conversationHistory: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8090/api/chatbot';
  private userContext: UserContext = { conversationHistory: [] };
  private contextSubject = new BehaviorSubject<UserContext>(this.userContext);
  
  private advancedKnowledge = {
    flights: {
      airlines: ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia'],
      airports: {
        'DEL': 'Delhi', 'BOM': 'Mumbai', 'BLR': 'Bangalore', 'MAA': 'Chennai',
        'CCU': 'Kolkata', 'HYD': 'Hyderabad', 'PNQ': 'Pune', 'AMD': 'Ahmedabad'
      },
      classes: ['Economy', 'Premium Economy', 'Business', 'First Class']
    },
    policies: {
      cancellation: 'Free cancellation up to 24 hours before departure',
      baggage: 'Economy: 15kg, Business: 25kg, First: 35kg',
      checkin: 'Online check-in opens 48 hours before departure'
    },
    realTimeData: {
      weather: true,
      flightStatus: true,
      prices: true
    }
  };

  constructor(private http: HttpClient) {}

  sendMessage(message: string, context?: any): Observable<ChatMessage> {
    this.userContext.conversationHistory.push(message);
    const response = this.generateAdvancedResponse(message, context);
    return of(response);
  }

  private generateAdvancedResponse(userMessage: string, context?: any): ChatMessage {
    const message = userMessage.toLowerCase();
    const intent = this.detectAdvancedIntent(message);
    const entities = this.extractEntities(message);
    
    let botResponse = '';
    let quickReplies: QuickReply[] = [];
    let actions: ChatAction[] = [];
    let type: 'text' | 'quick-reply' | 'card' | 'action' = 'text';

    switch (intent) {
      case 'greeting':
        botResponse = this.getPersonalizedGreeting();
        quickReplies = [
          { text: '✈️ Search Flights', payload: 'search_flights', icon: '✈️' },
          { text: '📋 My Bookings', payload: 'my_bookings', icon: '📋' },
          { text: '💳 Payment Help', payload: 'payment_help', icon: '💳' },
          { text: '🎯 Flight Deals', payload: 'flight_deals', icon: '🎯' }
        ];
        type = 'quick-reply';
        break;

      case 'casual_chat':
        botResponse = this.handleCasualChat(message);
        quickReplies = [
          { text: '🤖 My Capabilities', payload: 'capabilities', icon: '🤖' },
          { text: '✈️ Let\'s Book Flights', payload: 'book_flights', icon: '✈️' },
          { text: '🎯 Show Deals', payload: 'show_deals', icon: '🎯' },
          { text: '💬 Keep Chatting', payload: 'keep_chatting', icon: '💬' }
        ];
        type = 'quick-reply';
        break;

      case 'compliments':
        botResponse = this.handleCompliments();
        quickReplies = [
          { text: '🚀 What\'s Next?', payload: 'whats_next', icon: '🚀' },
          { text: '✈️ Plan a Trip', payload: 'plan_trip', icon: '✈️' },
          { text: '🎁 Special Offers', payload: 'special_offers', icon: '🎁' }
        ];
        type = 'quick-reply';
        break;

      case 'farewell':
        botResponse = this.handleFarewell();
        quickReplies = [
          { text: '🔄 Start Over', payload: 'start_over', icon: '🔄' },
          { text: '📞 Contact Support', payload: 'contact_support', icon: '📞' }
        ];
        type = 'quick-reply';
        break;

      case 'fun_chat':
        botResponse = this.handleFunChat();
        quickReplies = [
          { text: '😂 Another One!', payload: 'another_joke', icon: '😂' },
          { text: '✈️ Back to Business', payload: 'back_to_business', icon: '✈️' },
          { text: '🎲 Random Fact', payload: 'random_fact', icon: '🎲' }
        ];
        type = 'quick-reply';
        break;

      case 'flight_search':
        botResponse = this.handleFlightSearch(entities);
        actions = [
          { type: 'search', label: 'Search Flights Now', icon: '🔍' },
          { type: 'redirect', label: 'Go to Search', data: '/dashboard', icon: '🚀' }
        ];
        type = 'action';
        break;

      case 'booking_status':
        botResponse = this.handleBookingStatus(entities);
        actions = [
          { type: 'redirect', label: 'View My Bookings', data: '/bookings', icon: '📋' }
        ];
        break;

      case 'payment_issue':
        botResponse = this.handlePaymentIssue(entities);
        actions = [
          { type: 'call', label: 'Call Support', data: '+91-1800-123-4567', icon: '📞' },
          { type: 'email', label: 'Email Support', data: 'payments@flighthub.com', icon: '📧' }
        ];
        break;

      case 'flight_status':
        botResponse = this.getFlightStatus(entities);
        break;

      case 'weather_info':
        botResponse = this.getWeatherInfo(entities);
        break;

      case 'price_alert':
        botResponse = this.handlePriceAlert(entities);
        break;

      case 'emergency':
        botResponse = this.handleEmergency();
        actions = [
          { type: 'call', label: '🚨 Emergency Hotline', data: '+91-1800-EMERGENCY', icon: '🚨' },
          { type: 'redirect', label: 'Emergency Support', data: '/emergency', icon: '⚡' }
        ];
        type = 'action';
        break;

      default:
        botResponse = this.handleAdvancedQuery(message, entities);
        quickReplies = this.getContextualSuggestions();
        type = 'quick-reply';
    }

    return {
      id: Date.now().toString(),
      message: botResponse,
      sender: 'bot',
      timestamp: new Date(),
      type,
      quickReplies,
      actions,
      metadata: { intent, entities, context }
    };
  }

  private detectAdvancedIntent(message: string): string {
    const intents = {
      greeting: [
        'hello', 'hi', 'hey', 'hii', 'hlw', 'helo', 'hllo', 'hiya', 'howdy',
        'good morning', 'good afternoon', 'good evening', 'good night',
        'start', 'begin', 'sup', 'what\'s up', 'whatsup', 'wassup',
        'greetings', 'salutations', 'yo', 'hola', 'namaste', 'namaskar'
      ],
      casual_chat: [
        'how are you', 'how r u', 'how do you do', 'what\'s new', 'how\'s it going',
        'how have you been', 'what\'s happening', 'how\'s life', 'how\'s your day',
        'nice to meet you', 'pleasure to meet', 'tell me about yourself',
        'who are you', 'what are you', 'are you real', 'are you human',
        'what can you do', 'help me', 'i need help', 'assist me'
      ],
      compliments: [
        'thank you', 'thanks', 'thx', 'appreciate', 'awesome', 'great',
        'excellent', 'amazing', 'wonderful', 'fantastic', 'good job',
        'well done', 'nice', 'cool', 'perfect', 'brilliant', 'outstanding'
      ],
      farewell: [
        'bye', 'goodbye', 'see you', 'farewell', 'take care', 'catch you later',
        'until next time', 'talk to you later', 'ttyl', 'cya', 'peace out',
        'have a good day', 'have a nice day', 'good night', 'sleep well'
      ],
      flight_search: ['search', 'find', 'book', 'flight', 'ticket', 'travel', 'fly', 'trip', 'journey'],
      booking_status: ['booking', 'reservation', 'my booking', 'status', 'confirm', 'check booking'],
      payment_issue: ['payment', 'pay', 'card', 'failed', 'refund', 'money', 'transaction', 'billing'],
      flight_status: ['flight status', 'delay', 'on time', 'departure', 'arrival', 'gate', 'terminal'],
      weather_info: ['weather', 'climate', 'temperature', 'rain', 'storm', 'forecast', 'sunny', 'cloudy'],
      price_alert: ['price', 'cheap', 'deal', 'offer', 'discount', 'alert', 'sale', 'promotion'],
      emergency: ['emergency', 'urgent', 'help', 'stuck', 'problem', 'issue', 'crisis', 'trouble'],
      cancel: ['cancel', 'cancellation', 'refund', 'modify', 'change', 'reschedule'],
      fun_chat: [
        'joke', 'funny', 'laugh', 'humor', 'entertainment', 'story', 'tell me something',
        'bored', 'boring', 'fun', 'interesting', 'surprise me', 'random fact'
      ]
    };

    // Enhanced intent detection with fuzzy matching
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => {
        // Exact match
        if (message.includes(keyword)) return true;
        // Fuzzy match for common typos
        return this.fuzzyMatch(message, keyword, 0.8);
      })) {
        return intent;
      }
    }
    return 'general';
  }

  private fuzzyMatch(text: string, pattern: string, threshold: number = 0.8): boolean {
    const distance = this.levenshteinDistance(text.toLowerCase(), pattern.toLowerCase());
    const maxLength = Math.max(text.length, pattern.length);
    const similarity = 1 - (distance / maxLength);
    return similarity >= threshold;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  private extractEntities(message: string): any {
    const entities: any = {};
    
    // Extract cities
    const cities = Object.values(this.advancedKnowledge.flights.airports);
    cities.forEach(city => {
      if (message.toLowerCase().includes(city.toLowerCase())) {
        entities.city = city;
      }
    });

    // Extract dates
    const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|tomorrow|today|next week/gi;
    const dateMatch = message.match(dateRegex);
    if (dateMatch) entities.date = dateMatch[0];

    // Extract numbers
    const numberRegex = /\d+/g;
    const numbers = message.match(numberRegex);
    if (numbers) entities.numbers = numbers;

    return entities;
  }

  private getPersonalizedGreeting(): string {
    const hour = new Date().getHours();
    const greetings = {
      morning: ['Good morning', 'Rise and shine', 'Morning', 'Top of the morning'],
      afternoon: ['Good afternoon', 'Hello there', 'Afternoon', 'Hey there'],
      evening: ['Good evening', 'Evening', 'Hello', 'Hey']
    };
    
    let timeGreetings = greetings.morning;
    if (hour >= 12 && hour < 17) timeGreetings = greetings.afternoon;
    else if (hour >= 17) timeGreetings = greetings.evening;
    
    const randomGreeting = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
    
    const personalizedMessages = [
      `${randomGreeting}! 🌟 I'm your super-smart FlightHub AI assistant, and I'm absolutely thrilled to help you today!`,
      `${randomGreeting}! ✨ Welcome to FlightHub! I'm your AI travel companion with some seriously cool powers!`,
      `${randomGreeting}! 🚀 Hey there, travel enthusiast! I'm your AI-powered flight booking genius!`,
      `${randomGreeting}! 🎯 Ready for an amazing travel experience? I'm your AI assistant with superpowers!`
    ];
    
    const selectedMessage = personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];

    return `${selectedMessage}

🧠 **My Superpowers:**
• 🔍 Smart flight search with AI recommendations
• 💰 Real-time price tracking & best deal alerts
• 🌤️ Weather forecasts for perfect trip planning
• 🎤 Voice commands in 12+ languages
• ⚡ Lightning-fast booking & instant confirmations
• 🆘 24/7 emergency travel support

🎉 **Fun Fact:** I process over 10,000 flight queries per minute and can find you deals others miss!

💬 **I'm great at casual chat too!** Feel free to ask me anything - from flight bookings to travel jokes!

What adventure can I help you plan today?`;
  }

  private handleCasualChat(message: string): string {
    const responses = {
      'how are you': [
        "I'm doing fantastic! 🌟 Thanks for asking! I'm running at full AI capacity and ready to help you with amazing flight deals!",
        "I'm absolutely wonderful! 😊 Just helped someone find a great deal to Paris! How are YOU doing?",
        "I'm having a great day helping travelers like you! 🚀 My circuits are buzzing with excitement!"
      ],
      'who are you': [
        "I'm your AI-powered travel companion! 🤖 Think of me as your personal flight booking genius with a fun personality!",
        "I'm FlightHub's advanced AI assistant! ✨ I'm here to make your travel dreams come true with smart technology and a friendly chat!",
        "I'm your super-smart travel buddy! 🧠 I combine cutting-edge AI with a love for helping people explore the world!"
      ],
      'what can you do': [
        "Oh, I can do SO much! 🚀 I can find flights, track prices, check weather, handle bookings, crack jokes, and even chat about life!",
        "I'm like a Swiss Army knife for travel! ⚡ Flight search, booking management, payment help, weather updates, and I'm great company too!",
        "I'm your all-in-one travel solution! 🌟 From finding the perfect flight to entertaining you with travel facts - I've got you covered!"
      ],
      'default': [
        "That's interesting! 😊 I love chatting with travelers! Speaking of which, are you planning any exciting trips?",
        "I appreciate you sharing that! 💫 I'm always here for a good conversation. Any travel plans on your mind?",
        "Thanks for chatting with me! 🌟 I enjoy getting to know the amazing people I help. What brings you here today?"
      ]
    };

    // Find matching response category
    for (const [key, responseArray] of Object.entries(responses)) {
      if (key !== 'default' && message.toLowerCase().includes(key)) {
        return responseArray[Math.floor(Math.random() * responseArray.length)];
      }
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }

  private handleCompliments(): string {
    const responses = [
      "Aww, thank you so much! 😊 You just made my AI heart happy! I love helping awesome people like you!",
      "You're too kind! 🌟 It's my pleasure to help! Your positive energy makes my job even more enjoyable!",
      "Thank you! 💫 Compliments like yours fuel my AI enthusiasm! I'm here whenever you need travel assistance!",
      "That means the world to me! 🚀 I'm designed to be helpful, but knowing I'm doing a good job makes it all worthwhile!",
      "You're absolutely wonderful! ✨ Thank you for the kind words! Now, how can I make your day even better?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private handleFarewell(): string {
    const responses = [
      "Goodbye for now! 👋 It was absolutely wonderful chatting with you! Safe travels, and come back anytime!",
      "Take care! ✨ Thanks for the great conversation! I'll be here whenever you need flight assistance!",
      "Farewell, my friend! 🌟 May your future travels be filled with amazing adventures! See you soon!",
      "Until next time! 🚀 It's been a pleasure helping you! Wishing you blue skies and smooth flights!",
      "Bye bye! 💫 Thanks for brightening my day! Remember, I'm always here for your travel needs!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private handleFunChat(): string {
    const jokes = [
      "Why don't airplanes ever get tired? Because they have jet lag! ✈️😂",
      "What do you call a flying primate? A hot air baboon! 🐒🎈",
      "Why did the airplane break up with the runway? It needed some space! 🛫💔",
      "What's a pilot's favorite type of music? Plane rock! 🎸✈️"
    ];
    
    const facts = [
      "🌟 Fun Fact: The longest commercial flight is from Singapore to New York - 18 hours and 50 minutes!",
      "✈️ Did you know? Airplane food tastes different because your taste buds are less sensitive at high altitude!",
      "🌍 Amazing: There are over 100,000 flights per day worldwide!",
      "🚀 Cool fact: The fastest commercial aircraft can reach speeds of 660 mph!"
    ];
    
    const stories = [
      "🎭 Here's a travel story: A passenger once accidentally boarded a flight to Auckland instead of Oakland. Talk about a surprise vacation!",
      "😄 Funny story: A man once missed his flight because he was in the wrong terminal... in the wrong airport... in the wrong city!",
      "🌟 Heartwarming: An airline crew once organized a mid-flight birthday party for a passenger celebrating alone!"
    ];
    
    const allContent = [...jokes, ...facts, ...stories];
    return allContent[Math.floor(Math.random() * allContent.length)];
  }

  private handleFlightSearch(entities: any): string {
    const suggestions = this.getFlightSuggestions(entities);
    return `🔍 **Advanced Flight Search Ready!**

I can help you find the perfect flight with:

✨ **Smart Search Features:**
• Real-time price comparison across all airlines
• Flexible date options (±3 days) for best deals
• Multi-city and round-trip planning
• Seat availability and class upgrades

${entities.city ? `🎯 I noticed you mentioned **${entities.city}**. ` : ''}

📊 **Current Market Insights:**
• Average domestic flight: ₹4,500-8,000
• Best booking time: 2-8 weeks in advance
• Cheapest days: Tuesday & Wednesday

${suggestions}

Ready to search? Just tell me your departure city, destination, and travel date!`;
  }

  private getFlightSuggestions(entities: any): string {
    const popularRoutes = [
      'Delhi → Mumbai (₹4,200+)',
      'Mumbai → Bangalore (₹3,800+)', 
      'Delhi → Goa (₹5,500+)',
      'Bangalore → Chennai (₹2,900+)'
    ];
    
    return `🔥 **Popular Routes Today:**\n${popularRoutes.map(route => `• ${route}`).join('\n')}`;
  }

  private handleBookingStatus(entities: any): string {
    return `📋 **Booking Status Center**

I can help you with:

🔍 **Track Your Bookings:**
• Real-time flight status updates
• Gate changes & delay notifications  
• Seat assignments & meal preferences
• Digital boarding passes

📱 **Instant Updates:**
• SMS & email notifications
• Mobile app push alerts
• WhatsApp status updates

💡 **Quick Actions:**
• Modify booking details
• Add extra services (meals, seats, baggage)
• Request special assistance
• Download e-tickets

Would you like me to check a specific booking? Please share your booking reference or registered email.`;
  }

  private handlePaymentIssue(entities: any): string {
    return `💳 **Payment Support Center**

I'm here to resolve your payment issues quickly:

🛡️ **Secure Payment Options:**
• Razorpay (Cards, UPI, Net Banking, Wallets)
• EMI options available (3-12 months)
• International cards accepted
• Cryptocurrency payments (coming soon)

⚡ **Common Issues & Solutions:**
• **Payment Failed:** Retry with different method
• **Amount Deducted:** Refund processed in 5-7 days
• **OTP Issues:** Check SMS/email, try resend
• **Card Declined:** Contact your bank

🔄 **Refund Status:**
• Instant refunds for UPI/Wallets
• 3-5 days for cards
• 7-10 days for net banking

Need immediate assistance? I can connect you with our payment specialists right now!`;
  }

  private getFlightStatus(entities: any): string {
    return `✈️ **Real-Time Flight Status**

🛰️ **Live Tracking Available:**
• Current location & altitude
• Estimated arrival time
• Gate information
• Baggage carousel details

📊 **Today's Flight Performance:**
• 89% flights on-time
• Average delay: 12 minutes
• Weather impact: Minimal

🌤️ **Weather Conditions:**
• Clear skies at major airports
• No significant delays expected
• Visibility: Excellent

Enter your flight number (e.g., AI-101, 6E-234) for instant status updates!`;
  }

  private getWeatherInfo(entities: any): string {
    return `🌤️ **Weather Intelligence**

🌍 **Current Conditions:**
• Delhi: 28°C, Clear skies
• Mumbai: 32°C, Partly cloudy  
• Bangalore: 24°C, Pleasant
• Chennai: 31°C, Humid

⚡ **Travel Impact:**
• No weather-related delays
• All airports operational
• Visibility: 10km+ at all major hubs

🔮 **7-Day Forecast:**
• Monsoon season approaching (June-Sept)
• Plan accordingly for western coast
• Northern plains: Hot & dry

Which destination would you like detailed weather information for?`;
  }

  private handlePriceAlert(entities: any): string {
    return `💰 **Smart Price Alerts**

🎯 **Price Drop Notifications:**
• Set alerts for specific routes
• Get notified of 20%+ price drops
• Best time to book recommendations
• Seasonal trend analysis

📈 **Current Market Trends:**
• Domestic flights: 15% cheaper than last month
• International: Prices rising due to fuel costs
• Best deals: Tuesday 3PM bookings

🔔 **Alert Options:**
• Email notifications
• SMS alerts  
• Mobile app push
• WhatsApp updates

Set up a price alert now? Just tell me your preferred route and budget!`;
  }

  private handleEmergency(): string {
    return `🚨 **Emergency Travel Support**

⚡ **Immediate Assistance Available:**

🆘 **Critical Support:**
• 24/7 emergency hotline: +91-1800-EMERGENCY
• Instant rebooking for missed connections
• Medical emergency travel arrangements
• Natural disaster travel adjustments

🏥 **Medical Emergencies:**
• Medical evacuation coordination
• Hospital network partnerships
• Insurance claim assistance
• Family notification services

🌪️ **Weather/Natural Disasters:**
• Free rebooking & cancellations
• Alternative route suggestions
• Hotel accommodation assistance
• Ground transportation arrangements

📞 **Connect Now:**
• Emergency hotline (24/7)
• Live chat with human agents
• Video call support
• WhatsApp emergency line

This is a priority channel - you'll be connected to a human agent immediately!`;
  }

  private handleAdvancedQuery(message: string, entities: any): string {
    if (message.includes('voice') || message.includes('speak')) {
      return `🎤 **Voice Commands Available!**

Say these commands:
• "Search flights from Delhi to Mumbai"
• "Check my booking status"  
• "What's the weather in Goa?"
• "Cancel my reservation"

Voice recognition supports 12 Indian languages + English!`;
    }

    if (message.includes('language') || message.includes('hindi')) {
      return `🌐 **Multi-Language Support**

Available in:
• English, Hindi, Tamil, Telugu
• Bengali, Marathi, Gujarati
• Kannada, Malayalam, Punjabi

Type "हिंदी में बात करें" for Hindi support!`;
    }

    return `🤖 **Advanced AI Assistant**

I understand complex queries and can:
• Process natural language requests
• Learn from our conversation
• Provide contextual recommendations
• Handle multiple tasks simultaneously

Try asking me something like:
"Find me a cheap flight to Goa next weekend with good weather"`;
  }

  private getContextualSuggestions(): QuickReply[] {
    return [
      { text: '🔍 Smart Search', payload: 'smart_search', icon: '🔍' },
      { text: '📊 Price Trends', payload: 'price_trends', icon: '📊' },
      { text: '🌤️ Weather Check', payload: 'weather_check', icon: '🌤️' },
      { text: '🎯 Best Deals', payload: 'best_deals', icon: '🎯' },
      { text: '📞 Human Agent', payload: 'human_agent', icon: '📞' }
    ];
  }

  setUserContext(context: Partial<UserContext>) {
    this.userContext = { ...this.userContext, ...context };
    this.contextSubject.next(this.userContext);
  }

  getUserContext(): Observable<UserContext> {
    return this.contextSubject.asObservable();
  }

  getQuickReplies(): QuickReply[] {
    return [
      { text: '✈️ Book Flight', payload: 'book_flight', icon: '✈️' },
      { text: '💳 Payment Help', payload: 'payment_help', icon: '💳' },
      { text: '❌ Cancel Booking', payload: 'cancel_booking', icon: '❌' },
      { text: '📞 Emergency', payload: 'emergency', icon: '🚨' }
    ];
  }
}