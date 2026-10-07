/**
 * The maths for the four-quarter ring.
 *
 * The ring is drawn in a 100 x 100 box, so every number here is a percentage of
 * the circle's width and the SVG scales to whatever size the stylesheet gives it.
 *
 * Angles are measured in degrees clockwise from twelve o'clock, which is how
 * people read a clock face and how the breath travels around the ring:
 *
 *        0°  Inhale starts here
 *        ↓
 *   270° ○ 90°     Hold starts at 90°, Exhale at 180°, Hold out at 270°
 *        ↑
 *      180°
 *
 * Because every phase is the same length, each one owns exactly a quarter turn.
 * That is the whole reason this design works — see PHASE_SECONDS_OPTIONS.
 */

import { PHASES_PER_ROUND } from "./breathing.constants";

/** The centre of the 100 x 100 drawing box. */
const RING_CENTRE = 50;

/** Distance from the centre to the middle of the ring's stroke. */
export const RING_RADIUS = 42;

/** A quarter turn: 90° when there are four phases. */
export const DEGREES_PER_PHASE = 360 / PHASES_PER_ROUND;

/**
 * A small wedge trimmed off both ends of every arc, so the four quarters read
 * as four separate segments instead of one unbroken circle.
 */
const ARC_GAP_DEGREES = 6;

/** Where the marker sits when it is at the top of the ring. */
export const MARKER_TOP_Y = RING_CENTRE - RING_RADIUS;

/** Finds a point on the ring at the given angle. */
function getPointOnRing(angleDegrees: number): { x: number; y: number } {
  const radians = (angleDegrees * Math.PI) / 180;

  return {
    // Sine moves across, cosine moves up — and the y axis points down in SVG,
    // which is why the second line subtracts rather than adds.
    x: RING_CENTRE + RING_RADIUS * Math.sin(radians),
    y: RING_CENTRE - RING_RADIUS * Math.cos(radians),
  };
}

/**
 * The SVG path for one phase's quarter of the ring.
 *
 * `getPhaseArcPath(0)` is the top-right quarter that the inhale fills,
 * `getPhaseArcPath(1)` the bottom-right quarter for the hold, and so on.
 */
export function getPhaseArcPath(phaseIndex: number): string {
  const halfGap = ARC_GAP_DEGREES / 2;
  const start = getPointOnRing(phaseIndex * DEGREES_PER_PHASE + halfGap);
  const end = getPointOnRing((phaseIndex + 1) * DEGREES_PER_PHASE - halfGap);

  // "A rx ry x-rotation large-arc-flag sweep-flag x y".
  // A quarter turn is never the long way round, so large-arc is 0; sweep 1
  // draws it clockwise, the direction the breath travels.
  return [
    `M ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
  ].join(" ");
}

/**
 * How much of one phase's arc should be filled, given how far the round has got.
 *
 * `roundProgress` runs 0 → 1 across a whole round, so multiplying by four turns
 * it into "quarters completed": at 0.6 of a round that is 2.4, which leaves
 * arc 0 and arc 1 full, arc 2 four-tenths full, and arc 3 empty.
 */
export function getArcFill(roundProgress: number, phaseIndex: number): number {
  const quartersCompleted = roundProgress * PHASES_PER_ROUND;
  return Math.min(1, Math.max(0, quartersCompleted - phaseIndex));
}

/** Where the marker sits on the ring, as a rotation away from twelve o'clock. */
export function getMarkerRotation(roundProgress: number): number {
  return roundProgress * 360;
}
