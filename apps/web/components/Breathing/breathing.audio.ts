import type { CueSettings } from "./breathing.interfaces";
import type { CueKind, MetronomeLevel } from "./breathing.types";

/** Metronome levels the user can pick, and how loud each one is (0 = silent). */
export const METRONOME_VOLUMES: Record<MetronomeLevel, number> = {
  Off: 0,
  Soft: 0.04,
  Med: 0.12,
  Loud: 0.24,
};

export const METRONOME_OPTIONS = Object.keys(METRONOME_VOLUMES) as MetronomeLevel[];

/** How each kind of cue sounds: a quiet tick per second, a brighter chime per phase. */
const CUE_SETTINGS: Record<CueKind, CueSettings> = {
  second: { frequencyHz: 440, lengthSeconds: 0.06, gain: 0.6 },
  phase: { frequencyHz: 660, lengthSeconds: 0.16, gain: 1 },
};

// Browsers only allow a handful of AudioContexts, so we create one and reuse it.
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!sharedAudioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;
    sharedAudioContext = new AudioContextClass();
  }

  return sharedAudioContext;
}

/**
 * Browsers keep audio suspended until the user interacts with the page, so this
 * must be called from a real click or key press — not from a timer.
 */
export function unlockMetronome(): void {
  const context = getAudioContext();
  if (context?.state === "suspended") {
    void context.resume();
  }
}

/**
 * Plays one cue at the given metronome level. Does nothing when it is "Off".
 *
 * The volume is ramped up and down rather than switched on and off, because an
 * instant start or stop makes an audible click.
 */
export function playCue(level: MetronomeLevel, kind: CueKind): void {
  const levelVolume = METRONOME_VOLUMES[level] ?? 0;
  if (levelVolume === 0) return;

  const context = getAudioContext();
  if (!context || context.state !== "running") return;

  try {
    const { frequencyHz, lengthSeconds, gain } = CUE_SETTINGS[kind];
    const startTime = context.currentTime;
    const endTime = startTime + lengthSeconds;
    const peakVolume = levelVolume * gain;

    const oscillator = context.createOscillator();
    const amplifier = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequencyHz, startTime);

    amplifier.gain.setValueAtTime(0, startTime);
    amplifier.gain.linearRampToValueAtTime(peakVolume, startTime + 0.01);
    amplifier.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(amplifier);
    amplifier.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  } catch {
    // Audio is a nice-to-have; if the browser blocks it, the session still runs.
  }
}
