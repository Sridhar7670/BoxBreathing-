"use client";

import { motion, useTransform } from "motion/react";

import PhaseArc from "./PhaseArc";
import type { PhaseRingProps } from "./breathing.interfaces";
import { PHASE_ORDER, PHASE_RING_LABELS } from "./breathing.constants";
import { MARKER_TOP_Y, getMarkerRotation } from "./ring.geometry";
import "./PhaseRing.styles.css";

/**
 * The ring around the breathing circle, split into one quarter per phase.
 *
 * Each quarter fills with its own colour as its phase runs, and a marker travels
 * the whole way round once per round. Because all four phases are the same
 * length, a quarter of the ring is always exactly a quarter of a round — so the
 * four labels can sit at fixed points on the compass and stay true.
 */
export default function PhaseRing({ roundProgress, activePhase }: PhaseRingProps) {
  const markerRotation = useTransform(roundProgress, getMarkerRotation);

  return (
    <div className="PhaseRing">
      <svg className="PhaseRingSvg" viewBox="0 0 100 100" aria-hidden="true">
        {PHASE_ORDER.map((phase, phaseIndex) => (
          <PhaseArc
            key={phase}
            phase={phase}
            phaseIndex={phaseIndex}
            roundProgress={roundProgress}
          />
        ))}

        {/*
          The marker is drawn once at the top of the ring and then rotated into
          place, which is far simpler than working out its x and y every frame.
        */}
        <motion.g className="PhaseRingMarker" style={{ rotate: markerRotation }}>
          <circle cx="50" cy={MARKER_TOP_Y} r="3.6" />
        </motion.g>
      </svg>

      {/*
        One label per compass point: inhale at the top, then clockwise. The
        active one lights up, so the ring reads at a glance without the label
        having to move.
      */}
      {PHASE_ORDER.map((phase, phaseIndex) => (
        <span
          key={phase}
          className={`PhaseRingLabel PhaseRingLabel--${phaseIndex}`}
          data-phase={phase}
          data-active={phase === activePhase}
        >
          {PHASE_RING_LABELS[phase]}
        </span>
      ))}
    </div>
  );
}
