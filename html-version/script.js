// ═══════════════════════════════════════════════════════════════════════════
// 삼성증권 mPOP AI 챗봇 — 순수 JS 버전 (React ScreenChat 플로우 재현)
// ═══════════════════════════════════════════════════════════════════════════

// ── 데이터 ─────────────────────────────────────────────────────
const STOCK = { name: '삼성전자', code: '005930', market: 'KOSPi' }
const BASE_PRICE = 192600
const ORDER_BOOK = [
  { price: 192800, diff: +200 },
  { price: 192700, diff: +100 },
  { price: 192600, diff: 0 },
  { price: 192500, diff: -100 },
  { price: 192400, diff: -200 },
]
const QTY = 15
const ORDER_NO = 'B20260627-0381'
const ORDER_TIME = '14:32:05'

const INTRO_TEXT = '삼성전자 1주당 매수 가격을 선택하거나 입력해 주세요.'
const CONFIRM_INTRO = `아래 내용과 같이 삼성전자 ${QTY}주 매수 접수 할게요. 확인 후 주문을 실행해 주세요. 주문 실행 시 정정·취소가 제한될 수 있어요.`
const DONE_TEXT = '매수 주문이 정상 접수되었어요. 체결 여부는 거래내역에서 확인할 수 있어요. 체결되면 알림으로 알려드릴게요.'

const ISA_TEXT = 'ISA(개인종합자산관리계좌)는 예금·펀드·ETF를 한 계좌에 담아 비과세 혜택을 받는 절세 계좌예요.'
const ISA_CHIPS = ['가입 자격 확인', '납입 한도 조회', '계좌 개설하기']

const MENU_ITEMS = [
  { label: '매수 · 매도 주문', query: '매수·매도 주문 방법 알려줘' },
  { label: '잔고 · 거래내역', query: '잔고와 거래내역 보는 방법 알려줘' },
  { label: '펀드 · CMA', query: '펀드와 CMA 상품 알려줘' },
  { label: '연금저축계좌', query: '연금저축계좌 알아보기' },
  { label: '퇴직연금(IRP)', query: '퇴직연금 IRP 알아보기' },
  { label: 'ISA', query: 'ISA 알아보기' },
  { label: '국내·해외 주식거래', query: '국내·해외 주식거래 방법 알려줘' },
  { label: '공모주·배당·수수료', query: '공모주, 배당, 수수료 안내 해줘' },
]

// ── SVG 아이콘 ─────────────────────────────────────────────────
const ICON = {
  chevronUp: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  checkBig: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>',
}

const won = (n) => n.toLocaleString('ko-KR')

// ── 상태 ───────────────────────────────────────────────────────
const state = {
  screen: 'home',       // 'home' | 'chat'
  isISA: false,
  stage: 0,             // 0~6
  question: '',
  selectedPrice: null,
  priceConfirmed: false,
  orderExecuted: false,
}
let timers = []
const clearTimers = () => { timers.forEach(clearTimeout); timers.forEach(clearInterval); timers = [] }
const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

// ── DOM ────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id)
const screenHome = $('screen-home')
const screenChat = $('screen-chat')
const chatHeader = $('chat-header')
const chatScroll = $('chat-scroll')
const chatThread = $('chat-thread')
const chatInputBar = $('chat-input-bar')
const homeTextarea = $('home-textarea')
const homeInputCard = $('home-input-card')
const homeSend = $('home-send')
const chatInput = $('chat-input')
const chatSend = $('chat-send')
const headerClose = $('header-close')
const menuOverlay = $('menu-overlay')
const menuSheet = $('menu-sheet')
const sheetList = $('sheet-list')
const sheetClose = $('sheet-close')

// ═══════════════════════════════════════════════════════════════
// 화면 전환
// ═══════════════════════════════════════════════════════════════
function ask(q) {
  const text = (q || '').trim()
  if (!text) return
  startChat(text)
}

function goHome() {
  clearTimers()
  state.screen = 'home'
  screenChat.classList.remove('is-active')
  screenHome.classList.add('is-active')
  chatHeader.setAttribute('hidden', '')
  homeTextarea.value = ''
}

function startChat(question) {
  clearTimers()
  state.screen = 'chat'
  state.isISA = question.includes('ISA')
  state.stage = 0
  state.question = question
  state.selectedPrice = null
  state.priceConfirmed = false
  state.orderExecuted = false

  chatThread.innerHTML = ''
  chatInput.value = ''
  chatHeader.classList.remove('is-scrolled')

  // 화면 전환
  screenHome.classList.remove('is-active')
  screenChat.classList.add('is-active')
  chatHeader.removeAttribute('hidden')

  renderThread()

  // stage 0 → 1
  later(() => { state.stage = 1; renderThread(); typeStage1() }, 900)
}

