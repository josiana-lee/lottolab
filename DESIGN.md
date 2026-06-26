# Lotto Lab — Design System

> 디자인 원본: `design/Lotto Lab.dc.html`

---

## 컨셉

데이터 분석 대시보드. 도박 사이트가 아닌 신뢰감 있는 분석 툴 느낌.  
다크 네이비 배경에 사이언 액센트 컬러로 테크·데이터 분위기를 연출한다.

---

## 색상

| 토큰 | 값 | 용도 |
|------|----|------|
| `bg-base` | `#07080F` | 전체 배경 |
| `bg-card` | `#0C1220` | 카드·패널 배경 |
| `text-primary` | `#E8EDF5` | 주요 텍스트 |
| `text-secondary` | `#8A9BB0` | 레이블·서브텍스트 |
| `text-muted` | `#4A5A72` | 부연 설명 |
| `text-ghost` | `#3D4A5E` | 매우 흐린 텍스트 |
| `accent-cyan` | `#00E5FF` | 핵심 액센트, 버튼·스코어 |
| `accent-blue` | `#005BFF` | 그라디언트 끝색 |
| `border-subtle` | `rgba(255,255,255,0.07)` | 카드 테두리 |
| `border-cyan` | `rgba(0,229,255,0.22)` | 사이언 버튼 테두리 |

### 그라디언트

```css
/* 주요 CTA 버튼, 로고 아이콘 */
background: linear-gradient(135deg, #00E5FF 0%, #005BFF 100%);
```

---

## 번호볼 색상

| 범위 | 배경 | 텍스트 |
|------|------|--------|
| 1~10 | `#FBC400` (노랑) | `#1a1200` |
| 11~20 | `#69C8F2` (하늘) | `#012840` |
| 21~30 | `#FF7272` (빨강) | `#ffffff` |
| 31~40 | `#AAB8CC` (회색) | `#1a2030` |
| 41~45 | `#58D68D` (초록) | `#01301d` |

그림자: `box-shadow: 0 4px 18px <색상 50% 투명도>`

---

## 타이포그래피

| 폰트 | 용도 |
|------|------|
| **Space Grotesk** (400·500·600·700) | 기본 UI 텍스트, 버튼, 레이블 |
| **JetBrains Mono** (400·600·700) | 숫자, 번호볼, 점수, 코드성 텍스트 |

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 컴포넌트 패턴

### 카드

```css
background: #0C1220;
border: 1px solid rgba(255,255,255,0.07);
border-radius: 16px;   /* 일반 카드 */
border-radius: 20px;   /* 조합 카드 */
border-radius: 24px;   /* CTA 섹션 */
padding: 22px 24px;
```

### 주요 버튼 (CTA)

```css
background: linear-gradient(135deg, #00E5FF 0%, #005BFF 100%);
color: #000;
font-weight: 700;
border-radius: 14px;
padding: 19px 48px;
border: none;
```

### 보조 버튼 (동기화)

```css
background: rgba(0,229,255,0.07);
border: 1px solid rgba(0,229,255,0.22);
color: #00E5FF;
border-radius: 10px;
padding: 10px 18px;
```

### 삭제/저장 버튼 (소형)

```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
color: #6B7A96;
border-radius: 8px;
padding: 7px 16px;
font-size: 13px;
```

### 배지 / 칩

```css
/* 사이언 배지 */
background: rgba(0,229,255,0.09);
color: #00E5FF;
border-radius: 20px;
padding: 3px 10px;

/* 통계 칩 */
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 7px;
```

---

## 애니메이션

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
```

- **fadeInUp**: 조합 카드 등장 시 (`animation-delay`로 순차 표시)
- **spin**: 로딩 스피너 (`border-top-color: #00E5FF`)
- **blink**: 네비 상태 표시 점 (2s 주기)

---

## 레이아웃

```css
/* 전체 최대 너비 */
max-width: 1100px;
margin: 0 auto;
padding: 36px 24px 80px;

/* 상단 상태 스트립 */
display: grid;
grid-template-columns: 1fr 1fr 1.7fr;
gap: 14px;

/* 핫/콜드 패널 */
display: grid;
grid-template-columns: 1fr 1fr;
gap: 16px;
```

---

## 네비게이션

```css
height: 62px;
position: sticky;
top: 0;
z-index: 100;
background: rgba(7,8,15,0.94);
backdrop-filter: blur(14px);
border-bottom: 1px solid rgba(255,255,255,0.06);
padding: 0 36px;
```

---

## 당첨 매칭 상태 표시

저장한 조합이 실제 당첨 이력과 일치한 경우:

```tsx
// Tailwind
className={cn(
  "rounded-xl border p-4 transition",
  combo.matchedRound && "opacity-35 grayscale"
)}

// 배지
background: rgba(255,114,114,0.12);
border: 1px solid rgba(255,114,114,0.3);
color: #FF7272;
```

---

## Tailwind 커스텀 색상 권장 설정

```ts
// tailwind.config.ts
colors: {
  base: '#07080F',
  card: '#0C1220',
  cyan: '#00E5FF',
  'cyan-blue': '#005BFF',
  primary: '#E8EDF5',
  secondary: '#8A9BB0',
  muted: '#4A5A72',
  ghost: '#3D4A5E',
  // 번호볼
  ball: {
    yellow: '#FBC400',
    sky:    '#69C8F2',
    red:    '#FF7272',
    gray:   '#AAB8CC',
    green:  '#58D68D',
  }
}
```
