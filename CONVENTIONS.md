# myabilitytest.com — 코드베이스 컨벤션

이 문서는 아래 파일을 실제로 읽고 관찰한 내용만 기록한 것이다. 추측이나 일반론은 넣지 않았고,
확인하지 못한 항목은 "확인 불가"로 표시했다.

**2026-08-21 전면 개편 반영**: 이 문서의 이전 버전은 URL 재구조화(구 `/`, `/ability-test/`,
`/skill-test/games/*.html` 스킴) 이전 상태를 기술하고 있었다. 지금은 그 개편이 완료된 뒤의
실제 구조를 다시 읽고 전면 재작성한 것이다.

읽은 파일: `/ko/index.html`, `/en/index.html`, `/ko/tests/click-speed.html`,
`/ko/tests/reaction-time.html`, `/ko/tests/aim-trainer.html`, `/_redirects`, `/sitemap.xml`,
`/robots.txt`, `/style.css`, `/skill-test/style.css`, `/skill-test/common.js`.

---

## 1. 파일/디렉터리 구조 규칙

- 정적 사이트, 빌드 도구/번들러 없음. Cloudflare Workers 정적 자산으로 배포. `<script>` 태그로
  직접 로드하는 순수 HTML/CSS/JS.
- **URL 스킴 (현재)**: 4개 언어 모두 언어 접두사를 갖는다 — 한국어도 예외 없이 `/ko/`.
  루트 `/`는 `/ko/`로 301 리다이렉트된다(`_redirects` 참고).
  - 허브(목록) 페이지: `/{lang}/index.html` → 접속 시 확장자 없는 `/{lang}/` 형태로 서빙됨
    (Cloudflare Workers 정적 자산의 `html_handling: auto-trailing-slash` 기본 동작).
  - 테스트 페이지: `/{lang}/tests/{slug}.html` → `/{lang}/tests/{slug}` 형태로 서빙됨.
  - 예) `/ko/tests/click-speed.html` ↔ `/en/tests/click-speed.html` ↔ ... 4개 언어 모두
    동일한 slug로 완전히 미러링된다. **구 예외(반응속도 테스트가 `/ability-test/index.html`로
    다른 패턴을 쓰던 것)는 더 이상 없다** — 지금은 `/ko/tests/reaction-time.html`로 다른
    테스트들과 완전히 동일한 디렉터리 패턴을 따른다.
- **구 URL 하위호환**: 옛 경로(`/skill-test/games/{old-slug}.html`, `/ability-test/index.html`
  등)로 들어오는 요청은 `_redirects` 파일의 301 규칙으로 새 경로에 매핑된다. 새 테스트를
  추가할 때는 `_redirects`를 건드릴 필요 없음 — 애초에 없던 페이지라 구 경로도 없다.
  **반대로 기존 테스트를 삭제할 때는 반드시 규칙을 추가할 것** — 이미 색인된 URL이 404가
  되면 SEO상 손해다. 예: 지터/Kohi 클릭 테스트 삭제(2026-08-24) 시 해당 URL 8개를
  `click-speed`로 301 처리했다.
- 공용 리소스는 여전히 **절대경로**로 참조한다: `<link rel="stylesheet" href="/skill-test/style.css">`,
  `<script src="/skill-test/common.js">`. 새 파일도 이 절대경로 패턴을 따를 것.
- 페이지 내부 링크(뒤로가기·언어전환)는 **개편 후 전부 절대경로로 통일됨** (구버전 문서가
  기록했던 상대경로 `back-link`는 사라졌다):
  - `back-link`: `href="/{lang}/"` (허브로 절대경로 복귀)
  - `lang-switch`: `href="/{lang}/tests/{slug}"` 절대경로, 여전히 4개 언어 전부 존재
- **CSS 파일 두 벌 구조는 그대로 유지됨**: `/style.css`(325줄, 4개 허브 `/{lang}/index.html`
  전용)와 `/skill-test/style.css`(461줄, 테스트 페이지 12종 전용)는 여전히 별개 파일이다.
  **디자인 토큰(`:root` 변수명)은 개편 과정에서 통일되어 현재는 두 파일이 동일한 변수 세트를
  쓴다** (구버전 문서가 지적했던 토큰 불일치는 해소됨 — 재확인 필요 시 `diff`로 직접 검증할 것,
  값까지 100% 동일한지는 미검증). 새 테스트 페이지는 계속 `/skill-test/style.css`만 참조할 것.

