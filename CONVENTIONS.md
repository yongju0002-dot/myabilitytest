# myabilitytest.com — 코드베이스 컨벤션

이 문서는 아래 파일을 실제로 읽고 관찰한 내용만 기록한 것이다. 추측이나 일반론은 넣지 않았고,
확인하지 못한 항목은 "확인 불가"로 표시했다.

읽은 파일: `/index.html`, `/ability-test/index.html`, `/skill-test/games/cps.html`,
`/skill-test/games/memory.html`, `/skill-test/games/time-stop.html`,
`/skill-test/games/time-guess.html`, `/en/skill-test/games/cps.html`, `/sitemap.xml`,
`/robots.txt`, `/style.css`, `/skill-test/style.css`, `/skill-test/common.js`.

---

## 1. 파일/디렉터리 구조 규칙

- 정적 사이트, 빌드 도구/번들러 없음. `<script>` 태그로 직접 로드하는 순수 HTML/CSS/JS.
- 한국어가 원본(URL에 언어 접두사 없음). `/en/`, `/ja/`, `/zh/`가 루트 디렉터리 구조를
  그대로 미러링한다. 예: `/skill-test/games/cps.html` ↔ `/en/skill-test/games/cps.html`.
- 게임 페이지 경로 패턴: `/skill-test/games/<slug>.html` (cps, memory, time-stop, time-guess).
- 예외: 반응속도 테스트는 `/ability-test/index.html` — 다른 게임들과 디렉터리 패턴이 다르고
  (slug 없이 index.html), 스타일도 공용 CSS를 안 쓰고 자체 `<style>` 인라인 블록을 통째로 갖고 있다.
- 공용 리소스는 **절대경로**로 참조한다: `<link rel="stylesheet" href="/skill-test/style.css">`,
  `<script src="/skill-test/common.js">`. 이 덕분에 어느 언어 디렉터리에서 열어도 항상 같은
  루트 기준 파일을 가리킨다. 새 파일도 이 절대경로 패턴을 따라야 한다.
- 페이지 내부 링크(뒤로가기·언어전환)는 상대/절대가 혼재한다:
  - `back-link`는 상대경로 (`../../index.html`, ability-test는 `../index.html`)
  - `lang-switch`는 절대경로 (`/skill-test/games/cps.html` 등)
  - 루트 `/index.html`은 `style.css`를 **상대경로**로 참조 — skill-test 하위 페이지들과 다른 패턴.
- **중요 — CSS 파일이 두 벌 존재하고 서로 갈라져(diverge) 있다**: `/style.css`(325줄, 루트
  index.html 전용)와 `/skill-test/style.css`(461줄, skill-test 게임 전용)는 별개 파일이다.
  `diff` 결과 최근 수정(예: `.memory-cell` 배경색 대비 개선)이 `/skill-test/style.css`에만
  반영되고 `/style.css`에는 없다. **새 게임 페이지는 항상 `/skill-test/style.css`만 참조할 것.
  `/style.css`는 루트 허브 페이지 전용이므로 건드리거나 재사용하지 말 것.**
- `ability-test/index.html`의 인라인 `<style>`은 `/skill-test/style.css`와 디자인 토큰이
  유사하지만 100% 동일하지 않다 (`--wait-color`/`--go-color`/`--early-color` 등 반응속도
  테스트 전용 변수 추가 보유, 대신 `--gold`/`--rare`/`--common`/`--fail`는 없음).

## 2. `<head>` 템플릿 (실제 태그 그대로)