// ═══════════════════════════════════════════════════════════════
// 타이핑 애니메이션
// ═══════════════════════════════════════════════════════════════
function typeText(target, text, speed, done) {
  let i = 0
  const id = setInterval(() => {
    i++
    target.textContent = text.slice(0, i)
    scrollToBottom()
    if (i >= text.length) { clearInterval(id); if (done) later(done, 300) }
  }, speed)
  timers.push(id)
}

function typeStage1() {
  const p = $('ai1-text')
  if (!p) return
  const text = state.isISA ? ISA_TEXT : INTRO_TEXT
  p.innerHTML = '<span class="typed"></span><span class="caret"></span>'
  typeText(p.querySelector('.typed'), text, 22, () => {
    const caret = p.querySelector('.caret'); if (caret) caret.remove()
    state.stage = 2
    renderStage2()
  })
}

function typeStage4() {
  const p = $('ai2-text')
  if (!p) return
  p.innerHTML = '<span class="typed"></span><span class="caret"></span>'
  typeText(p.querySelector('.typed'), CONFIRM_INTRO, 18, () => {
    const caret = p.querySelector('.caret'); if (caret) caret.remove()
    state.stage = 5
    renderStage5()
  })
}

// ═══════════════════════════════════════════════════════════════
// 렌더링
// ═══════════════════════════════════════════════════════════════
function scrollToBottom() {
  chatScroll.scrollTo({ top: chatScroll.scrollHeight, behavior: 'smooth' })
}

function aiBadge() {
  return `<div class="ai-badge"><span class="avatar">${ICON.sparkles}</span><span class="name">AI 상담사</span></div>`
}

function userBubble(text) {
  return `<div class="msg-user"><div class="bubble"><p>${text}</p></div></div>`
}

function typingDots() {
  return '<div class="typing-dots"><span></span><span></span><span></span></div>'
}

// 초기 렌더 (사용자 발화 1 + AI 응답 1)
function renderThread() {
  chatThread.innerHTML = `
    ${userBubble(state.question)}
    <div class="msg-ai" id="ai1-group">
      ${aiBadge()}
      <div class="ai-bubble-wrap">
        <div class="ai-bubble" id="ai1-bubble">
          ${state.stage === 0 ? typingDots() : '<p class="ai-text" id="ai1-text"></p>'}
        </div>
      </div>
    </div>
  `
  scrollToBottom()
}

// stage 1에서 dots를 텍스트 문단으로 교체
function ensureAi1TextNode() {
  const bubble = $('ai1-bubble')
  if (bubble && !$('ai1-text')) {
    bubble.innerHTML = '<p class="ai-text" id="ai1-text"></p>'
  }
}

function renderStage2() {
  ensureAi1TextNode()
  const group = $('ai1-group')
  if (!group) return
  if (state.isISA) {
    const chips = document.createElement('div')
    chips.className = 'isa-chips'
    chips.innerHTML = ISA_CHIPS.map((c) => `<button type="button" class="isa-chip">${c}</button>`).join('')
    group.appendChild(chips)
  } else {
    group.appendChild(buildOrderBookCard())
  }
  scrollToBottom()
}

function buildOrderBookCard() {
  const card = document.createElement('div')
  card.className = 'card'
  card.id = 'orderbook-card'

  const rows = ORDER_BOOK.map((row) => {
    const isCurrent = row.diff === 0
    let right = ''
    if (isCurrent) right += '<span class="badge-current">현재가</span>'
    if (row.diff !== 0) {
      right += `<span class="diff-tag ${row.diff > 0 ? 'up' : 'down'}">${row.diff > 0 ? ICON.chevronUp : ICON.chevronDown}${won(Math.abs(row.diff))}</span>`
    }
    return `<button type="button" class="order-row" data-price="${row.price}">
      <span class="price">${won(row.price)}</span>
      <span class="right">${right}</span>
    </button>`
  }).join('')

  card.innerHTML = `
    <div class="stock-header">
      <p class="stock-name">${STOCK.name}&nbsp;<span class="stock-code">${STOCK.code} · ${STOCK.market}</span></p>
      <p class="stock-price">${won(BASE_PRICE)}<span class="diff">▲ 14,200 (+7.96%)</span></p>
    </div>
    <div class="order-rows">${rows}</div>
    <div class="card-btn-area">
      <button type="button" class="primary-btn" id="price-confirm-btn" disabled>
        <span class="btn-label">매수가격 선택</span>
        <span class="btn-check">${ICON.check}</span>
      </button>
    </div>
  `

  // 호가 행 선택
  card.querySelectorAll('.order-row').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.priceConfirmed || state.stage !== 2) return
      state.selectedPrice = Number(btn.dataset.price)
      card.querySelectorAll('.order-row').forEach((b) =>
        b.classList.toggle('is-selected', Number(b.dataset.price) === state.selectedPrice))
      const confirmBtn = $('price-confirm-btn')
      confirmBtn.disabled = false
      confirmBtn.classList.add('is-enabled')
    })
  })

  // 매수가격 선택 버튼
  card.querySelector('#price-confirm-btn').addEventListener('click', () => {
    if (!state.selectedPrice || state.priceConfirmed || state.stage !== 2) return
    state.priceConfirmed = true
    const b = $('price-confirm-btn')
    b.disabled = true
    b.classList.remove('is-enabled')
    b.classList.add('is-confirmed')
    later(() => { state.stage = 3; renderStage3() }, 400)
  })

  return card
}

