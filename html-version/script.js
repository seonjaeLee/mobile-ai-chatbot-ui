// ═══════════════════════════════════════════════════════════════════════════
// 상태 관리
// ═══════════════════════════════════════════════════════════════════════════

const state = {
  currentScreen: 'home', // 'home' | 'chat'
  isISA: false,
  chatStage: 0,
  messages: [],
  selectedPrice: null,
  priceConfirmed: false,
  orderExecuted: false,
};

// ─────────────────────────────────────────────────────────────────────────
// 데이터
// ─────────────────────────────────────────────────────────────────────────

const STOCK = { name: '삼성전자', code: '005930', market: 'KOSPi' };
const BASE_PRICE = 192600;
const ORDER_BOOK = [
  { price: 192800, diff: +200 },
  { price: 192700, diff: +100 },
  { price: 192600, diff: 0 },
  { price: 192500, diff: -100 },
  { price: 192400, diff: -200 },
];
const QTY = 15;
const ORDER_NO = 'B20260627-0381';
const ORDER_TIME = '14:32:05';

const INTRO_TEXT = '삼성전자 1주당 매수 가격을 선택하거나 입력해 주세요.';
const CONFIRM_INTRO = `아래 내용과 같이 삼성전자 ${QTY}주 매수 접수 할게요. 확인 후 주문을 실행해 주세요. 주문 실행 시 정정·취소가 제한될 수 있어요.`;
const DONE_TEXT = '매수 주문이 정상 접수되었어요. 체결 여부는 거래내역에서 확인할 수 있어요. 체결되면 알림으로 알려드릴게요.';

const ISA_TEXT = 'ISA(개인종합자산관리계좌)는 예금·펀드·ETF를 한 계좌에 담아 비과세 혜택을 받는 절세 계좌예요.';
const ISA_CHIPS = ['가입 자격 확인', '납입 한도 조회', '계좌 개설하기'];

// ─────────────────────────────────────────────────────────────────────────
// DOM 요소
// ─────────────────────────────────────────────────────────────────────────

const homeScreen = document.getElementById('homeScreen');
const chatScreen = document.getElementById('chatScreen');
const homeInput = document.getElementById('homeInput');
const chatInput = document.getElementById('chatInput');
const homeSendBtn = document.getElementById('homeSendBtn');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatScroll = document.getElementById('chatScroll');
const chatHeader = document.getElementById('chatHeader');
const closeBtn = document.getElementById('closeBtn');
const menuTrigger = document.getElementById('menuTrigger');

// ═══════════════════════════════════════════════════════════════════════════
// 화면 전환
// ═══════════════════════════════════════════════════════════════════════════

function switchToChat(question) {
  state.currentScreen = 'chat';
  state.isISA = question.includes('ISA');
  state.chatStage = 0;
  state.messages = [];
  state.selectedPrice = null;
  state.priceConfirmed = false;
  state.orderExecuted = false;

  homeScreen.classList.remove('active');
  chatScreen.classList.add('active');
  chatHeader.classList.remove('hidden');

  chatScroll.innerHTML = '';
  chatInput.value = '';

  // AI 첫 메시지 타이핑 시뮬레이션
  setTimeout(() => {
    addMessage('ai', getInitialAIText());
    state.chatStage = 1;
  }, 900);
}

function switchToHome() {
  state.currentScreen = 'home';
  chatScreen.classList.remove('active');
  homeScreen.classList.add('active');
  chatHeader.classList.add('hidden');
  homeInput.value = '';
}

// ═══════════════════════════════════════════════════════════════════════════
// 메시지 관리
// ═══════════════════════════════════════════════════════════════════════════