`skill-test/games/cps.html` 기준:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CPS 클릭 속도 테스트 | 능력 테스트</title>
<meta name="description" content="제한 시간 안에 얼마나 빠르게 클릭할 수 있나요? 무료 CPS(초당 클릭 수) 테스트, 실시간 그래프로 확인하세요.">
<link rel="canonical" href="https://myabilitytest.com/skill-test/games/cps.html">
<link rel="alternate" hreflang="ko" href="https://myabilitytest.com/skill-test/games/cps.html">
<link rel="alternate" hreflang="en" href="https://myabilitytest.com/en/skill-test/games/cps.html">
<link rel="alternate" hreflang="ja" href="https://myabilitytest.com/ja/skill-test/games/cps.html">
<link rel="alternate" hreflang="zh" href="https://myabilitytest.com/zh/skill-test/games/cps.html">
<link rel="alternate" hreflang="x-default" href="https://myabilitytest.com/skill-test/games/cps.html">
<link rel="stylesheet" href="/skill-test/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7993734713843733" crossorigin="anonymous"></script>
</head>
```

- **title**: `"{테스트명} | 능력 테스트"` (en/ja/zh는 각각 `"| Ability Test"` / `"| 能力テスト"` / `"| 能力测试"`).
- **meta description**: 한 문장 훅 + 짧은 설명, 대략 40~55자(한글 기준). `"...무료 OO 테스트."`
  로 끝나는 패턴이 반복됨 (강제 규칙까지는 아니고 관찰된 습관).
- **canonical**: 항상 자기 자신(해당 언어 버전)의 URL. 다른 언어를 가리키는 경우 없음.
- **hreflang**: `ko → en → ja → zh → x-default` 순서 고정, 5개 항상 전부 포함.
  `x-default`는 한국어(원본) URL과 동일한 값.
- **OG 태그 / Twitter 카드 / JSON-LD 구조화 데이터**: 사이트 전체에 단 하나도 없음
  (`og:`, `ld+json`, `twitter:card` grep 결과 0건). 즉 "기존 형식을 따르라"고 해도 따를
  기존 형식이 없다 — 새로 만들려면 처음부터 설계해야 한다.
- **서드파티 스크립트**: AdSense Auto ads 스크립트 하나만 24개 전 페이지 `</head>` 직전에
  있음: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7993734713843733" crossorigin="anonymous"></script>`.
  GA4나 다른 분석 스크립트는 소스에 없음 (Cloudflare Web Analytics beacon은 배포 시
  Cloudflare가 자동 주입하는 것이라 소스에는 안 보임).
- `google-site-verification` 메타 태그는 루트 `/index.html`에서만 확인됨. 다른 페이지는 확인 안 함
  (확인 불가).

## 3. 공통 마크업 패턴

게임 페이지 헤더 (실제 마크업, `slug`/텍스트만 치환):

```html
<div class="wrap">
  <a class="back-link" href="../../index.html">← 메인으로</a>
  <div class="lang-switch">
    <a class="active" href="/skill-test/games/{slug}.html">한국어</a>
    <a href="/en/skill-test/games/{slug}.html">English</a>
    <a href="/ja/skill-test/games/{slug}.html">日本語</a>
    <a href="/zh/skill-test/games/{slug}.html">中文</a>
  </div>
  <h1>{emoji} {제목}</h1>
  <p class="sub">{한 줄 설명}</p>
  ...
</div>
```

- `lang-switch`는 항상 4개 `<a>` 전부 존재, 현재 언어에만 `class="active"`가 붙고 href는
  자기 자신을 가리킴 (비활성 링크가 아니라 실제 `<a>`).
- **결과 화면**: `<div id="resultPanel" class="result-panel">` 안에 emoji → h2 → (stars) →
  desc → (percentile, grade-table — 게임에 따라 있고 없음) → `btn-row`(다시하기 + 공유하기 버튼).
- **세션 통계**: `<div class="stats">` 3열 grid, 각 `.stat-box`에 label + value.
- **역대 기록 순위 섹션** (모든 게임 공통, `.wrap` 최하단):
  ```html
  <h2 style="text-align:center; font-size:16px; margin-top:28px;">🏆 역대 기록 순위 (최대 30위)</h2>
  <div id="topLeaderboard"></div>
  ```
- **푸터**: 공통 컴포넌트로 존재하지 않는다. `<footer class="note">`는 `ability-test/index.html`
  하나에만 있고(예측 클릭 경고문), skill-test 게임 4종에는 `<footer>` 요소 자체가 없음.
- **하단 SEO 설명 텍스트**: `ability-test/index.html`에만 `<section class="info">`(h2/p/table/details)
  블록이 있음. skill-test 게임 4종(cps/memory/time-stop/time-guess)에는 이런 하단 설명 섹션이
  **전혀 없다**. 즉 "설명 텍스트 섹션의 구조"는 게임마다 다른 게 아니라, 애초에 절반의
  페이지에는 존재하지 않는 상태.

## 4. 디자인 토큰

`/skill-test/style.css` `:root` (skill-test 게임 4종이 쓰는 최신 버전):

```css
--bg-top: #0f172a;
--bg-bottom: #1e293b;
--card-bg: #1e293b;
--card-bg-2: #172033;
--accent: #6366f1;
--gold: #fbbf24;
--rare: #a78bfa;
--common: #34d399;
--fail: #64748b;
--danger: #ef4444;
--text-dim: #94a3b8;
--text-dim2: #64748b;
```