function renderStage3() {
  // 사용자 발화 2 + AI 응답 2 (typing dots)
  const frag = document.createElement('div')
  frag.innerHTML = `
    ${userBubble('매수금액선택완료')}
    <div class="msg-ai" id="ai2-group">
      ${aiBadge()}
      <div class="ai-bubble-wrap">
        <div class="ai-bubble" id="ai2-bubble">${typingDots()}</div>
      </div>
    </div>
  `
  while (frag.firstElementChild) chatThread.appendChild(frag.firstElementChild)
  scrollToBottom()

  // stage 3 → 4
  later(() => {
    state.stage = 4
    const bubble = $('ai2-bubble')
    if (bubble) bubble.innerHTML = '<p class="ai-text" id="ai2-text"></p>'
    typeStage4()
  }, 800)
}

function renderStage5() {
  const group = $('ai2-group')
  if (!group) return
  group.appendChild(buildOrderConfirmCard())
  scrollToBottom()
}

function buildOrderConfirmCard() {
  const price = state.selectedPrice ?? BASE_PRICE
  const total = price * QTY
  const card = document.createElement('div')
  card.className = 'card'
  const rows = [
    { label: '종목', value: STOCK.name },
    { label: '구분', value: '매수 · 지정가', accent: true },
    { label: '주문가격', value: `${won(price)}원` },
    { label: '수량', value: `${QTY}주` },
    { label: '총 주문금액', value: `${won(total)}원`, bold: true },
  ].map((r) => `<div class="info-row"><span class="label">${r.label}</span><span class="value ${r.bold ? 'bold' : ''} ${r.accent ? 'accent' : ''}">${r.value}</span></div>`).join('')

  card.innerHTML = `
    <div class="info-rows">${rows}</div>
    <div class="card-btn-row">
      <button type="button" class="cancel-btn" id="order-cancel-btn">취소</button>
      <button type="button" class="primary-btn exec-btn is-enabled" id="order-exec-btn">
        <span class="btn-label">매수 · 실행</span>
        <span class="btn-check">${ICON.check}</span>
      </button>
    </div>
  `

  card.querySelector('#order-cancel-btn').addEventListener('click', () => {
    if (state.orderExecuted) return
    goHome()
  })
  card.querySelector('#order-exec-btn').addEventListener('click', () => {
    if (state.orderExecuted || state.stage !== 5) return
    state.orderExecuted = true
    const b = $('order-exec-btn')
    b.disabled = true
    const cancel = $('order-cancel-btn'); if (cancel) cancel.disabled = true
    b.classList.remove('is-enabled')
    b.classList.add('is-confirmed')
    later(() => { state.stage = 6; renderStage6() }, 400)
  })

  return card
}

function renderStage6() {
  const price = state.selectedPrice ?? BASE_PRICE
  const total = price * QTY
  const frag = document.createElement('div')
  frag.innerHTML = `
    ${userBubble('매수 주문 실행')}
    <div class="msg-ai">
      ${aiBadge()}
      <div class="ai-bubble-wrap">
        <div class="ai-bubble"><p class="ai-text">${DONE_TEXT}</p></div>
      </div>
      <div class="card">
        <div class="done-top">
          <div class="done-check">${ICON.checkBig}</div>
          <p class="done-title">주문 접수 완료</p>
        </div>
        <div class="done-info info-rows">
          ${[
            { label: '종목', value: STOCK.name },
            { label: '구분', value: '매수 · 지정가', accent: true },
            { label: '주문 수량', value: `${QTY}주` },
            { label: '주문가격', value: `${won(price)}원` },
            { label: '총 주문금액', value: `${won(total)}원`, bold: true },
            { label: '주문번호', value: ORDER_NO },
            { label: '접수시각', value: ORDER_TIME },
          ].map((r) => `<div class="info-row"><span class="label">${r.label}</span><span class="value ${r.bold ? 'bold' : ''} ${r.accent ? 'accent' : ''}">${r.value}</span></div>`).join('')}
        </div>
      </div>
    </div>
  `
  while (frag.firstElementChild) chatThread.appendChild(frag.firstElementChild)
  scrollToBottom()
}

