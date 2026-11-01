/**
 * An original music-box lullaby, played live with the Web Audio API.
 * Nothing is downloaded and nothing is copyrighted: the notes below are
 * written for this site, in F major, 3/4 time.
 */

const BPM = 66;
const BEAT = 60 / BPM;
const BEATS_PER_BAR = 3;

// [midi note, length in beats] — 16 bars
const MELODY = [
  [69, 1], [72, 1], [77, 1],
  [76, 2], [74, 0.5], [72, 0.5],
  [74, 1.5], [72, 0.5], [69, 1],
  [70, 1], [74, 1], [77, 1],
  [81, 1.5], [79, 0.5], [77, 1],
  [76, 1], [79, 1], [72, 1],
  [74, 1.5], [72, 0.5], [70, 1],
  [69, 1], [67, 1], [72, 1],
  [77, 1], [76, 0.5], [74, 0.5], [69, 1],
  [72, 1], [76, 1], [81, 1],
  [79, 1.5], [77, 0.5], [74, 1],
  [77, 1], [72, 1], [69, 1],
  [70, 1], [74, 1], [79, 1],
  [81, 1], [79, 0.5], [77, 0.5], [76, 1],
  [77, 3],
  [null, 1], [69, 1], [72, 1],
];

// one chord per bar: [bass, ...upper voices]
const CHORDS = [
  [41, 53, 57, 60], [40, 52, 55, 60], [38, 50, 53, 57], [34, 50, 53, 58],
  [41, 53, 57, 60], [36, 48, 52, 55], [34, 50, 53, 58], [36, 48, 52, 55],
  [38, 50, 53, 57], [45, 52, 57, 60], [34, 50, 53, 58], [41, 53, 57, 60],
  [43, 50, 55, 58], [36, 48, 52, 55], [41, 53, 57, 60], [41, 53, 57, 60],
];

const LOOP_BEATS = CHORDS.length * BEATS_PER_BAR;
const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

function makeImpulse(ctx, seconds = 2.8) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  return buf;
}

export function createMusicBox() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  const dry = ctx.createGain();
  dry.gain.value = 0.75;
  const wet = ctx.createGain();
  wet.gain.value = 0.45;
  const verb = ctx.createConvolver();
  verb.buffer = makeImpulse(ctx);
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 5200;

  tone.connect(dry).connect(master);
  tone.connect(verb).connect(wet).connect(master);
  master.connect(ctx.destination);

  const bell = (midi, t, vel = 0.22, len = 2.4) => {
    const f = freq(midi);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(tone);
    [
      [1, 1],
      [2, 0.28],
      [3.01, 0.08],
      [4.2, 0.04],
    ].forEach(([mult, amp]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.value = amp;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + len + 0.05);
    });
  };

  const pad = (notes, t, dur) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.035, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.6);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    g.connect(lp).connect(tone);
    notes.forEach((m, i) => {
      [-4, 4].forEach((detune) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = freq(m);
        o.detune.value = detune + i;
        o.connect(g);
        o.start(t);
        o.stop(t + dur + 0.7);
      });
    });
  };

  // Flatten the score into timed events within one loop.
  const events = [];
  let beat = 0;
  MELODY.forEach(([m, len]) => {
    if (m !== null) events.push({ at: beat, kind: 'mel', m });
    beat += len;
  });
  CHORDS.forEach((ch, bar) => {
    const b0 = bar * BEATS_PER_BAR;
    events.push({ at: b0, kind: 'bass', m: ch[0] + 12 });
    events.push({ at: b0 + 1, kind: 'chord', m: ch.slice(1) });
    events.push({ at: b0 + 2, kind: 'chord', m: ch.slice(1) });
    events.push({ at: b0, kind: 'pad', m: ch.slice(1) });
  });
  events.sort((a, b) => a.at - b.at);

  let startTime = 0;
  let nextIdx = 0;
  let loopN = 0;
  let timer = null;
  let playing = false;

  const schedule = () => {
    const horizon = ctx.currentTime + 0.2;
    for (;;) {
      const ev = events[nextIdx];
      const t = startTime + (loopN * LOOP_BEATS + ev.at) * BEAT;
      if (t > horizon) break;
      if (ev.kind === 'mel') bell(ev.m, t, 0.2);
      else if (ev.kind === 'bass') bell(ev.m, t, 0.12, 3);
      else if (ev.kind === 'chord') ev.m.forEach((m) => bell(m + 12, t, 0.035, 1.4));
      else pad(ev.m, t, BEATS_PER_BAR * BEAT);
      nextIdx += 1;
      if (nextIdx >= events.length) {
        nextIdx = 0;
        loopN += 1;
      }
    }
  };

  return {
    async start() {
      if (playing) return;
      playing = true;
      await ctx.resume();
      startTime = ctx.currentTime + 0.1;
      nextIdx = 0;
      loopN = 0;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2);
      schedule();
      timer = setInterval(schedule, 40);
    },
    stop() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.5);
      setTimeout(() => {
        if (!playing) ctx.suspend();
      }, 2600);
    },
    progress() {
      if (!playing) return null;
      const beats = (ctx.currentTime - startTime) / BEAT;
      return ((beats % LOOP_BEATS) + LOOP_BEATS) % LOOP_BEATS / LOOP_BEATS;
    },
  };
}
