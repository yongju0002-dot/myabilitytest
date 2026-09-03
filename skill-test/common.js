// Shared helpers for the 운 테스트 (luck test) mini-games.

function weightedPick(tiers) {
  // tiers: [{ key, label, prob }] where prob values sum to ~1
  const r = Math.random();
  let acc = 0;
  for (const t of tiers) {
    acc += t.prob;
    if (r < acc) return t;
  }
  return tiers[tiers.length - 1];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
}

const COPY_TOAST = {
  ko: '결과가 복사되었습니다',
  en: 'Result copied',
  ja: '結果をコピーしました',
  zh: '结果已复制',
};

function shareResult(text) {
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
    return;
  }
  const lang = (document.documentElement.lang || 'ko').split('-')[0];
  const copiedMsg = COPY_TOAST[lang] || COPY_TOAST.ko;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(copiedMsg)).catch(() => showToast(text));
  } else {
    showToast(text);
  }
}

function loadStats(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') || fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStats(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

function addToLeaderboard(key, entry, betterIsLower, max = 30) {
  let list = loadStats(key, []);
  list.push(entry);
  list.sort((a, b) => betterIsLower ? a.value - b.value : b.value - a.value);
  list = list.slice(0, max);
  saveStats(key, list);
  return list;
}

function renderLeaderboard(containerId, list, formatRow, emptyText) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!list || !list.length) {
    el.innerHTML = `<p style="text-align:center;color:var(--text-dim);font-size:13px;">${emptyText}</p>`;
    return;
  }
  el.innerHTML = '<ul class="leaderboard">' + list.map((entry, i) => {
    const medal = String(i + 1).padStart(2, '0');
    return `<li class="${i === 0 ? 'winner' : ''}"><span class="rank">${medal}</span>${formatRow(entry, i)}</li>`;
  }).join('') + '</ul>';
}

let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playTone(freq, duration = 0.15, delay = 0, type = 'sine', volume = 0.25) {
  const ctx = getAudioCtx();
  const startAt = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

function playStartSound() {
  playTone(880, 0.12);
}

function playEndSound() {
  playTone(523, 0.12, 0);
  playTone(784, 0.18, 0.12);
}

// ============================================================
// 업적 / 랭크 사다리 / 최근 기록 (전 테스트 공용)
// 서버 없이 localStorage만 사용한다.
// ============================================================

// ---- 최근 기록 (최신순 최대 20개) ----
function addRecentRecord(key, entry, max = 20) {
  let list = loadStats(key + '_recent', []);
  list.unshift(entry);
  list = list.slice(0, max);
  saveStats(key + '_recent', list);
  return list;
}

function renderRecentRecords(containerId, list, formatRow, emptyText) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!list || !list.length) {
    el.innerHTML = `<p class="rec-empty">${emptyText}</p>`;
    return;
  }
  el.innerHTML = '<ul class="recent-list">' + list.map(entry => {
    const d = new Date(entry.date);
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return `<li><span class="rec-main">${formatRow(entry)}</span><span class="rec-time">${time}</span></li>`;
  }).join('') + '</ul>';
}

// ---- 업적 ----
// defs: [{ id, label, hint }]  / unlockedIds: 이번에 만족한 id 배열
// 새로 해금된 것만 돌려준다.
function unlockAchievements(key, unlockedIds) {
  const owned = loadStats(key + '_ach', {});
  const fresh = [];
  unlockedIds.forEach(id => {
    if (!owned[id]) {
      owned[id] = Date.now();
      fresh.push(id);
    }
  });
  if (fresh.length) saveStats(key + '_ach', owned);
  return fresh;
}

function renderAchievements(containerId, key, defs, headingText) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const owned = loadStats(key + '_ach', {});
  const got = defs.filter(d => owned[d.id]).length;
  el.innerHTML =
    `<div class="ach-head">${headingText} <span class="ach-count">${got} / ${defs.length}</span></div>` +
    '<div class="ach-grid">' +
    defs.map(d => {
      const has = !!owned[d.id];
      return `<span class="ach ${has ? 'got' : ''}" title="${d.hint || d.label}">${has ? '★' : '☆'} ${d.label}</span>`;
    }).join('') +
    '</div>';
}

// 새 업적 해금 토스트 (여러 개면 묶어서 한 번)
function showAchievementToast(labels, prefix) {
  if (!labels.length) return;
  showToast(`${prefix} ${labels.join(', ')}`);
}

// ---- 랭크 사다리 ----
// grades: [{ key, label, min }] (내림차순), best: 내 최고 기록
// betterIsLower가 true면 min 대신 max 기준으로 비교한다.
function renderRankLadder(containerId, grades, best, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const lower = !!opts.betterIsLower;
  const unit = opts.unit || '';
  const noRecordText = opts.noRecordText || '-';
  const hasRecord = best !== null && best !== undefined && !Number.isNaN(best);
  const current = hasRecord
    ? grades.find(g => lower ? best <= (g.max ?? Infinity) : best >= g.min)
    : null;

  el.innerHTML =
    `<div class="ladder-head">${opts.title || ''} <span class="ladder-best">${hasRecord ? best.toFixed(opts.digits ?? 1) + unit : noRecordText}</span></div>` +
    '<div class="ladder">' +
    grades.slice().reverse().map(g => {
      const reached = hasRecord && (lower ? best <= (g.max ?? Infinity) : best >= g.min);
      const isCurrent = current && g.key === current.key;
      const bound = lower
        ? (g.max === Infinity || g.max === undefined ? '—' : `${g.max}${unit} 이하`)
        : `${g.min}${unit}+`;
      return `<div class="rung ${reached ? 'reached' : ''} ${isCurrent ? 'current' : ''}">
        <span class="rung-mark">${reached ? '✓' : '×'}</span>
        <span class="rung-label">${g.label}</span>
        <span class="rung-bound">${bound}</span>
      </div>`;
    }).join('') +
    '</div>';
}
