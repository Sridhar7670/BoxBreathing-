/**
 * The vocabulary of a breathing session: the small named types the rest of the
 * folder is built from. Anything shaped like an object — component props, the
 * session the hook returns — lives in `breathing.interfaces.ts`.
 */

/** The four phases of a box-breathing round, in the order they play. */
export type PhaseType = "Inhale" | "Hold" | "Exhale" | "Pause";

/**
 * How long every phase lasts, in seconds.
 *
 * Box breathing means all four phases are the same length, so one number
 * describes the whole pattern: 4 is the classic 4-4-4-4. Uneven rhythms such as
 * 4-7-8 are a different exercise and are deliberately not offered here.
 */
export type PhaseSeconds = 3 | 4 | 5 | 6;

/**
 * Where the session is right now.
 * - `idle`     nothing has run yet, or the user reset it
 * - `running`  the clock is ticking
 * - `paused`   the user (or leaving the tab) stopped the clock part-way
 * - `finished` the session reached its full duration
 */
export type SessionStatus = "idle" | "running" | "paused" | "finished";

/** How loud the metronome is. */
export type MetronomeLevel = "Off" | "Soft" | "Med" | "Loud";

/**
 * Two kinds of metronome cue:
 * - `second` is the quiet tick counting out each second of a phase
 * - `phase`  is the brighter, slightly longer chime marking a new phase
 */
export type CueKind = "second" | "phase";