## 2. `<head>` 템플릿 (실제 태그 그대로, `ko/tests/click-speed.html` 기준)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CPS 클릭 속도 테스트 | 능력 테스트</title>
<meta name="description" content="제한 시간 안에 얼마나 빠르게 클릭할 수 있나요? 무료 CPS(초당 클릭 수) 테스트, 실시간 그래프로 확인하세요.">
<link rel="canonical" href="https://myabilitytest.com/ko/tests/click-speed">
<link rel="alternate" hreflang="ko" href="https://myabilitytest.com/ko/tests/click-speed">
<link rel="alternate" hreflang="en" href="https://myabilitytest.com/en/tests/click-speed">
<link rel="alternate" hreflang="ja" href="https://myabilitytest.com/ja/tests/click-speed">
<link rel="alternate" hreflang="zh-Hant" href="https://myabilitytest.com/zh/tests/click-speed">
<link rel="alternate" hreflang="x-default" href="https://myabilitytest.com/en/tests/click-speed">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MyAbilityTest">
<meta property="og:title" content="CPS 클릭 속도 테스트 | 능력 테스트">
<meta property="og:description" content="제한 시간 안에 얼마나 빠르게 클릭할 수 있나요? 무료 CPS(초당 클릭 수) 테스트, 실시간 그래프로 확인하세요.">
<meta property="og:url" content="https://myabilitytest.com/ko/tests/click-speed">
<meta property="og:image" content="https://myabilitytest.com/og-default.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CPS 클릭 속도 테스트 | 능력 테스트">
<meta name="twitter:description" content="제한 시간 안에 얼마나 빠르게 클릭할 수 있나요? 무료 CPS(초당 클릭 수) 테스트, 실시간 그래프로 확인하세요.">
<meta name="twitter:image" content="https://myabilitytest.com/og-default.png">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"https://myabilitytest.com/#organization","name":"MyAbilityTest","url":"https://myabilitytest.com/","logo":{"@type":"ImageObject","url":"https://myabilitytest.com/og-default.png","width":1200,"height":630}},
{"@type":"WebSite","@id":"https://myabilitytest.com/#website","name":"MyAbilityTest","url":"https://myabilitytest.com/","inLanguage":["ko","en","ja","zh-Hant"],"publisher":{"@id":"https://myabilitytest.com/#organization"}},
{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://myabilitytest.com/ko/"},{"@type":"ListItem","position":2,"name":"CPS 클릭 속도 테스트 | 능력 테스트","item":"https://myabilitytest.com/ko/tests/click-speed"}]},
{"@type":"WebApplication","name":"CPS 클릭 속도 테스트 | 능력 테스트","url":"https://myabilitytest.com/ko/tests/click-speed","applicationCategory":"GameApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"inLanguage":"ko"}
]}
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">
<link rel="stylesheet" href="/skill-test/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7993734713843733" crossorigin="anonymous"></script>
</head>
```

- **파비콘**: 위 2줄이 전 페이지 공통. 새 페이지에도 반드시 넣을 것.
- **title**: `"{테스트명} | 능력 테스트"` (en/ja/zh는 각각 `"| Ability Test"` / `"| 能力テスト"` / `"| 能力测试"`).
- **meta description**: 한 문장 훅 + 짧은 설명, 대략 40~55자(한글 기준). 56개 페이지 전부 고유함
  (중복 없음, curl로 검증됨).
- **canonical**: 항상 자기 자신(해당 언어 버전)의 URL.
- **hreflang**: `ko → en → ja → zh-Hant → x-default` 순서 고정, 5개 항상 전부 포함.
  **주의 — 구버전 문서는 `hreflang="zh"`로 기록했으나 실제로는 `zh-Hant`가 맞다.**
  `x-default`는 **영어(en) URL**을 가리킨다 (한국어가 아님 — 국제 SEO 관례상 x-default는
  범용/영어권 기본값으로 설정하는 게 낫다는 판단으로 개편 시 변경됨).
- **OG 태그 / Twitter 카드 / JSON-LD 구조화 데이터**: **56개 페이지 전부에 존재한다.**
  (구버전 문서는 "사이트 전체에 단 하나도 없다"고 기록했으나 이는 개편 전 상태였다.)
  `@graph` 배열은 Organization + WebSite(사이트 전체 공통) + BreadcrumbList(페이지별) +
  WebApplication(테스트 페이지만) 조합이 기본. `click-speed`, `reaction-time` 2개 페이지는
  여기에 `FAQPage` 블록이 추가로 붙어 있다(검색 유입 가능성이 크다고 판단된 2종만 선별 적용,
  전체 확대는 하지 않음 — 확장 시 반드시 실제 자주 나오는 질문 기반으로만 작성할 것).
- **서드파티 스크립트**: AdSense Auto ads 스크립트 하나만 56개 전 페이지 `</head>` 직전에 있음.
  GA4나 다른 분석 스크립트는 소스에 없음.
- `google-site-verification` 메타 태그는 **`/ko/index.html`에서만** 확인됨 (구 루트
  `/index.html` 자리를 이제 `/ko/index.html`이 대신함). 다른 페이지는 확인 안 함(확인 불가).

## 3. 공통 마크업 패턴

테스트 페이지 헤더 (실제 마크업, `slug`/텍스트만 치환):

```html
<div class="wrap">
  <a class="back-link" href="/ko/">← 메인으로</a>
  <div class="lang-switch">
    <a class="active" href="/ko/tests/{slug}">한국어</a>
    <a href="/en/tests/{slug}">English</a>
    <a href="/ja/tests/{slug}">日本語</a>
    <a href="/zh/tests/{slug}">中文</a>
  </div>
  <h1>{emoji} {제목}</h1>
  <p class="sub">{한 줄 설명}</p>
  ...