- 폰트: `"Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` (전 페이지 동일).
- 버튼: `.btn`(accent 배경, radius 12px), `.btn.secondary`(반투명 흰색), `.btn.share`(#22c55e 초록).
- 배경: `linear-gradient(160deg, var(--bg-top), var(--bg-bottom))` 고정 다크 배경.
- **다크모드 토글 없음**: `prefers-color-scheme` 미디어쿼리 사용 안 함. 다크 테마가 유일한
  고정 테마이고, 라이트 모드 지원이 아예 없다.
- **반응형 브레이크포인트**: 확인된 것은 `@media (max-width: 420px)` 단 하나뿐
  (`.hub-grid` 2열→1열, 루트 index.html에만 존재). 그 외 브레이크포인트 없음. `.wrap`의
  max-width는 페이지마다 다름 (ability-test 520px, skill-test 공용 560px).

## 5. JavaScript 관례

- **localStorage 키 이름 규칙** (실제 키 그대로):
  - 누적 통계: `skill<GameName>Stats` 또는 `...StatsV2` — 예: `skillCpsStatsV2`,
    `skillMemoryStats`, `skillTimeStopStats`, `skillTimeGuessStats`.
    ability-test만 예외로 `reactionStatsV2`.
  - 역대 순위표: `skill<GameName>LeaderboardV1` — 예: `skillCpsLeaderboardV1`,
    `skillMemoryLeaderboardV1`, `skillTimeStopLeaderboardV1`, `skillTimeGuessLeaderboardV1`.
    ability-test는 `reactionLeaderboardV1`.
- **순위표 구현**: `/skill-test/common.js`의 공용 함수 사용.
  ```js
  addToLeaderboard(key, entry, betterIsLower, max = 30)   // push → sort → slice(0,30) → 저장
  renderLeaderboard(containerId, list, formatRow, emptyText)
  ```
  `betterIsLower = true`면 오름차순(값이 작을수록 좋음 — 시간 오차류),
  `false`면 내림차순(값이 클수록 좋음 — CPS·레벨류).
  entry는 항상 `{ value, date: Date.now(), ...게임별 추가 필드 }` 형태.
  **단, `ability-test/index.html`은 `common.js`를 로드하지 않고 동일 로직(`loadLB`/
  `addToLeaderboard`/`renderTopLeaderboard`)을 자체 인라인으로 재구현**하고 있다
  (이름은 같지만 별개 정의 — common.js를 안 불러오므로 충돌은 없음).
- **구간별(파라미터별) 세션 통계**는 `cps.html`에서만 관찰됨 — `allStats[duration] =
  { plays, bestCps, bestClicks }` 식으로 지속시간 키별로 분리 저장. 다른 게임들
  (memory/time-stop/time-guess)은 파라미터 분리 없이 단일 누적 `{ count, best, sum }`만 사용.
- **결과 공유**: `/skill-test/common.js`의 `shareResult(text)` — `navigator.share` 지원 시
  그걸 쓰고, 아니면 클립보드 복사 + `showToast()`. 복사 완료 문구는 `COPY_TOAST` 객체에서
  `document.documentElement.lang` 기준으로 언어별 선택.
  **`ability-test/index.html`에는 공유 버튼이 없다** (summary-actions에 재도전/라운드변경만
  있음). 즉 공유 기능이 있는 건 skill-test 4종뿐.
- **오디오**: `/skill-test/common.js`에 `playTone`/`playStartSound`/`playEndSound`
  (Web Audio API, `OscillatorNode`) 공용 함수 있음. `time-stop.html`, `time-guess.html`에서
  사용. `cps.html`, `memory.html`, ability-test는 오디오 미사용.
- **빌드 도구**: 없음. 순수 정적 파일, `<script>` 직접 로드.

## 6. 신규 테스트 추가 시 반드시 같이 수정해야 하는 파일

- `/index.html` (+ `/en/index.html`, `/ja/index.html`, `/zh/index.html`) — `.hub-grid`에
  `.game-card` 링크 추가. **이곳이 사이트에서 유일한 게임 목록이다.**
- `/sitemap.xml` — 언어별 URL 4건 + 각 URL 안의 `xhtml:link` 상호참조 4개씩 추가
  (기존 블록을 그대로 복사해서 loc/hreflang만 치환하면 됨).
- `robots.txt`는 수정 불필요 (`Allow: /`로 전체 허용이라 새 경로가 자동 포함됨).

> **프롬프트 팩 정정**: 기존 "신규 테스트 프롬프트 팩"의 공통 규칙에는
> "`/ability-test/index.html`(목록 추가)"도 허용/필수 수정 대상으로 적혀 있으나, 이는 실제
> 코드와 맞지 않는다. `ability-test/index.html`은 다른 테스트로 가는 목록이나 링크가 전혀
> 없는 반응속도 테스트 단일 완결 페이지다. 새 테스트를 추가할 때 이 파일을 수정할 필요는
> 없다 — 프롬프트를 쓸 때 이 지시는 빼거나 무시할 것.

---

## 신규 게임 페이지 최소 템플릿

`slug`, `{...}` 표시된 부분만 채우면 되는 골격. `time-guess.html`/`cps.html` 구조 기준.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{테스트명} | 능력 테스트</title>
<meta name="description" content="{한 문장 훅}. 무료 {테스트명} 테스트.">
<link rel="canonical" href="https://myabilitytest.com/skill-test/games/{slug}.html">
<link rel="alternate" hreflang="ko" href="https://myabilitytest.com/skill-test/games/{slug}.html">
<link rel="alternate" hreflang="en" href="https://myabilitytest.com/en/skill-test/games/{slug}.html">
<link rel="alternate" hreflang="ja" href="https://myabilitytest.com/ja/skill-test/games/{slug}.html">
<link rel="alternate" hreflang="zh" href="https://myabilitytest.com/zh/skill-test/games/{slug}.html">
<link rel="alternate" hreflang="x-default" href="https://myabilitytest.com/skill-test/games/{slug}.html">
<link rel="stylesheet" href="/skill-test/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7993734713843733" crossorigin="anonymous"></script>
</head>
<body>
  <div class="wrap">
    <a class="back-link" href="../../index.html">← 메인으로</a>
    <div class="lang-switch">
      <a class="active" href="/skill-test/games/{slug}.html">한국어</a>
      <a href="/en/skill-test/games/{slug}.html">English</a>
      <a href="/ja/skill-test/games/{slug}.html">日本語</a>
      <a href="/zh/skill-test/games/{slug}.html">中文</a>
    </div>
    <h1>{emoji} {제목}</h1>
    <p class="sub">{한 줄 설명}</p>

    <!-- 게임 화면 (setup / play / round 등, 게임마다 자유롭게 구성) -->
    <div id="setupScreen">
      ...
      <div class="btn-row">
        <button class="btn" id="startGameBtn">시작하기</button>
      </div>
    </div>

    <div id="playScreen" style="display:none;">
      ...
    </div>

    <div id="resultPanel" class="result-panel">
      <div class="emoji">🏆</div>
      <h2 id="resultTitle"></h2>
      <div class="desc" id="resultDesc"></div>
      <div class="btn-row">
        <button class="btn" id="retryBtn">다시 하기</button>
        <button class="btn share" id="shareBtn">결과 공유하기</button>
      </div>
    </div>

    <div class="stats">
      <div class="stat-box">
        <div class="label">도전 횟수</div>
        <div class="value" id="statCount">0</div>
      </div>
      <div class="stat-box">
        <div class="label">{지표1}</div>
        <div class="value" id="statBest">-</div>
      </div>
      <div class="stat-box">
        <div class="label">{지표2}</div>
        <div class="value" id="statAvg">-</div>
      </div>
    </div>

    <h2 style="text-align:center; font-size:16px; margin-top:28px;">🏆 역대 기록 순위 (최대 30위)</h2>
    <div id="topLeaderboard"></div>
  </div>

<script src="/skill-test/common.js"></script>
<script>
  const STORE_KEY = 'skill{GameName}Stats';
  const LB_KEY = 'skill{GameName}LeaderboardV1';
  let stats = loadStats(STORE_KEY, { count: 0, best: null, sum: 0 });

  function renderStats() {
    document.getElementById('statCount').textContent = stats.count;
    // statBest / statAvg 채우기
  }

  function finishGame(value) {
    stats.count += 1;
    // best/sum 갱신 로직
    saveStats(STORE_KEY, stats);
    renderStats();

    document.getElementById('resultTitle').textContent = '{결과 텍스트}';
    document.getElementById('resultPanel').classList.add('show');
    document.getElementById('resultPanel').dataset.share = `{공유 문구} → `;

    // betterIsLower: 값이 작을수록 좋으면 true, 클수록 좋으면 false
    const lbList = addToLeaderboard(LB_KEY, { value, date: Date.now() }, /* betterIsLower */ false);
    renderTopLeaderboard(lbList);
  }

  function renderTopLeaderboard(list) {
    renderLeaderboard('topLeaderboard', list, (entry) => {
      const d = new Date(entry.date);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      return `<span class="lb-name">${entry.value}</span><span class="lb-detail">${dateStr}</span>`;
    }, '아직 기록이 없어요. 첫 도전을 해보세요!');
  }

  document.getElementById('shareBtn')?.addEventListener('click', () => {
    shareResult((document.getElementById('resultPanel').dataset.share || '') + location.href.replace('games/{slug}.html', ''));
  });

  renderStats();
  renderTopLeaderboard(loadStats(LB_KEY, []));
</script>
</body>
</html>
```
