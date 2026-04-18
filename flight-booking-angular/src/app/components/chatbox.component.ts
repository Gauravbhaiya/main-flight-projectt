import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService, ChatMessage, QuickReply, ChatAction } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbox',
  template: `
    <div class="chatbox-container" [class.open]="isOpen">
      <!-- Enhanced Chat Toggle Button -->
      <button class="chat-toggle" (click)="toggleChat()" [class.has-notification]="hasNewMessage" [class.pulsing]="isTyping">
        <div class="toggle-content">
          <span class="chat-icon" *ngIf="!isOpen">🤖</span>
          <span class="close-icon" *ngIf="isOpen">✕</span>
          <div class="ai-indicator" *ngIf="!isOpen">AI</div>
        </div>
        <div class="notification-dot" *ngIf="hasNewMessage && !isOpen"></div>
        <div class="power-ring"></div>
      </button>

      <!-- Super-Powered Chat Window -->
      <div class="chat-window" *ngIf="isOpen">
        <!-- Enhanced Header -->
        <div class="chat-header">
          <div class="bot-info">
            <div class="bot-avatar">
              <div class="avatar-inner">🤖</div>
              <div class="status-ring" [class.active]="isOnline"></div>
            </div>
            <div class="bot-details">
              <h4>FlightHub AI Assistant</h4>
              <span class="status">
                <span class="status-dot" [class.online]="isOnline"></span>
                {{isOnline ? 'Online • AI Powered' : 'Connecting...'}}
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button class="voice-btn" (click)="toggleVoice()" [class.active]="voiceEnabled" title="Voice Commands">
              🎤
            </button>
            <button class="settings-btn" (click)="openSettings()" title="Settings">
              ⚙️
            </button>
          </div>
        </div>

        <!-- Advanced Messages Container -->
        <div class="chat-messages" #messagesContainer>
          <div *ngFor="let message of messages; trackBy: trackMessage" 
               class="message" 
               [class.user]="message.sender === 'user'" 
               [class.bot]="message.sender === 'bot'"
               [class.has-actions]="message.actions?.length">
            
            <div class="message-content">
              <!-- Message Text -->
              <div class="message-text" [innerHTML]="formatMessage(message.message)"></div>
              
              <!-- Quick Replies -->
              <div class="quick-replies" *ngIf="message.quickReplies?.length">
                <button *ngFor="let reply of message.quickReplies" 
                        class="quick-reply-btn"
                        (click)="handleQuickReply(reply)">
                  <span class="reply-icon" *ngIf="reply.icon">{{reply.icon}}</span>
                  {{reply.text}}
                </button>
              </div>
              
              <!-- Action Buttons -->
              <div class="action-buttons" *ngIf="message.actions?.length">
                <button *ngFor="let action of message.actions" 
                        class="action-btn"
                        [class]="'action-' + action.type"
                        (click)="handleAction(action)">
                  <span class="action-icon" *ngIf="action.icon">{{action.icon}}</span>
                  {{action.label}}
                </button>
              </div>
              
              <div class="message-time">{{formatTime(message.timestamp)}}</div>
            </div>
          </div>
          
          <!-- Enhanced Typing Indicator -->
          <div *ngIf="isTyping" class="message bot typing">
            <div class="message-content">
              <div class="typing-indicator">
                <div class="ai-thinking">
                  <span class="brain-icon">🧠</span>
                  <div class="thinking-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div class="typing-text">AI is analyzing your request...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Smart Input Section -->
        <div class="chat-input-section">
          <!-- Smart Suggestions -->
          <div class="smart-suggestions" *ngIf="smartSuggestions.length && !currentMessage">
            <div class="suggestions-header">💡 Try asking:</div>
            <div class="suggestion-chips">
              <button *ngFor="let suggestion of smartSuggestions" 
                      class="suggestion-chip"
                      (click)="selectSuggestion(suggestion)">
                {{suggestion}}
              </button>
            </div>
          </div>

          <!-- Enhanced Input -->
          <div class="chat-input">
            <div class="input-wrapper">
              <button class="attachment-btn" (click)="handleAttachment()" title="Attach file">
                📎
              </button>
              <input 
                type="text" 
                [(ngModel)]="currentMessage" 
                (keyup.enter)="sendMessage()"
                (input)="onInputChange()"
                placeholder="Type your message or try voice commands..."
                class="message-input"
                [disabled]="isTyping"
                #messageInput>
              <button class="emoji-btn" (click)="toggleEmoji()" title="Emojis">
                😊
              </button>
            </div>
            <button (click)="sendMessage()" 
                    [disabled]="!currentMessage.trim() || isTyping" 
                    class="send-btn"
                    [class.voice-mode]="voiceEnabled">
              <span *ngIf="!isTyping && !voiceEnabled">🚀</span>
              <span *ngIf="!isTyping && voiceEnabled">🎤</span>
              <div *ngIf="isTyping" class="loading-spinner"></div>
            </button>
          </div>

          <!-- Voice Recognition Indicator -->
          <div class="voice-indicator" *ngIf="isListening">
            <div class="voice-animation">
              <div class="voice-wave"></div>
              <div class="voice-wave"></div>
              <div class="voice-wave"></div>
            </div>
            <span>Listening... Speak now</span>
          </div>
        </div>
      </div>

      <!-- Power Indicator -->
      <div class="power-indicator" [class.active]="isOpen">
        <div class="power-level" [style.width.%]="aiPowerLevel"></div>
      </div>
    </div>
  `,
  styles: [`
    .chatbox-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: 'Inter', sans-serif;
    }

    .chat-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      color: white;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .chat-toggle::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
      border-radius: 50%;
      z-index: -1;
      animation: rainbow 3s linear infinite;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .chat-toggle:hover::before {
      opacity: 1;
    }

    .chat-toggle:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
    }

    .chat-toggle.pulsing {
      animation: aiPulse 2s infinite;
    }

    .toggle-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .chat-icon, .close-icon {
      font-size: 28px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .ai-indicator {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .power-ring {
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border: 2px solid transparent;
      border-radius: 50%;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4) border-box;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      animation: rotate 4s linear infinite;
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 16px;
      height: 16px;
      background: linear-gradient(45deg, #ff4444, #ff6b6b);
      border-radius: 50%;
      border: 3px solid white;
      animation: bounce 1s infinite;
      box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
    }

    .chat-window {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 320px;
      height: 480px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(102, 126, 234, 0.1);
    }

    .chat-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .chat-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="30" cy="5" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="15" r="1" fill="white" opacity="0.1"/><circle cx="70" cy="8" r="1" fill="white" opacity="0.1"/><circle cx="90" cy="12" r="1" fill="white" opacity="0.1"/></svg>');
    }

    .bot-info {
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 2;
    }

    .bot-avatar {
      position: relative;
      width: 40px;
      height: 40px;
    }

    .avatar-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255,255,255,0.3);
    }

    .status-ring {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid transparent;
      border-radius: 50%;
      background: linear-gradient(45deg, #4ecdc4, #44a08d) border-box;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .status-ring.active {
      opacity: 1;
      animation: pulse 2s infinite;
    }

    .bot-details h4 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .status {
      font-size: 11px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ffd93d;
      animation: blink 2s infinite;
    }

    .status-dot.online {
      background: #4ecdc4;
      animation: none;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      z-index: 2;
    }

    .voice-btn, .settings-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      backdrop-filter: blur(10px);
    }

    .voice-btn:hover, .settings-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: scale(1.1);
    }

    .voice-btn.active {
      background: #4ecdc4;
      box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
    }

    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .message {
      display: flex;
      animation: messageSlide 0.4s ease-out;
      max-width: 85%;
    }

    .message.user {
      justify-content: flex-end;
      margin-left: auto;
    }

    .message.bot {
      justify-content: flex-start;
    }

    .message-content {
      padding: 12px 16px;
      border-radius: 16px;
      position: relative;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    .message.user .message-content {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-bottom-right-radius: 8px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .message.bot .message-content {
      background: rgba(255,255,255,0.95);
      color: #2d3748;
      border: 1px solid rgba(255,255,255,0.2);
      border-bottom-left-radius: 8px;
    }

    .message-text {
      font-size: 14px;
      line-height: 1.4;
      margin-bottom: 6px;
      white-space: pre-line;
    }

    .quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .quick-reply-btn {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.3);
      color: #667eea;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .quick-reply-btn:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }

    .action-btn {
      background: linear-gradient(135deg, #4ecdc4, #44a08d);
      border: none;
      color: white;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
    }

    .action-btn.action-call {
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    }

    .action-btn.action-email {
      background: linear-gradient(135deg, #4ecdc4, #44a08d);
    }

    .typing-indicator {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }

    .ai-thinking {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brain-icon {
      font-size: 20px;
      animation: brainPulse 1.5s infinite;
    }

    .thinking-dots {
      display: flex;
      gap: 4px;
    }

    .thinking-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #667eea;
      animation: thinking 1.4s infinite ease-in-out;
    }

    .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
    .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

    .typing-text {
      font-size: 12px;
      color: #667eea;
      font-weight: 500;
    }

    .chat-input-section {
      background: white;
      border-top: 1px solid rgba(0,0,0,0.1);
      padding: 16px;
    }

    .smart-suggestions {
      margin-bottom: 16px;
    }

    .suggestions-header {
      font-size: 12px;
      color: #667eea;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .suggestion-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .suggestion-chip {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      color: #667eea;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .suggestion-chip:hover {
      background: #667eea;
      color: white;
    }

    .chat-input {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 25px;
      padding: 4px;
      transition: all 0.3s ease;
    }

    .input-wrapper:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .attachment-btn, .emoji-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .attachment-btn:hover, .emoji-btn:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .message-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 8px;
      font-size: 14px;
      background: transparent;
      color: #2d3748;
    }

    .message-input::placeholder {
      color: #a0aec0;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      color: white;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 3px 15px rgba(102, 126, 234, 0.3);
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
    }

    .send-btn.voice-mode {
      background: linear-gradient(135deg, #4ecdc4, #44a08d);
      animation: voicePulse 2s infinite;
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .voice-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(78, 205, 196, 0.1);
      border-radius: 12px;
      margin-top: 12px;
      color: #4ecdc4;
      font-weight: 600;
    }

    .voice-animation {
      display: flex;
      gap: 3px;
    }

    .voice-wave {
      width: 4px;
      height: 20px;
      background: #4ecdc4;
      border-radius: 2px;
      animation: voiceWave 1s infinite ease-in-out;
    }

    .voice-wave:nth-child(1) { animation-delay: -0.4s; }
    .voice-wave:nth-child(2) { animation-delay: -0.2s; }
    .voice-wave:nth-child(3) { animation-delay: 0s; }

    .power-indicator {
      position: absolute;
      bottom: -5px;
      left: 10px;
      right: 10px;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .power-indicator.active {
      opacity: 1;
    }

    .power-level {
      height: 100%;
      background: linear-gradient(90deg, #4ecdc4, #44a08d, #667eea);
      border-radius: 2px;
      transition: width 0.5s ease;
      animation: powerFlow 2s infinite;
    }

    /* Scrollbar */
    .chat-messages::-webkit-scrollbar {
      width: 8px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px;
    }

    /* Animations */
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes messageSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes aiPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6); }
    }

    @keyframes rainbow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-6px) scale(1.1); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes thinking {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }

    @keyframes brainPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @keyframes voicePulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(78, 205, 196, 0.4); }
      50% { box-shadow: 0 8px 30px rgba(78, 205, 196, 0.8); }
    }

    @keyframes voiceWave {
      0%, 100% { height: 20px; }
      50% { height: 35px; }
    }

    @keyframes powerFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .chatbox-container {
        bottom: 15px;
        right: 15px;
      }

      .chat-window {
        width: 300px;
        height: 450px;
        bottom: 70px;
      }

      .chat-toggle {
        width: 52px;
        height: 52px;
      }
    }

    @media (max-width: 480px) {
      .chat-window {
        width: calc(100vw - 30px);
        right: -15px;
        height: 400px;
      }

      .chat-messages {
        padding: 12px;
      }

      .chat-input-section {
        padding: 12px;
      }
    }
  `]
})
export class ChatboxComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  hasNewMessage = false;
  isOnline = true;
  voiceEnabled = false;
  isListening = false;
  aiPowerLevel = 95;

  smartSuggestions = [
    "Hi there! How are you?",
    "Tell me a travel joke",
    "Find flights to Goa this weekend",
    "What's the weather in Mumbai?",
    "Show me your best deals",
    "Help me plan a trip"
  ];

  conversationStarters = [
    "Hello! 👋",
    "How are you doing? 😊",
    "Tell me something interesting! ✨",
    "I'm bored, entertain me! 🎭",
    "What can you do? 🤖",
    "Surprise me! 🎉"
  ];

  private recognition: any;
  private shouldScrollToBottom = false;

  constructor(private chatbotService: ChatbotService) {
    this.initializeVoiceRecognition();
  }

  ngOnInit() {
    // Enhanced welcome message
    setTimeout(() => {
      this.addAdvancedWelcomeMessage();
      this.hasNewMessage = true;
    }, 1500);

    // Simulate AI power level updates
    setInterval(() => {
      this.aiPowerLevel = Math.max(85, Math.min(100, this.aiPowerLevel + (Math.random() - 0.5) * 10));
    }, 3000);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasNewMessage = false;
      setTimeout(() => this.messageInput?.nativeElement?.focus(), 100);
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isTyping) return;

    this.addUserMessage(this.currentMessage);
    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;

    // Enhanced response with context and conversation memory
    setTimeout(() => {
      this.chatbotService.sendMessage(userMessage, { 
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        location: 'dashboard',
        conversationHistory: this.messages.slice(-5), // Last 5 messages for context
        userPreferences: this.getUserPreferences()
      }).subscribe(response => {
        this.isTyping = false;
        this.messages.push(response);
        this.shouldScrollToBottom = true;
        
        // Update smart suggestions based on response
        this.updateSmartSuggestions(response);
        
        // Show notification if chat is closed
        if (!this.isOpen) {
          this.hasNewMessage = true;
        }
      });
    }, Math.random() * 1200 + 600); // More realistic response time
  }

  addUserMessage(message: string) {
    this.messages.push({
      id: Date.now().toString(),
      message,
      sender: 'user',
      timestamp: new Date()
    });
    this.shouldScrollToBottom = true;
  }

  addAdvancedWelcomeMessage() {
    const welcomeMessages = [
      {
        message: `👋 **Hey there, amazing human!**

I'm your super-friendly FlightHub AI assistant! I'm not just here for bookings - I love chatting too!

🌟 **What makes me special:**
• I understand casual conversation (try saying "hi" or "how are you?")
• I can tell jokes and share fun travel facts
• I remember our conversation context
• I'm great at finding flight deals AND being good company!

💬 **Feel free to:**
• Chat casually - I love getting to know you!
• Ask for travel help - that's my specialty!
• Request jokes or fun facts - I'm entertaining!
• Use voice commands - I speak your language!

So... how's your day going? 😊`,
        quickReplies: [
          { text: '👋 Hi! How are you?', payload: 'casual_greeting', icon: '👋' },
          { text: '✈️ Find Flights', payload: 'find_flights', icon: '✈️' },
          { text: '😂 Tell me a joke!', payload: 'tell_joke', icon: '😂' },
          { text: '🤖 What can you do?', payload: 'capabilities', icon: '🤖' }
        ]
      },
      {
        message: `✨ **Welcome to FlightHub's Smart AI!**

I'm more than just a booking bot - I'm your travel buddy with personality!

🧠 **My Superpowers:**
• Natural conversation (I understand "hlw", "hii", casual typos!)
• Smart flight recommendations with AI magic
• Real-time price tracking & weather updates
• Fun travel facts, jokes, and stories
• Voice recognition in multiple languages

🎉 **I'm designed to be:**
• Helpful with your travel needs
• Fun to chat with during boring moments
• Smart enough to understand what you really mean
• Always learning from our conversations

What's on your mind today? 💭`,
        quickReplies: [
          { text: '💬 Let\'s chat!', payload: 'lets_chat', icon: '💬' },
          { text: '🎯 Show me deals', payload: 'show_deals', icon: '🎯' },
          { text: '🌤️ Weather check', payload: 'weather_check', icon: '🌤️' },
          { text: '🎲 Surprise me!', payload: 'surprise_me', icon: '🎲' }
        ]
      }
    ];
    
    const selectedWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    const welcomeMessage: ChatMessage = {
      id: 'welcome-' + Date.now(),
      message: selectedWelcome.message,
      sender: 'bot',
      timestamp: new Date(),
      type: 'quick-reply',
      quickReplies: selectedWelcome.quickReplies
    };
    
    this.messages.push(welcomeMessage);
    this.shouldScrollToBottom = true;
  }

  handleQuickReply(reply: QuickReply) {
    // Enhanced quick reply handling with better UX
    this.currentMessage = reply.text;
    
    // Add visual feedback
    const replyBtn = event?.target as HTMLElement;
    if (replyBtn) {
      replyBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        replyBtn.style.transform = 'scale(1)';
      }, 150);
    }
    
    // Send message with slight delay for better UX
    setTimeout(() => {
      this.sendMessage();
    }, 200);
  }

  handleAction(action: ChatAction) {
    switch (action.type) {
      case 'call':
        window.open(`tel:${action.data}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${action.data}`, '_blank');
        break;
      case 'redirect':
        if (action.data.startsWith('http')) {
          window.open(action.data, '_blank');
        } else {
          // Handle internal routing
          console.log('Navigate to:', action.data);
        }
        break;
      case 'search':
        this.addUserMessage('Search flights');
        this.sendMessage();
        break;
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (this.voiceEnabled && this.recognition) {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.currentMessage = transcript;
        this.sendMessage();
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };
    }
  }

  startListening() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  onInputChange() {
    // Update suggestions based on input
    if (this.currentMessage.length === 0) {
      this.smartSuggestions = this.conversationStarters;
    } else if (this.currentMessage.length > 2) {
      const input = this.currentMessage.toLowerCase();
      
      // Smart contextual suggestions
      if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
        this.smartSuggestions = [
          "How are you doing today?",
          "Tell me about yourself",
          "What can you help me with?",
          "I need flight assistance"
        ];
      } else if (input.includes('joke') || input.includes('fun') || input.includes('laugh')) {
        this.smartSuggestions = [
          "Tell me a travel joke",
          "Share a fun fact",
          "Entertain me with a story",
          "Make me laugh!"
        ];
      } else if (input.includes('flight') || input.includes('book') || input.includes('travel')) {
        this.smartSuggestions = [
          `Search flights to ${this.currentMessage}`,
          `Best deals for ${this.currentMessage}`,
          `Weather in ${this.currentMessage}`,
          "Show me flight options"
        ];
      } else {
        this.smartSuggestions = [
          "Tell me more about that",
          "That's interesting!",
          "How can I help with that?",
          "Let's talk about travel"
        ];
      }
    }
  }

  selectSuggestion(suggestion: string) {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  updateSmartSuggestions(response: ChatMessage) {
    // Update suggestions based on bot response context
    const intent = response.metadata?.intent;
    
    switch (intent) {
      case 'greeting':
        this.smartSuggestions = [
          "I'm doing great, thanks!",
          "Tell me about your AI features",
          "Help me find flights",
          "What's new in travel?"
        ];
        break;
        
      case 'casual_chat':
        this.smartSuggestions = [
          "That's awesome!",
          "Tell me more",
          "What else can you do?",
          "Let's book a flight"
        ];
        break;
        
      case 'fun_chat':
        this.smartSuggestions = [
          "That's hilarious! 😂",
          "Tell me another one!",
          "Share a travel fact",
          "Now let's get serious about flights"
        ];
        break;
        
      case 'flight_search':
        this.smartSuggestions = [
          "Show me business class options",
          "What about next week?",
          "Compare prices with other airlines",
          "Check the weather there"
        ];
        break;
        
      case 'compliments':
        this.smartSuggestions = [
          "You're welcome!",
          "What's next?",
          "Help me plan a trip",
          "Show me special offers"
        ];
        break;
        
      default:
        this.smartSuggestions = [
          "That's interesting!",
          "Tell me more",
          "How can I help?",
          "Let's talk about travel"
        ];
    }
  }

  handleAttachment() {
    // Handle file attachments
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.addUserMessage(`📎 Attached: ${file.name}`);
        // Process file attachment
      }
    };
    input.click();
  }

  toggleEmoji() {
    // Enhanced emoji picker with travel-themed emojis
    const emojiCategories = {
      travel: ['✈️', '🌍', '🏖️', '🏝️', '🏨', '💼', '🎅'],
      emotions: ['😊', '😂', '😍', '🤩', '😎', '😄', '👍'],
      celebration: ['🎉', '🎆', '✨', '🌟', '🔥', '💫', '❤️'],
      weather: ['☀️', '⛅', '🌧️', '❄️', '🌈', '🌤️', '🌊']
    };
    
    const allEmojis = Object.values(emojiCategories).flat();
    const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    this.currentMessage += randomEmoji;
    this.messageInput.nativeElement.focus();
  }

  openSettings() {
    // Open settings modal
    console.log('Opening settings...');
  }

  formatMessage(message: string): string {
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/•/g, '&bull;')
      .replace(/:😊:/g, '😊')
      .replace(/:😂:/g, '😂')
      .replace(/:✈️:/g, '✈️')
      .replace(/:❤️:/g, '❤️');
  }
  
  getUserPreferences(): any {
    // Extract user preferences from conversation history
    const preferences = {
      preferredDestinations: [],
      conversationStyle: 'casual',
      interests: ['travel'],
      responseLength: 'medium'
    };
    
    // Analyze recent messages for preferences
    const recentMessages = this.messages.slice(-10);
    recentMessages.forEach(msg => {
      if (msg.sender === 'user') {
        const text = msg.message.toLowerCase();
        if (text.includes('joke') || text.includes('fun')) {
          preferences.interests.push('humor');
        }
        if (text.includes('quick') || text.includes('short')) {
          preferences.responseLength = 'short';
        }
      }
    });
    
    return preferences;
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  trackMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  scrollToBottom() {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}