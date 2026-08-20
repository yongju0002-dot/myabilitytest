// Shared helpers for the click-speed test variants (jitter / kohi / spacebar / apm).
// Only used by the pages under skill-test/games/ that were added with the CPS
// expansion pack — cps.html predates this file and deliberately does not use it.

// Standard deviation of the gaps between consecutive click timestamps (ms).
// Lower = more evenly spaced clicks.
function clickIntervalStdDev(timestamps) {
  if (timestamps.length < 3) return null;
  const gaps = [];
  for (let i = 1; i < timestamps.length; i++) gaps.push(timestamps[i] - timestamps[i - 1]);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance = gaps.reduce((a, g) => a + (g - mean) * (g - mean), 0) / gaps.length;
  return Math.sqrt(variance);
}

// Clicks that landed inside each 1-second bucket, as a CPS value per second.
function perSecondCps(timestamps, startTime, duration) {
  const buckets = new Array(Math.ceil(duration)).fill(0);
  timestamps.forEach(ts => {
    const sec = Math.floor((ts - startTime) / 1000);
    if (sec >= 0 && sec < buckets.length) buckets[sec] += 1;
  });
  return buckets;
}

// Inline SVG line chart (no chart library) for per-second CPS values.
function buildCpsLineChart(values, opts = {}) {
  if (!values || values.length < 2) return '';
  const W = opts.width || 600;
  const H = opts.height || 150;
  const PAD = 24;
  const maxV = Math.max(...values, 1) * 1.15;
  const stepX = (W - PAD * 2) / (values.length - 1);
  const scaleY = (H - PAD * 2) / maxV;
  const pts = values.map((v, i) => ({
    x: PAD + i * stepX,
    y: H - PAD - v * scaleY,
  }));
  const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dots = pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="#a5b4fc"/>`).join('');
  const baseline = `<line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;margin:14px 0;">
    ${baseline}
    <polyline points="${line}" fill="none" stroke="#a5b4fc" stroke-width="2"/>
    ${dots}
  </svg>`;
}

// Inline SVG bar chart for bucketed values (used by the APM test).
function buildBucketBarChart(values, opts = {}) {
  if (!values || !values.length) return '';
  const W = opts.width || 600;
  const H = opts.height || 150;
  const PAD = 24;
  const maxV = Math.max(...values, 1) * 1.15;
  const slotW = (W - PAD * 2) / values.length;
  const bars = values.map((v, i) => {
    const h = (v / maxV) * (H - PAD * 2);
    const x = PAD + i * slotW;
    const y = H - PAD - h;
    return `<rect x="${(x + slotW * 0.15).toFixed(1)}" y="${y.toFixed(1)}" width="${(slotW * 0.7).toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" fill="#a5b4fc" rx="3"/>`;
  }).join('');
  const baseline = `<line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;margin:14px 0;">${baseline}${bars}</svg>`;
}