// ═══════════════════════════════════════════════════════════════
// 메뉴 바텀시트
// ═══════════════════════════════════════════════════════════════
function renderMenu() {
  sheetList.innerHTML = MENU_ITEMS.map((item) =>
    `<li><button type="button" class="sheet-item" data-query="${item.query}"><span>${item.label}</span></button></li>`
  ).join('')
  sheetList.querySelectorAll('.sheet-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeMenu()
      later(() => ask(btn.dataset.query), 320)
    })
  })
}

function openMenu() {
  menuOverlay.removeAttribute('hidden')
  menuSheet.removeAttribute('hidden')
  requestAnimationFrame(() => {
    menuOverlay.classList.add('is-open')
    menuSheet.classList.add('is-open')
  })
}

function closeMenu() {
  menuOverlay.classList.remove('is-open')
  menuSheet.classList.remove('is-open')
  setTimeout(() => {
    menuOverlay.setAttribute('hidden', '')
    menuSheet.setAttribute('hidden', '')
  }, 360)
}

// ═══════════════════════════════════════════════════════════════
// 이벤트 바인딩
// ═══════════════════════════════════════════════════════════════
function isComposing(e) {
  return e.nativeEvent?.isComposing || e.isComposing || e.keyCode === 229
}

// 홈 전송
homeSend.addEventListener('click', () => ask(homeTextarea.value))
homeTextarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !isComposing(e)) {
    e.preventDefault()
    ask(homeTextarea.value)
  }
})
homeTextarea.addEventListener('focus', () => homeInputCard.classList.add('is-focused'))
homeTextarea.addEventListener('blur', () => homeInputCard.classList.remove('is-focused'))

// 채팅 전송
chatSend.addEventListener('click', () => ask(chatInput.value))
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !isComposing(e)) {
    e.preventDefault()
    ask(chatInput.value)
  }
})
chatInput.addEventListener('focus', () => chatInputBar.classList.add('is-focused'))
chatInput.addEventListener('blur', () => chatInputBar.classList.remove('is-focused'))

// 닫기(홈으로)
headerClose.addEventListener('click', goHome)
document.querySelectorAll('.home-close').forEach((b) => b.addEventListener('click', goHome))

// 메뉴 열기/닫기
document.querySelectorAll('[data-open-menu]').forEach((b) => b.addEventListener('click', openMenu))
sheetClose.addEventListener('click', closeMenu)
menuOverlay.addEventListener('click', closeMenu)

// 헤더 스크롤 효과 + 스크롤바 표시
let scrollTimer = null
chatScroll.addEventListener('scroll', () => {
  chatScroll.classList.add('is-scrolling')
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => chatScroll.classList.remove('is-scrolling'), 700)
  chatHeader.classList.toggle('is-scrolled', chatScroll.scrollTop > 8)
})

// 바텀시트 드래그로 닫기 (터치/마우스)
;(function enableSheetDrag() {
  const handle = $('sheet-handle')
  let startY = 0, dragging = false, currentY = 0
  const onStart = (y) => { dragging = true; startY = y; currentY = 0; menuSheet.style.transition = 'none' }
  const onMove = (y) => {
    if (!dragging) return
    currentY = Math.max(0, y - startY)
    menuSheet.style.transform = `translateY(${currentY}px)`
  }
  const onEnd = () => {
    if (!dragging) return
    dragging = false
    menuSheet.style.transition = ''
    menuSheet.style.transform = ''
    if (currentY > 120) closeMenu()
  }
  handle.addEventListener('touchstart', (e) => onStart(e.touches[0].clientY), { passive: true })
  handle.addEventListener('touchmove', (e) => onMove(e.touches[0].clientY), { passive: true })
  handle.addEventListener('touchend', onEnd)
  handle.addEventListener('mousedown', (e) => { onStart(e.clientY); e.preventDefault() })
  window.addEventListener('mousemove', (e) => onMove(e.clientY))
  window.addEventListener('mouseup', onEnd)
})()

// 초기화
renderMenu()