</div>
```

- `lang-switch`는 항상 4개 `<a>` 전부 존재, 현재 언어에만 `class="active"`가 붙고 href는
  자기 자신을 가리킴.
- **결과 화면**: `<div id="resultPanel" class="result-panel">` 안에 emoji → h2 → (stars) →
  desc → **(persona-label — 한국어 페이지 12종 전부에 존재, 아래 6번 참고)** →
  (percentile, grade-table — 게임에 따라 있고 없음) → **(other-tests — 다른 테스트 4개로
  가는 크로스링크, 테스트 48페이지 전부에 존재, 아래 7번 참고)** → `btn-row`(다시하기 + 공유하기 버튼).
- **세션 통계**: `<div class="stats">` 3열 grid, 각 `.stat-box`에 label + value.
- **역대 기록 순위 섹션** (거의 모든 테스트 공통, `.wrap` 최하단):
  ```html
  <h2 style="text-align:center; font-size:16px; margin-top:28px;">🏆 역대 기록 순위 (최대 30위)</h2>
  <div id="topLeaderboard"></div>
  ```
- **하단 SEO 설명(`.info`) 섹션**: **12종 테스트 전부에 있다** (2026-08-24 애드센스
  "가치 없는 콘텐츠" 판정 대응으로 전면 보강됨). 구성은 `<h2>` 여러 개 + 점수 해석표
  + 설명 문단. 새 테스트를 만들 때도 반드시 같이 작성할 것 — 이게 없으면 그 페이지만
  콘텐츠가 빈약해진다. `click-speed`, `reaction-time` 2개는 여기에 FAQPage 스키마까지 붙어 있다.
- **footer**: `<footer class="site-footer">`가 **전 페이지 공통**으로 `.wrap` 안 최하단에
  있다(홈 / 개인정보처리방침 / 문의 + 저작권). 스타일은 `/style.css`와
  `/skill-test/style.css` 양쪽에 정의돼 있다. `reaction-time`에는 이와 별개로
  `<footer class="note">`(예측 클릭 경고문)가 추가로 남아있다.

## 4. 디자인 토큰

`/skill-test/style.css` `:root`:

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
  고정 테마.
- **반응형**: 모바일 375px 기준 가로 스크롤 없음(전 페이지 확인됨). 브레이크포인트는 페이지마다
  다르게 인라인으로 존재하는 경우가 있음 — 새 페이지 추가 시 375px 뷰포트에서 직접 확인할 것.

## 5. JavaScript 관례

- **localStorage 키 이름 규칙**: `skill<GameName>Stats`(or `...StatsV2`) / `skill<GameName>LeaderboardV1`
  패턴 유지. **`reaction-time`만 예외로 `reactionStatsV2` / `reactionLeaderboardV1`** (구
  ability-test 시절 이름을 그대로 유지 — URL만 바뀌었을 뿐 localStorage 키는 바뀌지 않았으므로
  기존 사용자의 기록이 개편으로 인해 유실되지 않았다).
- **순위표 구현**: `/skill-test/common.js`의 `addToLeaderboard(key, entry, betterIsLower, max=30)` /
  `renderLeaderboard(containerId, list, formatRow, emptyText)` 공용 함수 사용.
  **단, `reaction-time.html`은 여전히 `common.js`를 로드하지 않고 동일 로직을 자체 인라인으로
  재구현하고 있다** (구버전 문서가 기록한 특이사항 그대로 유지됨 — 재확인됨).
- **결과 공유**: `/skill-test/common.js`의 `shareResult(text)` 사용. **`reaction-time.html`에는
  여전히 공유 버튼이 없다** (`shareBtn`, `common.js` 참조 둘 다 0건, 재확인됨). 새로 공유 기능을
  넣으려면 `common.js`를 로드하고 `shareResult` 패턴을 따를 것 — 이 페이지만 아직 손대지 않은
  상태.
- **오디오**: `/skill-test/common.js`의 `playTone`/`playStartSound`/`playEndSound` 공용 함수.
  사용 여부는 게임마다 다름(확인 불가 — 전수 재조사 안 함).
- **빌드 도구**: 없음. 순수 정적 파일, `<script>` 직접 로드.

## 6. 한국어 전용 정체성(persona) 라벨 패턴 (2026-08-21 추가)

한국 시장 조사 결과 "반응속도 250ms"보다 "매복형 스나이퍼 — 상위 8%" 같은 공유 가능한
정체성 라벨이 SNS 공유를 유발한다는 판단 하에, **한국어(`/ko/`) 페이지 12종 전부**에 다음
패턴이 추가됨. **영어/일본어/중국어 페이지에는 의도적으로 적용하지 않음.**

- 기존 `GRADES`/tier 배열이 있는 테스트(10종): 각 tier 객체에 `persona: '{emoji} {짧은 정체성 문구}'`
  필드 추가.
- tier 배열이 없는 테스트(hearing-age/reaction-time/time-perception/time-stop, 4종): 기존
  metric(연령대/ms/초 오차)에 대한 자체 버킷 함수(`personaFor()` 등)를 새로 만들어 대응.
- 결과 화면에 `<div class="persona-label" id="personaLabel">` 요소로 노출, 공유 텍스트
  (`resultPanel.dataset.share`)에도 `나는 {persona}! ...` 형태로 포함.
- **새 통계·근거 없이 기존 등급 경계를 그대로 재사용한 것** — 새 사용자 데이터나 실제 백분위를
  발명하지 않았다. 새 테스트에 이 패턴을 넣을 때도 반드시 기존 grade 경계를 재사용하고,
  근거 없는 퍼센타일을 새로 지어내지 말 것.

## 7. 테스트 간 크로스링크 패턴 (2026-08-21 추가)

**테스트 48페이지 전부**에 결과 화면 하단, `btn-row` 앞에 다른 테스트 4개로 가는 링크 블록이
있음(자기 자신은 제외, 카테고리가 비슷한 테스트 위주로 선정):

```html
<div class="other-tests">
  <div class="label">다른 능력 테스트도 해보세요</div>
  <div class="other-tests-links">
    <a href="/{lang}/tests/{other-slug}">{emoji} {테스트명}</a>
    <!-- 4개 -->
  </div>
