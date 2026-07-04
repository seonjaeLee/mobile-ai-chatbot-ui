# 삼성증권 mPOP AI 챗봇 - HTML 버전

순수 HTML/CSS/JavaScript로 구성된 챗봇 UI입니다. npm 의존성 없이 즉시 사용할 수 있습니다.

## 파일 구조

```
html-version/
├── index.html          # 메인 HTML
├── styles.css          # 모든 스타일
├── script.js           # JavaScript 로직
├── images/
│   └── bg-aurora.png   # 배경 그라디언트 이미지
└── README.md           # 이 파일
```

## 사용 방법

### 1. 로컬에서 열기
브라우저에서 `index.html`을 직접 열거나, 간단한 로컬 서버로 실행:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server 설치 필요)
npx http-server
```

### 2. WYSIWYG 솔루션에 올리기

#### Webflow
1. `index.html` 구조를 참고해 HTML 엘리먼트 만들기
2. `styles.css`의 스타일을 Webflow 디자이너에 입력
3. `script.js`의 JavaScript 로직을 Webflow 커스텀 코드에 추가

#### Bubble.io / FlutterFlow
- HTML/CSS 임베드 기능 사용
- `index.html`을 iframe으로 임베드 가능

## 주요 기능

- **홈 화면**: 인사말, 질문 입력 카드, 메뉴 트리거
- **채팅 화면**: 메시지 표시, 호가창 카드, 주문 확인 카드
- **반응형**: 모바일 우선 디자인, PC에서도 동작
- **애니메이션**: CSS 기반 부드러운 페이드/슬라이드
- **헤더 효과**: 스크롤 시 배경 블러 적용

## 커스터마이징

### 색상 변경
`styles.css`의 CSS 변수 수정:

```css
:root {
  --navy: #034EA2;           /* 네이비 */
  --text-ink: #232136;       /* 텍스트 */
  --border-line: #ecebf2;    /* 테두리 */
  /* 기타... */
}
```

### 텍스트 변경
`script.js`의 상수 수정:

```javascript
const INTRO_TEXT = '원하는 텍스트';
const ISA_TEXT = '...';
```

### 배경 이미지 변경
`styles.css`에서 `.bg-aurora` 그래디언트 수정 또는 이미지 URL 변경:

```css
.bg-aurora {
  background-image: url('새로운이미지.png');
}
```

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript (Vanilla)**: ES6+, 이벤트 핸들링

**의존성 없음** - 외부 라이브러리 미사용

## 모바일 호환성

- iOS Safari ✅
- Android Chrome ✅
- 데스크톱 브라우저 ✅

모바일 키패드 올라올 때도 레이아웃 정상 유지 (`height: 100dvh` 사용)

## React 버전과의 차이

| 항목 | HTML 버전 | React 버전 |
|------|---------|----------|
| 파일 수 | 4 | 20+ |
| 번들 크기 | ~50KB | ~500KB |
| 빌드 필요 | ❌ | ✅ |
| npm 필요 | ❌ | ✅ |
| 애니메이션 | CSS | Framer Motion |
| 배포 복잡도 | 낮음 | 중간 |

## 문제 해결

### 배경이 안 보임
- `images/bg-aurora.png` 경로 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

### 입력이 안 됨
- JavaScript가 활성화되었는지 확인
- 콘솔 오류 확인 (F12 > Console)

### WYSIWYG에서 동작 안 함
- 모든 CSS가 로드되었는지 확인
- JavaScript 실행 권한 확인
- iframe 샌드박스 설정 검토

## 라이선스

이 코드는 자유롭게 수정/배포 가능합니다.

---

**React 버전이 필요한가요?** → `/app`, `/components`, `package.json` 참고
**원본 대비 큰 변화가 필요한가요?** → `_backup-react/` 폴더에 React 소스 백업됨
