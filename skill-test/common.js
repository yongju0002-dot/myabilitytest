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

function shareResult(text) {
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
    return;
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('결과가 복사되었습니다')).catch(() => showToast(text));
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