</div>
```

CSS(`.other-tests`, `.other-tests-links`)는 공용 스타일시트가 아니라 **각 페이지 상단의 로컬
`<style>` 블록에 개별 삽입**되어 있다 (공용 `/skill-test/style.css`에는 없음). 새 테스트
추가 시 이 CSS 블록과 링크 4개를 반드시 같이 넣을 것 — 안 넣으면 그 페이지만 크로스링크가
없는 상태로 고립된다.

## 8. 신규 테스트 추가 시 반드시 같이 수정해야 하는 파일

- `/ko/index.html` (+ `/en/index.html`, `/ja/index.html`, `/zh/index.html`) — `.hub-grid`에
  `.game-card` 링크 추가. **이곳이 사이트에서 유일한 게임 목록이다.**
- `/sitemap.xml` — 언어별 URL 4건 + 각 URL 안의 `xhtml:link` 상호참조 5개(x-default 포함)씩
  추가 + `<lastmod>`(실제 파일 최종 커밋일, `git log -1 --format=%aI -- <path>`로 조회 —
  빌드 시각이나 오늘 날짜를 임의로 넣지 말 것).
- `robots.txt`는 수정 불필요 (`Allow: /`로 전체 허용).
- `_redirects`는 **새 테스트에는 수정 불필요** (구 URL이 애초에 없으므로 리다이렉트할 대상이
  없음). 기존 테스트의 slug를 바꾸는 경우에만 새 규칙을 추가할 것.
- 기존 테스트 13개 각각의 `.other-tests-links`에 새 테스트로 가는 링크를 추가할지는 선택사항
  (전부 다 추가하면 48개 파일을 다 고쳐야 하므로, 카테고리가 겹치는 소수 테스트에만 추가하는
  것을 권장).

---

## 신규 테스트 페이지 최소 템플릿

`slug`, `{...}` 표시된 부분만 채우면 되는 골격. `click-speed.html` 구조 기준(OG/JSON-LD/
other-tests 포함, 최신).

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{테스트명} | 능력 테스트</title>
<meta name="description" content="{한 문장 훅}. 무료 {테스트명} 테스트.">
<link rel="canonical" href="https://myabilitytest.com/ko/tests/{slug}">
<link rel="alternate" hreflang="ko" href="https://myabilitytest.com/ko/tests/{slug}">
<link rel="alternate" hreflang="en" href="https://myabilitytest.com/en/tests/{slug}">
<link rel="alternate" hreflang="ja" href="https://myabilitytest.com/ja/tests/{slug}">
<link rel="alternate" hreflang="zh-Hant" href="https://myabilitytest.com/zh/tests/{slug}">
<link rel="alternate" hreflang="x-default" href="https://myabilitytest.com/en/tests/{slug}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MyAbilityTest">
<meta property="og:title" content="{테스트명} | 능력 테스트">
<meta property="og:description" content="{한 문장 훅}. 무료 {테스트명} 테스트.">
<meta property="og:url" content="https://myabilitytest.com/ko/tests/{slug}">
<meta property="og:image" content="https://myabilitytest.com/og-default.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{테스트명} | 능력 테스트">
<meta name="twitter:description" content="{한 문장 훅}. 무료 {테스트명} 테스트.">
<meta name="twitter:image" content="https://myabilitytest.com/og-default.png">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"https://myabilitytest.com/#organization","name":"MyAbilityTest","url":"https://myabilitytest.com/","logo":{"@type":"ImageObject","url":"https://myabilitytest.com/og-default.png","width":1200,"height":630}},
{"@type":"WebSite","@id":"https://myabilitytest.com/#website","name":"MyAbilityTest","url":"https://myabilitytest.com/","inLanguage":["ko","en","ja","zh-Hant"],"publisher":{"@id":"https://myabilitytest.com/#organization"}},
{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://myabilitytest.com/ko/"},{"@type":"ListItem","position":2,"name":"{테스트명} | 능력 테스트","item":"https://myabilitytest.com/ko/tests/{slug}"}]},
{"@type":"WebApplication","name":"{테스트명} | 능력 테스트","url":"https://myabilitytest.com/ko/tests/{slug}","applicationCategory":"GameApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"inLanguage":"ko"}
]}
</script>
<style>
  .other-tests { margin-top: 16px; }
  .other-tests .label { text-align: center; font-size: 12px; color: var(--text-dim); margin-bottom: 8px; }
  .other-tests-links { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .other-tests-links a {
    font-size: 12px;
    color: #cbd5e1;
    text-decoration: none;
    background: var(--card-bg-2);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    padding: 6px 12px;
  }
  .other-tests-links a:hover { border-color: var(--accent); color: #fff; }
</style>
<link rel="stylesheet" href="/skill-test/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7993734713843733" crossorigin="anonymous"></script>
</head>
<body>
  <div class="wrap">
    <a class="back-link" href="/ko/">← 메인으로</a>
    <div class="lang-switch">
      <a class="active" href="/ko/tests/{slug}">한국어</a>
      <a href="/en/tests/{slug}">English</a>
      <a href="/ja/tests/{slug}">日本語</a>
      <a href="/zh/tests/{slug}">中文</a>
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
      <div class="other-tests">
        <div class="label">다른 능력 테스트도 해보세요</div>
        <div class="other-tests-links">
          <a href="/ko/tests/{other-slug-1}">{emoji} {테스트명1}</a>
          <a href="/ko/tests/{other-slug-2}">{emoji} {테스트명2}</a>
          <a href="/ko/tests/{other-slug-3}">{emoji} {테스트명3}</a>
          <a href="/ko/tests/{other-slug-4}">{emoji} {테스트명4}</a>
        </div>
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
    shareResult((document.getElementById('resultPanel').dataset.share || '') + location.href);
  });

  renderStats();
  renderTopLeaderboard(loadStats(LB_KEY, []));
</script>
</body>
</html>
```

새 테스트를 만들 때 위 템플릿을 채운 뒤 반드시 4개 언어(ko/en/ja/zh) 전부 작성하고,
8번 항목의 파일들(허브 4개 + sitemap.xml)을 같이 갱신할 것. 한국어판에만 6번(persona 라벨)을
추가로 적용할지는 선택사항.

---

## 9. 능력 테스트 / 하드웨어 테스트 구분 (2026-09-02 추가)

허브(`/{lang}/index.html`)는 카드를 두 섹션으로 나눈다.

```html
<div class="hub-section"><h2>능력 테스트</h2><span class="note">…</span></div>
<div class="hub-grid"> … 능력 테스트 카드 12개 … </div>

<div class="hub-section"><h2>하드웨어 테스트</h2><span class="note">…</span></div>
<div class="hub-grid"> … 하드웨어 카드 3개 … </div>
```

- **능력 테스트(12개)**: 사람의 능력을 재고 등급·기록이 남는 것.
  `reaction-time` `visual-memory` `click-speed` `time-stop` `time-perception`
  `hearing-age` `dynamic-vision` `chimp-test` `aim-trainer` `spacebar-counter`
  `apm` `mouse-accuracy`
- **하드웨어 테스트(3개)**: 기기가 제대로 동작하는지 점검하는 것. 등급·리더보드 없음.
  `monitor-hz` `mouse-tester` `keyboard-tester`
