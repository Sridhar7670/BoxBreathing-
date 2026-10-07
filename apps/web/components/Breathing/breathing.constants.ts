/**
 * Every fixed value the breathing screen is built from: the phases, what they
 * are called, and the choices the user is offered. Change a session default or
 * add a wording tweak here and it takes effect everywhere.
 */

import type { MetronomeLevel, PhaseSeconds, PhaseType } from "./breathing.types";

/** The four phases of a round, in the order they play. */
export const PHASE_ORDER: PhaseType[] = ["Inhale", "Hold", "Exhale", "Pause"];

/** How many phases make one round. Always four — that is what makes it a box. */
export const PHASES_PER_ROUND = PHASE_ORDER.length;

/**
 * What the user sees for each phase.
 *
 * Both holds read as a hold on screen. "Pause" is only the internal name for
 * the second one, so the two stay distinguishable in code.
 */
export const PHASE_LABELS: Record<PhaseType, string> = {
  Inhale: "Inhale",
  Hold: "Hold",
  Exhale: "Exhale",
  Pause: "Hold",
};

/** The shorter labels printed around the ring, where space is tight. */
export const PHASE_RING_LABELS: Record<PhaseType, string> = {
  Inhale: "Inhale",
  Hold: "Hold",
  Exhale: "Exhale",
  Pause: "Hold out",
};

/** A short line of guidance shown under the circle. */
export const PHASE_HINTS: Record<PhaseType, string> = {
  Inhale: "Fill slowly through the nose",
  Hold: "Keep the air in, stay soft",
  Exhale: "Let it go through the mouth",
  Pause: "Rest empty before the next breath",
};

/**
 * The patterns on offer, as the length of a single phase.
 *
 * All four phases always share this length, so 4 means 4-4-4-4. Only these four
 * are offered: shorter than three seconds is a rush, longer than six is a
 * different exercise, and uneven rhythms are not box breathing at all.
 */
export const PHASE_SECONDS_OPTIONS: PhaseSeconds[] = [3, 4, 5, 6];

/** Session lengths the user can pick, in minutes. */
export const SESSION_MINUTE_OPTIONS = [1, 3, 5, 10, 15];

/** Where a fresh visitor starts: the classic 4-4-4-4, five minutes, silent. */
export const DEFAULT_PHASE_SECONDS: PhaseSeconds = 4;
export const DEFAULT_SESSION_MINUTES = 5;
export const DEFAULT_METRONOME: MetronomeLevel = "Off";
