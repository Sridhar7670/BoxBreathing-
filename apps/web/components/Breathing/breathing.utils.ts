import { PhaseType } from "./breathing.types";

/** The four phases of a box-breathing round, in the order they play. */
export const PHASE_ORDER: PhaseType[] = ["Inhale", "Hold", "Exhale", "Pause"];

/** How long any single phase is allowed to be, in seconds. */
export const PHASE_SECONDS_MIN = 1;
export const PHASE_SECONDS_MAX = 6;

/** Returns the phase that comes after `phase`, wrapping back to "Inhale". */
export function getNextPhase(phase: PhaseType): PhaseType {
  const nextIndex = (PHASE_ORDER.indexOf(phase) + 1) % PHASE_ORDER.length;
  return PHASE_ORDER[nextIndex];
}

/** Metronome levels the user can pick, and how loud each one is (0 = silent). */
export const METRONOME_VOLUMES: Record<string, number> = {
  Off: 0,
  Soft: 0.05,
  Med: 0.15,
  Loud: 0.3,
};

export const METRONOME_OPTIONS = Object.keys(METRONOME_VOLUMES);

const BEEP_FREQUENCY_HZ = 440;
const BEEP_LENGTH_SECONDS = 0.08;

// Browsers only allow a handful of AudioContexts, so we create one and reuse it.
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioContextClass();
  }

  // Browsers suspend audio until the user interacts with the page.
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume();
  }

  return sharedAudioContext;
}

/** Plays one short tick for the given metronome level. Does nothing when it is "Off". */
export function playMetronomeBeep(level: string): void {
  const volume = METRONOME_VOLUMES[level] ?? 0;
  if (volume === 0) return;

  try {
    const context = getAudioContext();

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    gain.gain.value = volume;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(BEEP_FREQUENCY_HZ, context.currentTime);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + BEEP_LENGTH_SECONDS);
  } catch {
    // Audio is a nice-to-have; if the browser blocks it, the session still runs.
  }
}

/**
 * Formats a number of seconds as a clock string.
 * `formatClock(65)` -> "1:05", `formatClock(65, { padMinutes: true })` -> "01:05"
 */
export function formatClock(
  totalSeconds: number,
  { padMinutes = false }: { padMinutes?: boolean } = {}
): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesText = padMinutes ? String(minutes).padStart(2, "0") : String(minutes);
  const secondsText = String(seconds).padStart(2, "0");

  return `${minutesText}:${secondsText}`;
}
