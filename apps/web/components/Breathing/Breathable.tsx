"use client";

import { BreathableProps } from "./breathing.types";
import { PHASE_ORDER, formatClock } from "./breathing.utils";
import "./Breathable.styles.css";

export default function Breathable({ currentPhase, phaseTimeLeft, isActive, onToggleStart, totalElapsedSeconds, totalDurationSeconds,
  currentRound, totalRounds }: BreathableProps) {
  // "Pause" is the second hold of the round, so we show it to the user as "HOLD".
  const phaseLabel = currentPhase === "Pause" ? "HOLD" : currentPhase;
  const statusLabel = isActive ? "Breathe steadily" : "Ready when you are";
  const roundsToShow = Math.max(1, totalRounds);

  return (
    <div className="Breathable">
      {/* Tapping anywhere on the circle starts or pauses the session. */}
      <div onClick={onToggleStart} className="BreathableCircle">
        <div className="BreathableCircleInner">
          <span className="BreathablePhaseLabel">{phaseLabel}</span>
          <span className="BreathableCountdown">{phaseTimeLeft}</span>
          <span className="BreathableStatus">{statusLabel}</span>
        </div>
      </div>

      <div className="BreathableRound">
        Round {currentRound} of {roundsToShow}
      </div>

      {/* One dot per phase; the dot for the current phase is highlighted. */}
      <div className="BreathablePhaseDots">
        {PHASE_ORDER.map((phase) => (
          <div
            key={phase}
            className={`PhaseDot ${phase === currentPhase ? "PhaseDotActive" : ""}`}
          />
        ))}
      </div>

      <p className="BreathableCaption">
        One round = inhale · hold · exhale · hold
      </p>

      <div className="BreathableTimers">
        <span>
          Elapsed
          <span className="BreathableTimerValue">{formatClock(totalElapsedSeconds)}</span>
        </span>

        <span className="BreathableTimerDivider">|</span>

        <span>
          Session
          <span className="BreathableTimerValue">{formatClock(totalDurationSeconds)}</span>
        </span>
      </div>
    </div>
  );
}
