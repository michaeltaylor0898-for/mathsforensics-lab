/* ================= SOUND: effects and music, all generated in the browser (no audio files) ================= */
const Sound = (() => {
  let ctx = null, master = null, noise = null, musicTimer = null, nextBeat = 0, beat = 0;
  let sfxOn = store.get("ir-sound", true), musicOn = store.get("ir-music", true), musicWanted = false;
  function ensure() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination);
        const len = ctx.sampleRate * 0.5, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        noise = buf;
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }
  function tone(f, t, dur, type = "sine", vol = 0.25, fEnd = null) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (fEnd) o.frequency.linearRampToValueAtTime(fEnd, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function hiss(t, dur, vol = 0.05, hp = 6000) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = "highpass"; f.frequency.value = hp;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.02);
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  const FX = {
    /* police radio chirp, then a bright "case solved" arpeggio */
    correct: t => { hiss(t, 0.08, 0.06, 2500); tone(1400, t + 0.02, 0.06, "square", 0.05); tone(1900, t + 0.09, 0.06, "square", 0.05);
      [72, 76, 79, 84].forEach((n, k) => tone(N(n), t + 0.18 + k * 0.08, 0.28, "triangle", 0.22)); },
    /* short two-tone siren */
    wrong: t => { for (let k = 0; k < 2; k++) { tone(620, t + k * 0.42, 0.21, "sawtooth", 0.07, 900); tone(900, t + k * 0.42 + 0.21, 0.21, "sawtooth", 0.07, 620); }
      tone(110, t, 0.5, "square", 0.05); },
    noanswer: t => { tone(330, t, 0.18, "triangle", 0.15); tone(247, t + 0.2, 0.3, "triangle", 0.15); },
    tick: t => tone(1100, t, 0.04, "square", 0.04),
    /* new surveillance report: radio squelch and two chirps */
    radio: t => { hiss(t, 0.18, 0.06, 1800); tone(1250, t + 0.16, 0.07, "square", 0.05); tone(1650, t + 0.25, 0.09, "square", 0.05); hiss(t + 0.36, 0.08, 0.04, 2200); },
    /* handcuffs: two quick metallic clicks */
    arrest: t => { tone(2400, t, 0.03, "square", 0.08); hiss(t, 0.04, 0.05, 5000); tone(2100, t + 0.09, 0.04, "square", 0.08); hiss(t + 0.09, 0.05, 0.05, 5000); tone(N(55), t + 0.12, 0.25, "triangle", 0.12); },
    join: t => { tone(880, t, 0.08, "sine", 0.18); tone(1320, t + 0.07, 0.1, "sine", 0.18); },
    tap: t => tone(660, t, 0.05, "sine", 0.08),
    reveal: t => { tone(N(45), t, 0.25, "square", 0.08); tone(N(40), t + 0.28, 0.5, "square", 0.08); hiss(t + 0.28, 0.3, 0.03, 3000); },
    promote: t => [67, 72, 76, 79, 84].forEach((n, k) => tone(N(n), t + k * 0.09, k === 4 ? 0.6 : 0.16, "triangle", 0.2)),
    standings: t => { tone(N(60), t, 0.12, "triangle", 0.12); tone(N(64), t + 0.1, 0.12, "triangle", 0.12); tone(N(67), t + 0.2, 0.25, "triangle", 0.12); },
    drumroll: t => { for (let i = 0; i < 30; i++) { const tt = t + i * 0.055; hiss(tt, 0.05, 0.025 + i * 0.0018, 1800); tone(N(36), tt, 0.05, "triangle", 0.03 + i * 0.002); } },
    bronze: t => { [64, 69].forEach((n, k) => tone(N(n), t + k * 0.12, 0.35, "triangle", 0.2)); hiss(t + 0.12, 0.4, 0.03, 5000); },
    silver: t => { [64, 69, 73].forEach((n, k) => tone(N(n), t + k * 0.11, 0.4, "triangle", 0.2)); hiss(t + 0.22, 0.5, 0.035, 5000); },
    gold: t => { hiss(t, 0.9, 0.07, 3500); [60, 64, 67, 72, 76, 79].forEach((n, k) => tone(N(n), t + k * 0.09, k === 5 ? 1.1 : 0.3, "triangle", 0.22));
      [72, 76, 79, 84].forEach(n => tone(N(n), t + 0.6, 1.2, "sine", 0.08)); },
    /* ---- The Identikit: original game-show sounds ---- */
    /* one tile lifting: a bright plink on a little upward whoosh */
    ikTile: t => { hiss(t, 0.12, 0.03, 4000); tone(N(84), t, 0.09, "sine", 0.16, N(91)); tone(N(96), t + 0.05, 0.12, "triangle", 0.08); },
    /* buzzing in with an ID: a two-tone game-show buzzer */
    ikBuzz: t => { tone(N(57), t, 0.22, "square", 0.09); tone(N(64), t, 0.22, "square", 0.07); tone(N(69), t + 0.2, 0.32, "square", 0.08); },
    /* a question right / wrong on the Identikit */
    ikDing: t => { tone(N(88), t, 0.5, "sine", 0.18); tone(N(93), t + 0.12, 0.7, "sine", 0.16); tone(N(100), t + 0.12, 0.6, "sine", 0.05); },
    ikNope: t => { tone(N(47), t, 0.16, "sawtooth", 0.08); tone(N(46), t + 0.2, 0.3, "sawtooth", 0.08); },
    /* the unmasking: quick drum build, whoosh, then a bright chord */
    ikReveal: t => { for (let i = 0; i < 12; i++) { hiss(t + i * 0.045, 0.04, 0.02 + i * 0.003, 2000); tone(N(43), t + i * 0.045, 0.04, "triangle", 0.05); }
      hiss(t + 0.55, 0.6, 0.06, 1200); [60, 64, 67, 72, 76].forEach((n, k) => tone(N(n), t + 0.6 + k * 0.03, 1.1, "triangle", 0.12)); },
    /* a correct ID: sparkly run up and a ta-da */
    ikRight: t => { [72, 76, 79, 84, 88, 91, 96].forEach((n, k) => tone(N(n), t + k * 0.05, 0.18, "sine", 0.12));
      [72, 76, 79].forEach(n => tone(N(n), t + 0.4, 0.25, "square", 0.05)); [72, 76, 79, 84].forEach(n => tone(N(n), t + 0.62, 1.2, "triangle", 0.12)); hiss(t + 0.62, 0.8, 0.04, 6000); },
    /* a wrong ID: the sad trombone, wah-wah-wah-waaah */
    ikWrong: t => { [[58, 0], [57, 0.32], [56, 0.64]].forEach(([n, d]) => tone(N(n), t + d, 0.3, "sawtooth", 0.08, N(n) * 0.985));
      const o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = "sawtooth"; o.frequency.setValueAtTime(N(55), t + 0.96); o.frequency.linearRampToValueAtTime(N(53), t + 2.0);
      lfo.frequency.value = 6; lg.gain.value = 4; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t + 0.96); g.gain.exponentialRampToValueAtTime(0.09, t + 1.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      o.connect(g); g.connect(master); o.start(t + 0.96); lfo.start(t + 0.96); o.stop(t + 2.05); lfo.stop(t + 2.05); },
    end: t => { [60, 64, 67, 72].forEach((n, k) => tone(N(n), t + k * 0.14, 0.3, "triangle", 0.2));
      [72, 76, 79].forEach(n => tone(N(n), t + 0.62, 0.9, "triangle", 0.12)); }
  };
  function play(name) { if (!sfxOn || !ensure() || !FX[name]) return; FX[name](ctx.currentTime + 0.01); }

  /* quiet detective-style loop: A minor bass line with a soft off-beat hi-hat, 96 bpm */
  const BASS = [45, 45, 48, 45, 52, 45, 50, 48, 45, 45, 48, 45, 52, 53, 52, 47];
  /* The Identikit: a bouncy, original game-show bed in C major, 120 bpm */
  const SHOW = [48, 55, 52, 55, 53, 57, 60, 57, 55, 59, 62, 59, 48, 55, 52, 43];
  const CHORDS = [[64, 67, 72], [65, 69, 72], [67, 71, 74], [64, 67, 72]];
  let theme = "detective";
  function schedule() {
    if (!ctx) return;
    const spb = theme === "show" ? 60 / 120 / 2 : 60 / 96 / 2;
    while (nextBeat < ctx.currentTime + 0.25) {
      if (theme === "show") {
        tone(N(SHOW[beat % SHOW.length]), nextBeat, spb * 0.7, "square", 0.022);
        if (beat % 4 === 2) CHORDS[Math.floor(beat / 4) % 4].forEach(n => tone(N(n), nextBeat, spb * 0.6, "triangle", 0.018));
        if (beat % 2 === 1) hiss(nextBeat, 0.04, 0.012, 8000);
        if (beat % 32 === 28) [79, 84].forEach((n, k) => tone(N(n), nextBeat + k * spb, spb * 0.8, "sine", 0.03));
      } else {
        tone(N(BASS[beat % BASS.length]), nextBeat, spb * 0.9, "triangle", 0.045);
        if (beat % 2 === 1) hiss(nextBeat, 0.05, 0.012, 7000);
        if (beat % 16 === 0) tone(N(69), nextBeat, spb * 6, "sine", 0.012);
      }
      nextBeat += spb; beat += 1;
    }
  }
  function startMusic(t = "detective") {
    musicWanted = true;
    if (t !== theme) { theme = t; if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }
    if (!musicOn || musicTimer || !ensure()) return;
    nextBeat = ctx.currentTime + 0.1; beat = 0;
    musicTimer = setInterval(schedule, 100);
  }
  function stopMusic(keepWanted = false) { if (!keepWanted) musicWanted = false; clearInterval(musicTimer); musicTimer = null; }
  return {
    play, startMusic, stopMusic, unlock: ensure,
    /* schedule a sound at a set time (used to render previews) */
    at(name, t) { if (ensure() && FX[name]) FX[name](t); },
    get sfx() { return sfxOn; }, get music() { return musicOn; },
    toggleSfx() { sfxOn = !sfxOn; store.set("ir-sound", sfxOn); if (sfxOn) play("tap"); return sfxOn; },
    toggleMusic() { musicOn = !musicOn; store.set("ir-music", musicOn); if (musicOn) { if (musicWanted) startMusic(theme); } else stopMusic(true); return musicOn; }
  };
})();
