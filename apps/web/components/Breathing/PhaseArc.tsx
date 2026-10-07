"use client";

import { motion, useTransform } from "motion/react";

import type { PhaseArcProps } from "./breathing.interfaces";
import { getArcFill, getPhaseArcPath } from "./ring.geometry";

/**
 * One quarter of the ring — the stretch of the circle that belongs to a single
 * phase.
 *
 * Two arcs are drawn on top of each other along the same path: a pale one that
 * is always fully visible, and a coloured one that fills in as the phase runs.
 * The coloured arc is drawn by its `pathLength`, which the session clock feeds
 * every frame, so it grows smoothly rather than jumping once a second.
 */
export default function PhaseArc({ phase, phaseIndex, roundProgress }: PhaseArcProps) {
  const arcPath = getPhaseArcPath(phaseIndex);
  const fill = useTransform(roundProgress, (progress) => getArcFill(progress, phaseIndex));

  return (
    <g className="PhaseArc" data-phase={phase}>
      <path className="PhaseArcTrack" d={arcPath} />
      <motion.path className="PhaseArcFill" d={arcPath} style={{ pathLength: fill }} />
    </g>
  );
}