function addMessage(type, content) {
  const message = document.createElement('div');
  message.className = `message ${type}`;

  if (type === 'ai') {
    message.innerHTML = `
      <div class="message-avatar">⭐</div>
      <div class="message-bubble">${content}</div>
    `;
  } else {
    message.innerHTML = `
      <div class="message-bubble">${content}</div>
    `;
  }

  chatScroll.appendChild(message);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function getInitialAIText() {
  if (state.isISA) {
    return 'ISA 관련 정보를 알려드릴게요. 잠시만 기다려주세요.';
  }
  return INTRO_TEXT;
}

function addTypingIndicator() {
  const message = document.createElement('div');
  message.className = 'message ai';
  message.id = 'typingIndicator';
  message.innerHTML = `
    <div class="message-avatar">⭐</div>
    <div class="typing-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  chatScroll.appendChild(message);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

// ═══════════════════════════════════════════════════════════════════════════
// 사용자 입력 처리
// ═══════════════════════════════════════════════════════════════════════════

function handleHomeInput() {
  const text = homeInput.value.trim();
  if (!text) return;

  switchToChat(text);
  addMessage('user', text);
}

function handleChatInput() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  addMessage('user', text);
  addTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    handleChatFlow(text);
  }, 1500);
}

function handleChatFlow(userMessage) {
  // 간단한 플로우 (실제로는 더 복잡)
  if (state.isISA) {
    addMessage('ai', ISA_TEXT);
    renderISAChips();
  } else {
    // 매수 플로우
    if (!state.priceConfirmed) {
      if (state.chatStage === 1) {
        renderOrderBook();
        state.chatStage = 2;
      }
    } else if (!state.orderExecuted) {
      addMessage('ai', CONFIRM_INTRO);
      renderOrderConfirmCard();
      state.chatStage = 4;
    } else {
      addMessage('ai', DONE_TEXT);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UI 렌더링
// ═══════════════════════════════════════════════════════════════════════════

function renderOrderBook() {
  const card = document.createElement('div');
  card.className = 'order-book-card';
  card.innerHTML = `
    <div style="padding: 1rem">
      <p style="font-weight: 600; margin-bottom: 0.5rem">${STOCK.name} ${STOCK.code} · ${STOCK.market}</p>
      <p style="font-size: 1.5rem; color: #e63946; font-weight: 700; margin-bottom: 0.25rem">
        ${BASE_PRICE.toLocaleString()}원 ▲14,200 (+7.96%)
      </p>
      <div style="border-top: 1px solid #eee; margin: 1rem 0"></div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem; margin-bottom: 1rem">
        ${ORDER_BOOK.map(({ price, diff }) => `
          <button class="order-price-btn" data-price="${price}" onclick="selectPrice(${price})">
            <div>${price.toLocaleString()}</div>
            <div style="font-size: 0.8rem; color: ${diff > 0 ? '#e63946' : diff < 0 ? '#0066ff' : '#999'}">
              ${diff > 0 ? '▲' : diff < 0 ? '▼' : ''}${Math.abs(diff)}
            </div>
          </button>
        `).join('')}
      </div>

      <button class="price-select-btn" onclick="confirmPrice()">매수·가격 선택</button>
    </div>
  `;
  chatScroll.appendChild(card);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function selectPrice(price) {
  state.selectedPrice = price;
  const buttons = document.querySelectorAll('.order-price-btn');
  buttons.forEach(btn => {
    btn.style.background = btn.dataset.price == price ? '#f0f0f0' : 'transparent';
  });
}

function confirmPrice() {
  if (!state.selectedPrice) return;
  state.priceConfirmed = true;
  addMessage('user', `${state.selectedPrice.toLocaleString()}원`);
  addTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    handleChatFlow();
  }, 1500);
}

function renderOrderConfirmCard() {
  const card = document.createElement('div');
  card.className = 'confirm-card';
  card.innerHTML = `
    <div style="padding: 2rem; text-align: center">
      <div style="font-size: 3rem; margin-bottom: 1rem">✓</div>
      <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 2rem">주문 접수 완료</h3>
      
      <table style="width: 100%; margin-bottom: 2rem; border-collapse: collapse">
        <tr>
          <td style="text-align: left; padding: 0.5rem 0; border-bottom: 1px solid #eee">종목</td>
          <td style="text-align: right; padding: 0.5rem 0; border-bottom: 1px solid #eee; font-weight: 600">${STOCK.name}</td>
        </tr>
        <tr>
          <td style="text-align: left; padding: 0.5rem 0; border-bottom: 1px solid #eee">구분</td>
          <td style="text-align: right; padding: 0.5rem 0; border-bottom: 1px solid #eee; color: #e63946; font-weight: 600">매수·지정가</td>
        </tr>
        <tr>
          <td style="text-align: left; padding: 0.5rem 0; border-bottom: 1px solid #eee">주문 수량</td>
          <td style="text-align: right; padding: 0.5rem 0; border-bottom: 1px solid #eee; font-weight: 600">${QTY}주</td>
        </tr>
        <tr>
          <td style="text-align: left; padding: 0.5rem 0; border-bottom: 1px solid #eee">주문 가격</td>
          <td style="text-align: right; padding: 0.5rem 0; border-bottom: 1px solid #eee; font-weight: 600">${state.selectedPrice.toLocaleString()}원</td>
        </tr>
        <tr>
          <td style="text-align: left; padding: 0.5rem 0">총 주문금액</td>
          <td style="text-align: right; padding: 0.5rem 0; font-weight: 700; color: #e63946; font-size: 1.1rem">${(state.selectedPrice * QTY).toLocaleString()}원</td>
        </tr>
      </table>

      <button class="execute-btn" onclick="executeOrder()">매수금액선택완료</button>
    </div>
  `;
  chatScroll.appendChild(card);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function executeOrder() {
  state.orderExecuted = true;
  addMessage('user', '확인했습니다.');
  addTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    addMessage('ai', DONE_TEXT);
  }, 1500);
}

function renderISAChips() {
  const message = document.createElement('div');
  message.className = 'message ai';
  message.innerHTML = `
    <div class="chips-group">
      ${ISA_CHIPS.map(chip => `<button class="chip">${chip}</button>`).join('')}
    </div>
  `;
  chatScroll.appendChild(message);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

// ═══════════════════════════════════════════════════════════════════════════
// 이벤트 리스너
// ═══════════════════════════════════════════════════════════════════════════

homeSendBtn.addEventListener('click', handleHomeInput);
chatSendBtn.addEventListener('click', handleChatInput);
closeBtn.addEventListener('click', switchToHome);

homeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault();
    handleHomeInput();
  }
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault();
    handleChatInput();
  }
});

// 스크롤 효과 (헤더 블러)
chatScroll.addEventListener('scroll', () => {
  const scrolled = chatScroll.scrollTop > 8;
  if (scrolled) {
    chatHeader.classList.add('scrolled');
  } else {
    chatHeader.classList.remove('scrolled');
  }
});
