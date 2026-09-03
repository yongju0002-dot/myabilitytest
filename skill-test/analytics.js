/* ==========================================================================
   GA4 애널리틱스 — 측정 ID는 아래 한 줄만 바꾸면 사이트 전체에 적용된다.
   GA4 관리 > 데이터 스트림 > 웹 에서 'G-'로 시작하는 측정 ID를 복사해 넣을 것.
   비워 두면(G-XXXXXXXXXX 그대로면) 아무것도 로드하지 않으므로 안전하다.
   ========================================================================== */
(function () {
  'use strict';

  var GA_ID = 'G-VKKRHCN307';   // ← 여기만 교체

  // 아직 ID를 안 넣었으면 조용히 끝낸다 (네트워크 요청 0)
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;

  // ---- gtag 로드 ----
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // ---- 여기부터는 테스트 페이지에서만 ----
  var m = location.pathname.match(/^\/([a-z]{2})\/tests\/([a-z0-9-]+)/);
  if (!m) return;
  var lang = m[1], slug = m[2];

  // 현재 선택된 모드·설정을 읽는다 (모든 테스트가 같은 클래스를 쓴다)
  function context() {
    var mode = document.querySelector('#modeSelect button.active');
    var opt = document.querySelector(
      '#durationSelect button.active, #rangeSelect button.active, ' +
      '#sizeSelect button.active, .round-select button.active'
    );
    var p = { test_slug: slug, test_lang: lang };
    if (mode) p.test_mode = mode.dataset.mode || mode.textContent.trim().slice(0, 24);
    if (opt) {
      // 버튼 안의 최고기록 라벨(.d-best)은 빼고 값만 남긴다
      var label = opt.querySelector(':scope > span:not(.d-best)');
      p.test_option = opt.dataset.d || opt.dataset.duration || opt.dataset.range ||
                      opt.dataset.size || opt.dataset.rounds ||
                      (label ? label.textContent : opt.textContent).trim().slice(0, 24);
    }
    return p;
  }

  // 결과에서 등급을 뽑는다. 없으면 생략한다 (억지로 만들지 않는다)
  function grade() {
    var row = document.querySelector('.grade-table tr.current-row td');
    if (row) return row.textContent.trim().slice(0, 24);
    var g = document.querySelector('#stage .summary .grade');
    if (g) return g.textContent.trim().slice(0, 40);
    return null;
  }

  var started = false, plays = 0;

  function sendStart() {
    if (started) return;
    started = true;
    gtag('event', 'test_start', context());
  }

  function sendComplete(extra) {
    sendStart();
    plays += 1;
    var p = context();
    p.play_index = plays;
    var g = grade();
    if (g) p.test_grade = g;
    if (extra) for (var k in extra) if (extra[k] != null) p[k] = extra[k];
    gtag('event', 'test_complete', p);
  }

  // ---- 시작: 플레이 영역 첫 상호작용 ----
  var PLAY = [
    '.click-pad', '.space-pad', '.apm-pad', '.stage', '.stage-zone', '.memory-grid',
    '.timer-orb', '.aim-box', '.pick-grid', '.choice-grid', '.mouse-stage', '.kb',
    '#startBtn', '.btn'
  ].join(',');

  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest(PLAY)) sendStart();
  }, { capture: true, passive: true });

  document.addEventListener('keydown', function (e) {
    // 스페이스바·APM·키보드 테스트는 키 입력이 곧 시작이다
    if (e.key === ' ' || e.code === 'Space' || slug === 'apm' || slug === 'keyboard-tester') sendStart();
  }, { capture: true, passive: true });

  // ---- 모드 전환 ----
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#modeSelect button');
    if (!b) return;
    gtag('event', 'test_mode_change', {
      test_slug: slug, test_lang: lang,
      test_mode: b.dataset.mode || b.textContent.trim().slice(0, 24)
    });
  }, { capture: true, passive: true });

  // ---- 완료 감지 ----
  function watch() {
    // (1) 대부분의 테스트: #resultPanel 에 .show 가 붙는 순간
    var rp = document.getElementById('resultPanel');
    if (rp) {
      var wasShown = rp.classList.contains('show');
      new MutationObserver(function () {
        var now = rp.classList.contains('show');
        if (now && !wasShown) sendComplete();
        wasShown = now;
      }).observe(rp, { attributes: true, attributeFilter: ['class'] });
    }

    // (2) 반응 속도: #stage 안에 .summary 가 나타나는 순간
    var stage = document.getElementById('stage');
    if (stage) {
      var hadSummary = !!stage.querySelector('.summary');
      new MutationObserver(function () {
        var now = !!stage.querySelector('.summary');
        if (now && !hadSummary) sendComplete();
        hadSummary = now;
      }).observe(stage, { childList: true, subtree: true });
    }

    // (3) 하드웨어 테스트: 판정 문구가 최초 안내에서 실제 결과로 바뀌는 순간.
    //     처음부터 안내 문구가 들어 있는 경우가 있어 '비어있음→채워짐'이 아니라
    //     '초기값과 달라짐'으로 잡는다.
    ['hzVerdict', 'chatterVerdict', 'kroVerdict'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var initial = el.textContent.trim();
      var fired = false;
      new MutationObserver(function () {
        if (fired) return;
        var now = el.textContent.trim();
        if (now && now !== initial) {
          fired = true;
          sendComplete({ verdict: now.slice(0, 60) });
        }
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch);
  } else {
    watch();
  }
})();
