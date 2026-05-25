// ═══════════════════════════════════════════════════════
//  GROW SITES — AI SALES CHATBOT
//  Drop this file in your project root and add
//  <script src="chatbot.js"></script> before </body>
// ═══════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────
  // Where to send lead data (Vercel serverless function)
  const SUBMIT_URL = '/api/submit-lead';

  // ── STATE ───────────────────────────────────────────
  let messages = [];
  let isOpen = false;
  let isTyping = false;
  let currentStepIndex = 0;
  let leadData = {};

  // ── STYLES ──────────────────────────────────────────
  const css = `
    #gs-chat-bubble {
      position: fixed;
      bottom: max(20px, calc(env(safe-area-inset-bottom) + 12px));
      left: max(20px, calc(env(safe-area-inset-left) + 12px));
      z-index: 1000;
      font-family: 'DM Sans', system-ui, sans-serif;
    }

    #gs-chat-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--charcoal);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(42,39,36,.22);
      transition: all .4s cubic-bezier(0.16,1,0.3,1);
      position: relative;
      outline: none;
    }
    #gs-chat-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 40px rgba(42,39,36,.3);
    }
    #gs-chat-toggle .icon-chat,
    #gs-chat-toggle .icon-close {
      position: absolute;
      transition: all .3s cubic-bezier(0.16,1,0.3,1);
    }
    #gs-chat-toggle .icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(.6);
    }
    #gs-chat-toggle.open .icon-chat {
      opacity: 0;
      transform: rotate(90deg) scale(.6);
    }
    #gs-chat-toggle.open .icon-close {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    #gs-chat-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #DDBFBF;
      border: 2px solid #FAFAF8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 600;
      color: #2A2724;
      animation: gs-pulse 2s infinite;
    }
    @keyframes gs-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    #gs-chat-window {
      position: absolute;
      bottom: 68px;
      left: 0;
      width: min(380px, calc(100vw - 24px));
      height: min(580px, calc(100vh - 120px));
      background: var(--white);
      border-radius: 24px;
      box-shadow: var(--shadow-lg), 0 0 0 1px rgba(42,39,36,.06);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom left;
      transform: scale(.92) translateY(12px);
      opacity: 0;
      pointer-events: none;
      transition: all .4s cubic-bezier(0.16,1,0.3,1);
    }
    #gs-chat-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Header */
    #gs-chat-header {
      background: var(--charcoal);
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-shrink: 0;
    }
    .gs-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #B8CCE0, #C9C2D8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .gs-header-info {
      flex: 1;
    }
    .gs-header-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--white);
      line-height: 1.2;
    }
    .gs-header-status {
      font-size: 11px;
      color: var(--grey-mid);
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }
    .gs-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #BDD4C4;
    }

    /* Progress */
    #gs-progress-bar {
      height: 3px;
      background: var(--beige);
      flex-shrink: 0;
    }
    #gs-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #B8CCE0, #C9C2D8);
      transition: width .6s cubic-bezier(0.16,1,0.3,1);
      width: 0%;
    }
    #gs-step-label {
      padding: 6px 20px;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--grey-mid);
      background: var(--off-white);
      border-bottom: 1px solid var(--beige);
      flex-shrink: 0;
    }

    /* Messages */
    #gs-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    #gs-messages::-webkit-scrollbar { width: 4px; }
    #gs-messages::-webkit-scrollbar-track { background: transparent; }
    #gs-messages::-webkit-scrollbar-thumb { background: var(--grey-light); border-radius: 4px; }

    .gs-msg {
      display: flex;
      gap: 8px;
      animation: gs-msgIn .35s cubic-bezier(0.16,1,0.3,1);
    }
    @keyframes gs-msgIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .gs-msg.user { flex-direction: row-reverse; }

    .gs-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #B8CCE0, #C9C2D8);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      margin-top: auto;
    }
    .gs-msg.user .gs-msg-avatar {
      background: linear-gradient(135deg, #EDE9E1, #D6D0C8);
    }

    .gs-bubble {
      max-width: 78%;
      padding: 11px 14px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.55;
      color: var(--charcoal);
    }
    .gs-msg.bot .gs-bubble {
      background: var(--off-white);
      border: 1px solid var(--beige);
      border-bottom-left-radius: 6px;
    }
    .gs-msg.user .gs-bubble {
      background: var(--charcoal);
      color: var(--white);
      border-bottom-right-radius: 6px;
    }

    /* Typing */
    .gs-typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 14px 16px;
    }
    .gs-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A8A29A;
      animation: gs-bounce .9s infinite;
    }
    .gs-typing span:nth-child(2) { animation-delay: .15s; }
    .gs-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes gs-bounce {
      0%,100% { transform: translateY(0); opacity: .5; }
      50%      { transform: translateY(-5px); opacity: 1; }
    }

    /* Quick Replies */
    #gs-quick-replies {
      padding: 0 16px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      flex-shrink: 0;
    }
    .gs-qr {
      padding: 8px 14px;
      border-radius: 100px;
      border: 1.5px solid var(--grey-light);
      background: var(--white);
      font-size: 12.5px;
      color: var(--charcoal);
      cursor: pointer;
      transition: all .25s ease;
      font-family: 'DM Sans', system-ui, sans-serif;
      white-space: nowrap;
    }
    .gs-qr:hover {
      border-color: var(--charcoal);
      background: var(--charcoal);
      color: var(--white);
      transform: translateY(-1px);
    }

    /* Input */
    #gs-input-area {
      padding: 12px 16px;
      border-top: 1px solid var(--beige);
      display: flex;
      gap: 10px;
      align-items: flex-end;
      flex-shrink: 0;
      background: var(--white);
    }
    #gs-input {
      flex: 1;
      padding: 10px 14px;
      border: 1.5px solid var(--beige);
      border-radius: 12px;
      font-size: 13.5px;
      font-family: 'DM Sans', system-ui, sans-serif;
      color: var(--charcoal);
      background: var(--off-white);
      resize: none;
      outline: none;
      transition: border-color .25s ease;
      max-height: 100px;
      line-height: 1.5;
    }
    #gs-input::placeholder { color: #A8A29A; }
    #gs-input:focus { border-color: #B8CCE0; }

    #gs-send {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--charcoal);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all .25s ease;
      outline: none;
    }
    #gs-send:hover { background: var(--black); transform: scale(1.05); }
    #gs-send:disabled { opacity: .4; cursor: not-allowed; transform: none; }

    /* Tooltip */
    #gs-tooltip {
      position: absolute;
      bottom: 68px;
      left: 0;
      background: var(--charcoal);
      color: var(--white);
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 13px;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(42,39,36,.2);
      animation: gs-tooltip-in .4s cubic-bezier(0.16,1,0.3,1) forwards, gs-tooltip-out .4s .3s cubic-bezier(0.4,0,.2,1) 3.7s forwards;
      pointer-events: none;
    }
    @keyframes gs-tooltip-in {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes gs-tooltip-out {
      from { opacity:1; transform:translateY(0); }
      to   { opacity:0; transform:translateY(8px); }
    }
    #gs-tooltip::after {
      content:'';
      position:absolute;
      bottom:-6px;
      left:18px;
      width:12px;
      height:6px;
      background:var(--charcoal);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }

    @media (max-width: 480px) {
      #gs-chat-window {
        width: calc(100vw - 40px);
        height: calc(100dvh - 100px);
        bottom: 76px;
        left: 0;
        border-radius: 24px;
        /* Slide-up animation */
        transform: translateY(100%) scale(1);
        opacity: 0;
        transition: transform .6s cubic-bezier(0.16, 1, 0.3, 1), opacity .5s ease;
      }
      #gs-chat-window.open {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      .gs-header-close { display: block; }
      #gs-input { font-size: 16px; } /* Prevents iOS auto-zoom */
      .gs-bubble { max-width: 90%; }
    }
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── HTML ────────────────────────────────────────────
  const html = `
    <div id="gs-chat-bubble">
      <div id="gs-tooltip">👋 Need help? Let's talk!</div>
      <div id="gs-chat-window" role="dialog" aria-label="Chat with Aria">
        <div id="gs-chat-header">
          <div class="gs-avatar">✨</div>
          <div class="gs-header-info">
              <div class="gs-header-name">GrowSites Assistant</div>
            <div class="gs-header-status"><span class="gs-status-dot"></span>Online now</div>
          </div>
          <div class="gs-header-close" id="gs-header-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
        <div id="gs-progress-bar"><div id="gs-progress-fill"></div></div>
        <div id="gs-step-label">Step 1 of 10</div>
        <div id="gs-messages" role="log" aria-live="polite"></div>
        <div id="gs-quick-replies"></div>
        <div id="gs-input-area">
          <textarea id="gs-input" placeholder="Type your message…" rows="1" aria-label="Message input"></textarea>
          <button id="gs-send" aria-label="Send message" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAFAF8" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
      <button id="gs-chat-toggle" aria-label="Open chat" aria-expanded="false">
        <span class="icon-chat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAFAF8" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </span>
        <span class="icon-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAF8" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </span>
        <div id="gs-chat-badge">1</div>
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // ── ELEMENTS ─────────────────────────────────────────
  const toggle    = document.getElementById('gs-chat-toggle');
  const window_   = document.getElementById('gs-chat-window');
  const msgs      = document.getElementById('gs-messages');
  const input     = document.getElementById('gs-input');
  const sendBtn   = document.getElementById('gs-send');
  const qrArea    = document.getElementById('gs-quick-replies');
  const progFill  = document.getElementById('gs-progress-fill');
  const stepLabel = document.getElementById('gs-step-label');
  const badge     = document.getElementById('gs-chat-badge');
  const headClose = document.getElementById('gs-header-close');

  // Remove tooltip after animation
  setTimeout(() => {
    const tt = document.getElementById('gs-tooltip');
    if (tt) tt.remove();
  }, 4200);

  // ── QUICK REPLY SETS ─────────────────────────────────
  const QR = {
    websiteType: ['Business', 'E-commerce', 'Portfolio', 'SaaS', 'Landing Page', 'Other'],
    goal: ['Get Leads', 'Drive Sales', 'Take Bookings', 'Build Branding'],
    features: ['Booking System', 'Payment Gateway', 'Admin Panel', 'Animations', 'Blog', 'Contact Form'],
    timeline: ['ASAP', '2–4 weeks', '1–2 months', '3+ months'],
    location: ['India 🇮🇳', 'Outside India 🌍'],
    budgetIndia: ['₹8,000 – ₹12,000', '₹12,000 – ₹20,000', '₹20,000 – ₹30,000', '₹30,000 – ₹45,000', '₹45,000+'],
    budgetWorld: ['$150 – $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000 – $5,000', '$5,000 – $8,000', '$8,000+'],
    confirm: ['Yes, looks correct! ✅', 'No, let me update something'],
    bookCall: ['Book a Call 📅', 'I\'ll reach out later'],
  };

  const CHAT_FLOW = [
    { 
      key: 'website_type', 
      question: "Hey! I’m the GrowSites AI assistant 👋\n\nI’ll ask you a few quick questions to understand your project and help you get the best solution. To start, what type of website do you need?", 
      qr: QR.websiteType 
    },
    { 
      key: 'goal', 
      question: "Nice — this sounds like a strong project. And what is the main goal of your website?", 
      qr: QR.goal 
    },
    { 
      key: 'references', 
      question: "Got it. Do you have any reference websites you like? (Or just type 'None')" 
    },
    { 
      key: 'features', 
      question: "This type of project benefits from a clean, high-converting design. What features do you need?", 
      qr: QR.features, multi: true 
    },
    { 
      key: 'timeline', 
      question: "What's your expected timeline?", 
      qr: QR.timeline 
    },
    { 
      key: 'location', 
      question: "We’ve handled similar builds before, this can turn out really well. Quick question — where are you based?", 
      qr: QR.location 
    },
    { 
      key: 'budget', 
      question: (data) => data.location === 'India 🇮🇳' 
        ? "Most clients building something solid usually fall in the ₹20,000 – ₹30,000 range. What is your target budget?" 
        : "Most clients building something solid usually fall in the $1,500 – $3,000 range. What is your target budget?", 
      qr: (data) => data.location === 'India 🇮🇳' ? QR.budgetIndia : QR.budgetWorld 
    },
    { key: 'name', question: "Almost there! What's your name?" },
    { key: 'email', question: "What's your email address?" },
    { key: 'extra_notes', question: "Anything else you'd like me to know about your project?" },
    { 
      key: 'confirm', 
      question: (data) => `Great! Here is a summary:\n\n• Type: ${data.website_type}\n• Goal: ${data.goal}\n• Budget: ${data.budget}\n• Name: ${data.name}\n• Contact: ${data.email}\n\nDoes everything look correct?`, 
      qr: QR.confirm 
    }
  ];

  // ── HELPERS ──────────────────────────────────────────
  function updateProgress() {
    const total = CHAT_FLOW.length;
    const pct = Math.min(100, Math.round((currentStepIndex / total) * 100));
    progFill.style.width = pct + '%';
    stepLabel.textContent = `Step ${Math.min(currentStepIndex + 1, total)} of ${total}`;
  }

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `gs-msg ${role}`;
    const avatarText = role === 'bot' ? '✨' : '👤';
    div.innerHTML = `
      <div class="gs-msg-avatar">${avatarText}</div>
      <div class="gs-bubble">${text.replace(/\n/g, '<br>')}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'gs-msg bot';
    div.id = 'gs-typing-indicator';
    div.innerHTML = `
      <div class="gs-msg-avatar">✨</div>
      <div class="gs-bubble gs-typing"><span></span><span></span><span></span></div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('gs-typing-indicator');
    if (t) t.remove();
  }

  function setQuickReplies(options, multi = false) {
    qrArea.innerHTML = '';
    if (!options || options.length === 0) return;
    const selected = new Set();
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'gs-qr';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (multi) {
          selected.has(opt) ? selected.delete(opt) : selected.add(opt);
          btn.style.background = selected.has(opt) ? '#2A2724' : '';
          btn.style.color = selected.has(opt) ? '#FAFAF8' : '';
          btn.style.borderColor = selected.has(opt) ? '#2A2724' : '';
        } else {
          const val = Array.from(selected).join(', ') || opt;
          sendMessage(opt);
          setQuickReplies([]);
        }
      });
      qrArea.appendChild(btn);
    });

    if (multi) {
      const doneBtn = document.createElement('button');
      doneBtn.className = 'gs-qr';
      doneBtn.textContent = '→ Done';
      doneBtn.style.background = '#2A2724';
      doneBtn.style.color = '#FAFAF8';
      doneBtn.style.borderColor = '#2A2724';
      doneBtn.addEventListener('click', () => {
        const val = selected.size > 0 ? Array.from(selected).join(', ') : 'Not sure yet';
        sendMessage(val);
        setQuickReplies([]);
      });
      qrArea.appendChild(doneBtn);
    }
  }

  // ── SUBMIT LEAD ──────────────────────────────────────
  async function submitLead(data) {
    try {
      await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, timestamp: new Date().toISOString(), source: 'chatbot' })
      });
    } catch (e) {
      console.warn('Lead submission failed (will retry):', e);
      // Save locally as fallback
      const saved = JSON.parse(localStorage.getItem('gs_pending_leads') || '[]');
      saved.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem('gs_pending_leads', JSON.stringify(saved));
    }
  }

  // ── SEND MESSAGE ─────────────────────────────────────
  async function sendMessage(text) {
    if (!text.trim() || isTyping) return;
    isTyping = true;
    sendBtn.disabled = true;
    setQuickReplies([]);

    // Show user message
    addMessage('user', text);
    messages.push({ role: 'user', text });
    input.value = '';
    input.style.height = 'auto';

    try {
      if (currentStepIndex < CHAT_FLOW.length) {
        const currentStep = CHAT_FLOW[currentStepIndex];
        leadData[currentStep.key] = text;
        currentStepIndex++;
        updateProgress();
        await new Promise(r => setTimeout(r, 300));
        showTyping();
        await new Promise(r => setTimeout(r, 600));
        hideTyping();
      }

      if (currentStepIndex < CHAT_FLOW.length) {
        const next = CHAT_FLOW[currentStepIndex];
        const qText = typeof next.question === 'function' ? next.question(leadData) : next.question;
        addMessage('bot', qText);
        
        const qrOptions = typeof next.qr === 'function' ? next.qr(leadData) : next.qr;
        setQuickReplies(qrOptions, next.multi);
      } else {
        // All steps completed
        if (text.includes('Yes')) {
          await submitLead(leadData);
          addMessage('bot', "Want to jump on a quick call and get this moving? I’ll help you with a clear plan.");
          setTimeout(() => setQuickReplies(QR.bookCall), 600);
        } else if (text.includes('No')) {
          addMessage('bot', "No problem! Let's start over to make sure we get it right.");
          setTimeout(() => {
            currentStepIndex = 0;
            leadData = {};
            messages = [];
            msgs.innerHTML = '';
            initChat();
          }, 1000);
        }

        // Handle book call
        if (text === 'Book a Call 📅') {
          window.location.href = 'contact.html';
        }
      }
    } catch (e) {
      addMessage('bot', "I apologize, I encountered a temporary issue. Could you please try again?");
    }

    isTyping = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── INIT ─────────────────────────────────────────────
  async function initChat() {
    currentStepIndex = 0;
    updateProgress();
    showTyping();
    await new Promise(r => setTimeout(r, 900));
    hideTyping();
    const firstStep = CHAT_FLOW[0];
    addMessage('bot', firstStep.question);
    setTimeout(() => setQuickReplies(firstStep.qr), 400);
  }

  // ── EVENTS ───────────────────────────────────────────
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    window_.classList.toggle('open', isOpen);
    badge.style.display = 'none';

    if (isOpen && messages.length === 0) {
      setTimeout(initChat, 300);
    }
    if (isOpen) setTimeout(() => input.focus(), 500);
  });

  // Swipe down to close on mobile
  let touchStartY = 0;
  window_.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  window_.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].screenY;
    // If swipe down is more than 50px and chat is open
    if (touchEndY - touchStartY > 50 && isOpen) toggle.click();
  }, { passive: true });

  // Mobile Header Close
  headClose.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.click();
  });

  // Global function to trigger chat from anywhere
  window.openGrowChat = () => {
    if (!isOpen) {
      toggle.click();
    } else {
      window_.classList.add('open');
    }
    const target = document.getElementById('gs-chat-bubble');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim() || isTyping;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage(input.value.trim());
    }
  });

  sendBtn.addEventListener('click', () => sendMessage(input.value.trim()));

  // Show badge after 3s if not opened
  setTimeout(() => {
    if (!isOpen) badge.style.display = 'flex';
  }, 3000);

})();