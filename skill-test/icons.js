/* 테스트 아이콘 — 재설계 시안의 24x24 라인 아이콘 세트.
   이모지 대신 이걸 쓴다. 색은 currentColor를 따르므로 부모에서 지정한다. */
window.TEST_ICONS = {
  'reaction-time':    'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  'visual-memory':    'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  'click-speed':      'M8 3h8a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 3v7',
  'time-stop':        'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 7v5h4',
  'time-perception':  'M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9',
  'hearing-age':      'M4 9v6M8 6v12M12 3v18M16 6v12M20 9v6',
  'dynamic-vision':   'M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7s-7-2-10-7zM9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  'chimp-test':       'M3 14h6v6H3zM9 8h6v6H9zM15 3h6v6h-6z',
  'aim-trainer':      'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 2v4M12 18v4M2 12h4M18 12h4',
  'spacebar-counter': 'M3 9h18v6H3zM7 12h10',
  'apm':              'M4 20V10M10 20V4M16 20V13M22 20V8',
  'mouse-accuracy':   'M3 17c3 0 3-10 6-10s3 10 6 10 3-10 6-10',
  'monitor-hz':       'M3 4h18v12H3zM8 20h8M12 16v4',
  'mouse-tester':     'M12 3a6 6 0 0 1 6 6v6a6 6 0 0 1-12 0V9a6 6 0 0 1 6-6zM12 3v7M6 10h12',
  'keyboard-tester':  'M2 6h20v12H2zM6 10h1M10 10h1M14 10h1M18 10h1M7 14h10'
};

/* 슬러그로 SVG 마크업을 만든다. size는 픽셀. */
window.testIcon = function (slug, size) {
  var d = window.TEST_ICONS[slug];
  if (!d) return '';
  var s = size || 24;
  return '<svg class="ticon" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" ' +
    'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true" focusable="false"><path d="' + d + '"></path></svg>';
};