- `.hub-section` 스타일은 **두 CSS 파일 모두**에 있어야 한다 (`/style.css`, `/skill-test/style.css`).
  허브는 `/style.css`를 쓰므로 `skill-test` 쪽에만 넣으면 적용되지 않는다. 실제로 이 실수가 났다.

## 10. 모드/설정이 있는 테스트의 저장 키 규칙 (2026-09-02 추가)

여러 모드·설정을 가진 테스트는 **설정마다 기록을 분리**하되, **원래 기본값은 기존 키를 그대로 쓴다.**
그래야 개편 전 사용자의 기록이 사라지지 않는다.

```js
// 예: visual-memory
const LB_KEYS = { classic: 'skillMemoryLeaderboardV1',  // 기존 키 유지
                  g4: 'skillMemoryLbG4V1', g5: '…', g6: '…' };
// 예: reaction-time
function lbKey() { return range.key === 'normal' ? 'reactionLeaderboardV1'
                                                 : 'reactionLeaderboardV1_' + range.key; }
```

- 삭제한 테스트를 모드로 흡수할 때도 같은 규칙을 쓴다 — 지터 클릭은 `click-speed`의 모드가
  되면서 `skillJitterClickLeaderboardV1` 키를 그대로 이어받았다.
- **백분위·분포는 표준 조건에서만 표시한다.** `RT_CURVE`는 단순 반응 + 보통 대기 시간 기준으로
  만든 곡선이라, 다른 모드나 다른 대기 범위에서는 숫자를 만들어내지 말고 안내 문구로 대체한다.

## 11. 패드 안 실시간 HUD (2026-09-02 추가)

연타형 테스트(`click-speed` `spacebar-counter` `apm`)는 진행 중 수치를 **패드 안에** 크게 띄운다.
시선이 클릭 영역을 벗어나지 않게 하기 위함이다.

```js
function setPad(main, sub, live) { /* .pad-main(+.live) / .pad-sub 두 div를 패드에 넣는다 */ }
```

CSS는 `/skill-test/style.css`의 `.click-pad, .space-pad, .apm-pad` 규칙 하나로 3종을 함께 처리한다.

## 12. 4개 언어 일괄 수정 시 주의 (2026-09-02 추가)

이번 작업에서 실제로 터진 함정들. 반복하지 말 것.

- **`python3`는 Windows 스토어 스텁**이라 동작하지 않는다. JSON/정규식 처리는 PowerShell을 쓴다.
- **PowerShell 5.1은 BOM 없는 UTF-8 `.ps1`을 ANSI로 읽는다.** 스크립트는 반드시 UTF-8 **BOM 포함**으로
  저장할 것. 안 그러면 한글·일본어·중국어 리터럴이 전부 깨져 파싱 에러가 난다.
- **PowerShell 큰따옴표 here-string은 JS 템플릿 변수 `${x}`를 변수 참조로 삼켜 빈 문자열로 만든다.**
  `${m.key}` 같은 걸 넣어야 하면 `@@PLACEHOLDER@@`로 넣고 마지막에 `.Replace()`로 복원한다.
  (실제로 업적 id가 전부 `_`가 되고 랭크 제목이 비는 사고가 났다.)
- **`perl -0pi -e`에 비ASCII 치환문을 쓰면 파일이 이중 인코딩된다** ("Wide character" 경고가 신호).
  치환 대상·치환 문자열이 모두 ASCII일 때만 perl을 쓰고, 아니면 PowerShell + `UTF8Encoding($false)`를 쓴다.
- 일괄 수정 후에는 항상 **4개 언어 전부** 문법(`new Function`) + JSON-LD + `getElementById` 대상 존재 +
  깨진 인코딩(`Ã|â€|ã‚|æ¥`)을 검사할 것.

---

## 13. 디자인 시스템 전면 교체 (2026-09-03)

사용자가 제공한 재설계 시안(`MyAbilityTest 홈페이지 재설계.zip`, Claude Design 캔버스 아트보드)에 맞춰
**다크 테마 → 에디토리얼 라이트 테마**로 전면 교체했다.

### 토큰 (두 CSS 파일 모두 동일한 `:root`) — 2026-09-03 다크로 전환

| 역할 | 값 |
|---|---|
| 배경 | `--bg #131418` (따뜻한 근접 블랙) |
| 카드 | `--card-bg #1b1c21` / `--card-bg-2 #232429` |
| 글자 | `--ink #f1efe8` / `--body #b5b1a8` / `--muted #918d85` |
| 선 | `--line #2c2d33` / `--line-strong #4a4b53` |
| 강조 | `--accent #e05a37` (테라코타) |
| 의미색 | `--good #35a35a` / `--danger #e0524f` / `--gold #cf9433` |

**테마가 뒤집힐 때 깨지는 자리는 전용 토큰으로 분리해 두었다.**
`--header-bg` `--footer-bg` `--footer-fg` `--footer-muted` `--footer-link` `--footer-line`
`--pad-wait-bg` `--pad-wait-fg` `--on-accent`

푸터가 `background: var(--ink)` 를 쓰고 있어서 그대로 두면 다크에서 크림색으로 반전됐다.
같은 이유로 미리보기 패드의 대기 상태도 따로 뺐다.

