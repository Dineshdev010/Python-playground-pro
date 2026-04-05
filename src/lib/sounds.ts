// ============================================================
// SOUND EFFECTS — src/lib/sounds.ts
// Creates celebration sounds using the Web Audio API.
// No audio files needed — sounds are generated programmatically!
// ============================================================

// Shared AudioContext — reused across all sound calls.
// Browsers cap the number of AudioContext instances (~6), so a
// single shared instance avoids hitting that limit.
let sharedAudioCtx: AudioContext | null = null;
const SOUND_PREF_KEY = "pymaster_sound_muted";

function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(SOUND_PREF_KEY);
  // Keep first-time experience silent unless user explicitly enables sound.
  if (stored === null) return true;
  return stored === "true";
}

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    sharedAudioCtx = new Ctor();
  }
  // Resume if suspended by browser autoplay policy
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => undefined);
  }
  return sharedAudioCtx;
}

/**
 * Play a short celebration fanfare (C5 → E5 → G5 → C6).
 * Used when the user solves a problem or earns a reward.
 */
export function playCelebrationSound() {
  try {
    if (isSoundMuted()) return;
    const audioCtx = getAudioContext();

    // Musical notes: C5, E5, G5, C6 (a happy ascending chord)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const durations = [0.15, 0.15, 0.15, 0.4]; // Last note rings longer

    let startTime = audioCtx.currentTime;

    // Play each note in sequence
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); // Sound generator
      const gain = audioCtx.createGain(); // Volume control

      osc.type = "triangle"; // Soft, warm tone
      osc.frequency.value = freq; // Set the pitch

      // Start loud, fade out (exponential ramp to near-zero)
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + durations[i]);

      // Connect: oscillator → gain → speakers
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + durations[i]);

      startTime += durations[i]; // Next note starts after this one ends
    });
  } catch {
    // Audio not supported — fail silently (don't crash the app)
  }
}

/**
 * Play a simulated applause sound using filtered noise.
 * Used when a lesson is completed.
 */
export function playApplauseSound() {
  try {
    if (isSoundMuted()) return;
    const audioCtx = getAudioContext();

    const duration = 1.5;
    const bufferSize = audioCtx.sampleRate * duration;
    // Create an audio buffer and fill it with custom noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioCtx.sampleRate;
      // Envelope: volume rises then falls over the duration (bell curve)
      const envelope = Math.sin(Math.PI * t / duration) * 0.15;
      // Clapping rhythm: creates pulsing effect
      const clap = Math.sin(t * 12) > 0.3 ? 1 : 0.3;
      // Random noise × envelope × clapping rhythm
      data[i] = (Math.random() * 2 - 1) * envelope * clap;
    }

    // Apply a bandpass filter to make noise sound more like clapping
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass"; // Only let mid-range frequencies through
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;

    source.connect(filter);
    filter.connect(audioCtx.destination);
    source.start();
  } catch {
    // Audio not supported
  }
}

/**
 * Play a rising arpeggio sound (level-up effect).
 * Used when a badge is unlocked or a streak milestone is hit.
 */
export function playLevelUpSound() {
  try {
    if (isSoundMuted()) return;
    const audioCtx = getAudioContext();

    // Rising scale: C4 → E4 → G4 → C5 → E5 → G5
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    let startTime = audioCtx.currentTime;

    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // First 3 notes use sine (softer), last 3 use triangle (brighter)
      osc.type = i < 3 ? "sine" : "triangle";
      osc.frequency.value = freq;

      const dur = 0.12;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);

      startTime += 0.08; // Overlap notes slightly for a smoother sound
    });
  } catch {
    // Audio not supported
  }
}