**테라코타 위 글자는 `--on-accent`(#17181c, 어두운 색)를 쓴다.**
흰 글자는 대비 3.7:1로 AA 미달이고, 어두운 글자면 5.0:1이 된다.
`.btn.share` `.ach.got` `.rung.current` `.grade-table tr.current-row` `.tier-strip .tier.on`
`.preview-pad[data-phase="go"]` `.state-go` 가 모두 여기 해당한다.

> 2026-09-03 이전에는 크림 배경(`#f4f2ec`) + 잉크 글자(`#17181c`)의 라이트 테마였다.
> 구조·타이포·아이콘은 그대로이고 팔레트만 뒤집은 것이므로, 되돌릴 일이 생기면
> `:root` 블록과 위의 전용 토큰만 원래 값으로 돌리면 된다.

- 폰트: **Noto Sans KR**(400/500/700/900) + **JetBrains Mono**(500/700). 모든 페이지가
  Google Fonts를 `<link>`로 불러온다.
- **숫자는 모노**(`var(--mono)` + `tabular-nums`), **문장은 산세리프**.
  긴 한국어/일본어 문장에 모노를 쓰면 자간이 벌어져 어색하므로,
  `.stage .big`과 `.preview-pad .pv-big`처럼 문장도 들어가는 자리는 산세리프 + `tabular-nums`로 둔다.
- 모서리는 `--radius 6px`(카드) / `999px`(버튼·칩). 예전의 16~20px 라운드는 쓰지 않는다.

### 페이지 뼈대 (허브·테스트·privacy 공통)

```html
<body>
  <header class="site-header"> 로고 · nav(능력12/하드웨어03/내 기록) · KO EN JA ZH </header>
  <div class="wrap">
    <nav class="breadcrumb"> 홈 / 분류 / 테스트명 <span class="idx">NN / 15</span> </nav>
    … 본문 …
  </div>
  <footer class="site-footer">
    <div class="footer-inner"> 브랜드 소개 + 3열 사이트맵 </div>
    <div class="footer-bottom"> © · 개인정보처리방침 · 언어 </div>
  </footer>
</body>
```

- `.wrap`은 `max-width: 940px`. 헤더/푸터는 `.wrap` **밖**에 둔다.
- 허브에만 추가로 `.hero`(좌 카피 + 우 `.preview-card` 반응속도 미리보기)와
  `.record-strip`(내 기록 4칸), `.test-list > .test-row`(카드 대신 목록 행)가 있다.
- **허브 히어로의 미리보기는 장식이 아니다** — `reactionStatsV2` / `reactionLeaderboardV1`,
  즉 반응속도 테스트와 **같은 저장소 키**에 기록을 남긴다. 여기서 잰 기록이 테스트 페이지에도 반영된다.

### 이 교체에서 실제로 겪은 함정

- **CSS 파일이 두 벌**이라는 걸 잊지 말 것. 허브는 `/style.css`, 테스트는 `/skill-test/style.css`.
  둘은 지금 같은 내용이며(허브 전용 `.hero` 계열만 `/style.css`에 더 있음), 토큰을 고칠 때는 **양쪽 다** 고쳐야 한다.
- **`reaction-time.html`은 예외적으로 자체 CSS 346줄을 갖고 있었다.** 공용 시트를 링크하지 않아
  일괄 치환에서 빠졌다. 지금은 공용 시트 + 전용 규칙(무대·신호등·점·히스토그램)만 남겼다.
- **색상은 CSS에만 있는 게 아니다.** SVG `fill`/`stroke`(반응속도 히스토그램, 에임, 동체시력)와
  캔버스 `strokeStyle`(CPS 그래프)에도 하드코딩돼 있다. 인라인 `<style>`만 치환하면 이것들이 남는다.
- **HTML에서 이름을 뽑을 때 중첩 `<span>` 주의.** `<span class="rt-name">이름<span class="badge">인기</span></span>`에서
  `([\s\S]*?)</span>`로 잡으면 배지 여는 태그까지 딸려온다. 실제로 배지 마크업이 escape된 채
  빵부스러기·푸터 192곳에 박혔다. 이름을 뽑을 땐 첫 `<` 이후를 잘라내는 편이 안전하다.
- 대비 검사를 자동화할 때 **`rgba()`의 알파를 반영하지 않으면 오탐**이 난다.
  `rgba(185,28,28,0.08)` 배경을 진한 빨강으로 읽어 "대비 부족"이라고 잘못 보고했다.

## 14. 아이콘 — 이모지 금지 (2026-09-03)

재설계 시안에는 **이모지가 하나도 없다.** 테스트를 가리키는 그림은 전부
24×24 라인 아이콘(테라코타 `currentColor`, `stroke-width: 1.7`)이다.

- 아이콘 패스는 `/skill-test/icons.js`의 `TEST_ICONS`에 슬러그별로 모아 뒀다.
  정적 HTML에 직접 박아 넣을 때는 아래 형태를 쓴다.

```html
<svg class="ticon" viewBox="0 0 24 24" width="26" height="26" fill="none"
     stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true" focusable="false"><path d="…"></path></svg>
```

- 크기 관례: 허브 목록 행 26px, 관련 링크 20px, 결과 패널 44px.
- **넣지 말 것**: 제목(`<h1>`) 앞 이모지, 섹션 제목의 🏆/🏅/🕒,
  결과 문구의 🎉, 페르소나 라벨의 이모지, 순위표 메달 🥇🥈🥉
  (순위는 `String(i+1).padStart(2,'0')` — `common.js`가 처리한다).
- **남겨야 하는 기능 기호**: 키보드 테스트의 키 라벨(`⌫ ⌨ ← ↑ → ↓`),
  별점(`★ ☆`), 정답·오답 표시(`✓ ✕`), 침팬지 테스트 목숨(`❤️ 🤍`), 공유 문구의 `→`.
  이것들은 장식이 아니라 화면에서 의미를 나르므로 일괄 제거 스크립트에서 반드시 예외 처리할 것.

**주의 — 이모지를 일괄 제거할 때 공백까지 건드리지 말 것.**
이번에 `>(\s)+([가-힣…])` 같은 규칙으로 태그 경계 공백을 지웠다가
`<span>0</span> 시도` 가 `<span>0</span>시도` 로 붙어버렸고,
`'a' + 'b'` 가 `'a' +'b'` 로 바뀌었다(문법은 유효하지만 diff가 지저분해진다).
공백 정리는 **따옴표 문자열 내부**로 한정하고, 태그 사이 공백은 손대지 않는다.

## 15. 애널리틱스 (2026-09-03)

Google Analytics 4, 측정 ID `G-VKKRHCN307`.

- **ID는 `/skill-test/analytics.js` 맨 위 한 줄에만 있다.** 68개 페이지가 이 파일을 공유하므로
  ID를 바꿀 일이 생기면 그 한 줄만 고치면 된다. 자리표시자(`G-XXXXXXXXXX`)면 아무 요청도 보내지 않는다.
- 모든 페이지 `<head>`에 `<script src="/skill-test/analytics.js" defer>`로 연결돼 있다.

### 이벤트

| 이벤트 | 언제 |
|---|---|
| `test_start` | 플레이 영역을 처음 건드렸을 때 (페이지당 1회) |
| `test_complete` | 결과가 나왔을 때 |
| `test_mode_change` | 모드 탭을 눌렀을 때 |

파라미터: `test_slug` `test_lang` `test_mode` `test_option` `test_grade` `play_index` `verdict`

### 완료를 감지하는 방법 — 60개 파일을 고치지 않았다

테스트마다 게임 로직이 제각각이라 개별 계측 대신 **공용 클래스를 MutationObserver로 감시**한다.

1. `#resultPanel`에 `.show`가 붙는 순간 — 능력 테스트 11종
2. `#stage` 안에 `.summary`가 나타나는 순간 — 반응 속도
3. `#hzVerdict` `#chatterVerdict` `#kroVerdict`의 **문구가 초기값에서 달라지는** 순간 — 하드웨어 3종
   (마우스 테스터는 처음부터 안내 문구가 들어 있어서 '비어있음→채워짐'으로는 안 잡힌다)

**새 테스트를 추가할 때** 위 셋 중 하나의 관례만 따르면 계측이 자동으로 붙는다.
`.duration-select` 버튼에 최고기록 라벨(`.d-best`)을 넣는 경우, `test_option`이 그걸 같이 읽지 않도록
`data-d` 같은 속성을 주거나 값 span을 `.d-best`가 아닌 클래스로 둘 것.

### 보내지 않는 것

**점수·순위 기록은 애널리틱스로 보내지 않는다.** 등급(`test_grade`)만 보내고 원점수는 localStorage에만 남긴다.
개인정보처리방침 4개 언어 3번 항목 뒤에 GA4 사용·쿠키·옵트아웃 방법을 명시해 두었다.

## 16. 다크 전환에서 배운 것 (2026-09-03)

- **색은 CSS에만 있지 않다.** SVG `fill`/`stroke`(반응속도 히스토그램·에임·동체시력·마우스 경로)와
  캔버스 `strokeStyle`(CPS 그래프)도 같이 뒤집어야 한다. 인라인 `<style>`만 고치면 이것들이 남는다.
- **`color: var(--bg)` 같은 "반대색" 참조를 조심할 것.** 테마를 뒤집으면 의미도 같이 뒤집힌다.
  반응속도의 `.state-wait { color: var(--bg) }` 는 다크에서 배경과 같은 색이 되어 글자가 사라졌다.
- **오프스크린 iframe에서 `getComputedStyle`로 전환 색을 재면 값이 안 움직인다.**
  `transition: background …` 이 걸린 요소는 렌더링이 스로틀되는 프레임에서 애니메이션이 진행되지 않아
  항상 시작값을 돌려준다. 측정 전에 `el.style.transition = 'none'` 을 넣을 것.
  (`!important` 리터럴 색조차 반영 안 돼서 CSS 버그로 오인했다.)
- 대비 검사는 **알파를 합성해서** 계산해야 한다. `rgba(224,90,55,0.16)` 배경을 불투명 테라코타로 읽으면
  멀쩡한 곳을 미달로 잡는다.

## 17. 테스트 가이드 상자 (2026-09-04)

모든 테스트 페이지의 설명은 `<section class="info">` 대신 페이지 맨 아래 **가이드 상자 5개**로 통일했다.

```html
<div class="guide">                      <!-- 본문의 70% 폭, 위 여백 300px (모바일 100% / 150px) -->
  <div class="section-head"><h2>[테스트명] 가이드</h2></div>   <!-- 부제 없음 -->
  <div class="guide-grid">               <!-- 2열, 모바일 1열 -->
    <div class="guide-box">1 ○○이란?</div>
    <div class="guide-box">2 평균은 어느 정도인가요? 좋은 점수는?</div>
    <div class="guide-box">3 결과 해석표</div>
    <div class="guide-box">4 정확하게 측정하는 방법</div>
    <div class="guide-box wide">5 실력을 높일 수 있나요?</div>   <!-- 가로 전체 -->
  </div>
</div>
```

- 하드웨어 테스트(모니터·마우스·키보드)는 2번이 "결과가 이상하게 나오는 이유", 5번이 "문제가 있을 때"에 해당하는 기존 섹션을 쓴다.
- **FAQ 상자와 FAQPage 스키마는 쓰지 않는다.** 화면에 없는 FAQ 스키마만 남기면 구글이 불일치로 리치 결과를 빼므로, 둘 다 없는 상태로 통일했다 (참고 문헌 줄도 뺐다).
- **'평균' 상자는 통계를 지어내지 않는다.** 근거 있는 값(반응속도 중앙값 273ms, 스타크래프트 프로 APM 300~400, 아유무 9개)만 숫자로 쓰고, 나머지는 "이 사이트 기준으로 ○○ 구간이 평균"처럼 등급표를 인용하며 자체 기준임을 밝힌다.
- 생성기: 스크래치의 `guides.js`(14개) / `rt_guide.js`(반응속도). 기존 섹션은 언어별 순서가 같아 **인덱스로 재배치**했고, 빠진 슬롯만 새로 썼다. 다시 돌려도 되게 `.guide` 블록을 통째로 교체한다.
- **허브 이름을 제목에 쓸 때 배지 마크업 주의.** `titlesFor()`가 '인기' 배지 달린 테스트 이름에 `<span class="badge">인기`를 딸려 보낸다(중첩 span 파싱 한계). 제목으로 쓸 땐 `split('<')[0]`로 잘라낼 것 — 이번에 8개 파일 h2에 태그가 들어갔다가 잡았다.
- **셸 `-e` 안에 정규식 이스케이프를 넣지 말 것.** `\s\S`가 `sS`로 깎여 `/<[sS]*$/`가 되는 사고가 났다. 정규식이 필요하면 파일에 쓰고 실행한다.

미해결: 허브 목록의 "평균" 열(CPS 6.8, 에임 612ms 등)은 디자인 시안에서 온 값으로 근거가 없다. 반응속도 273ms만 실제 집계값. 사용자 확인 후 자체 등급 기준 구간으로 바꾸거나 열을 없앨 것.

## 18. 최근 기록 상자 확장 (2026-09-04)

능력 테스트 12종 모두 '기록 순위'와 '최근 기록' 두 상자를 갖는다 (하드웨어 3종 제외: 모니터는 최근 측정만, 마우스·키보드는 판정만).
새로 붙인 8종은 스크래치 `add_recent.js`로 생성했다 — 행 문구는 각 언어 파일의 순위표 포맷터에서 `${dateStr}`만 떼어 재사용하므로 새 번역이 없다.

**`addRecentRecord(key, entry)`는 내부에서 `key + '_recent'`에 저장한다.** 호출할 때 기본 키(`LB_KEY`)를 넘기고,
읽을 때만 `loadStats(LB_KEY + '_recent')`를 쓴다. 이미 `_recent`가 붙은 키를 넘기면 `…_recent_recent`에 저장돼 화면이 영원히 비어 있는데,
심어놓은 데이터로 하는 렌더 검사는 읽는 쪽 키에 직접 넣기 때문에 이 불일치를 잡지 못한다 — **저장 경로는 반드시 실제 결과를 내서 검증할 것.**

## 19. 저장 형식이 바뀌면 렌더러는 옛 항목을 견뎌야 한다
- 순위/최근 기록은 localStorage 에 그대로 남으므로, 새 필드를 추가해 저장하기 시작해도 옛 항목엔 그 필드가 없다. `entry.x.toFixed()` 처럼 필드를 무조건 쓰면 페이지 로드 시 Uncaught TypeError (에임: 09-02 이전 기록 사용자 전원 영향, 04a6cf5 에서 수정).
- 숫자 필드는 `fmtNum(entry.x, 자릿수)` (common.js, 숫자 아니면 '–') 로 그린다. 새 필드를 넣을 때 렌더러도 같이 방어할 것.
- 마크업 배치 스크립트는 "삽입 후 조상 검사" 로 끝낸다: 삽입한 요소가 `#resultPanel`/`#playScreen`/`display:none` 안에 들어가지 않았는지 DOMParser 로 60페이지 확인 (ko/chimp-test 의 `>` 누락이 그렇게 잡혔다).

## 20. 플레이 영역은 `.stage` 상자 하나에 (2026-09-04)
- 15개 테스트 모두 시작 화면·HUD(level-card)·패드/격자를 `<div class="stage">` 하나로 감싼다. 모드 버튼(.mode-select/.mode-hint/.duration-select)과 설명(.info-box)은 상자 밖, 결과(#resultPanel)·통계·기록도 밖.
- 스타일은 skill-test/style.css 의 `.stage`(공용). 반응속도만 페이지 안에서 상태별 배경(state-go 등)을 덧입힌다. 상자 안 level-card/note-box 는 배경·테두리를 없애 상자 속 상자를 피한다.
- 새 테스트를 만들 때도 같은 구조로. 일괄 감싸기 스크립트: 스크래치 stage_wrap.js (첫 블록~마지막 블록 지정, 4칸 들여쓰기 최상위 요소 기준).

## 21. 16개 언어 구조와 번역 파이프라인 (2026-09-05)
- 로케일 16개: en es fr de pt(pt-BR) pl it ko ja vi id tr uk zh(zh-Hans) tw(zh-Hant) th. 로케일당 17페이지(허브·privacy·테스트 15) = 272페이지.
- zh 는 내용이 간체인데 hreflang 이 zh-Hant 로 잘못 달려 있던 것을 zh-Hans 로 바로잡고, 번체는 tw 로 새로 만들었다.
- 헤더 언어 전환은 `<details class="langs">` 드롭다운(16개, 같은 페이지의 다른 언어로 연결). CSS 는 두 스타일시트의 `.langs`/`.lang-pop`.
- 새 언어 추가/수정은 스크래치의 파이프라인으로: `locales.js`(로케일 표) → `i18n_lib.js`(en/ja/zh 를 LCS 로 맞춰 번역 슬롯만 추출) → `tr_<dir>.N.json`(슬롯번호→번역, 여러 조각 병합, 뒤 번호가 우선) → `build_locale.js`(en 에서 생성 + 경로/언어 치환) → `chrome.js`(lang·canonical·hreflang·og·전환기) → `sitemap.js`.
- 번역값이 배열이면 `[["찾을 말","바꿀 말"], ...]` 로 해석해 긴 HTML/템플릿 문자열의 보이는 말만 갈아끼운다.
- **삽입 시 이스케이프 필수**: 프랑스어 `l'écran` 같은 아포스트로피가 작은따옴표 JS 문자열을 깨뜨렸다. `escapeFor()` 가 ' " 문자열은 구분자만(이미 \ 로 막힌 것은 제외) 이스케이프하고, 백틱 문자열은 손대지 않는다(안의 백틱은 `${}` 속 중첩 템플릿이라 이미 올바름). 텍스트/속성은 & < " 를 엔티티로.
- 새 언어를 만들면 반드시 272페이지 정적 검사: div 열림/닫힘, hreflang 17줄, 각 `<script>` 를 `new Function` 으로 파싱.
