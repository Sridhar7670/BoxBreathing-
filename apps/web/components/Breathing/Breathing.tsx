"use client";

import { useState } from "react";

import Breathable from "./Breathable";
import Customize from "./Customize";
import Progress from "./Progress";
import type { MetronomeLevel, PhaseSeconds } from "./breathing.types";
import {
  DEFAULT_METRONOME,
  DEFAULT_PHASE_SECONDS,
  DEFAULT_SESSION_MINUTES,
} from "./breathing.constants";
import { useBreathingSession } from "./useBreathingSession";
import "./Breathing.styles.css";

/**
 * The breathing screen: the circle on one side, its settings on the other, and
 * the session's progress underneath.
 *
 * This component owns nothing but the three settings — all of the timing lives
 * in `useBreathingSession`.
 */
export default function Breathing() {
  const [phaseSeconds, setPhaseSeconds] = useState<PhaseSeconds>(DEFAULT_PHASE_SECONDS);
  const [sessionMinutes, setSessionMinutes] = useState(DEFAULT_SESSION_MINUTES);
  const [metronome, setMetronome] = useState<MetronomeLevel>(DEFAULT_METRONOME);

  const session = useBreathingSession({ phaseSeconds, sessionMinutes, metronome });

  return (
    <div className="BreathingLayout">
      <div className="BreathingGrid">
        {/* Left: the breathing circle and session status. */}
        <div className="BreathingColumn">
          <Breathable
            phase={session.phase}
            secondsLeft={session.secondsLeft}
            phaseSeconds={phaseSeconds}
            round={session.round}
            totalRounds={session.totalRounds}
            status={session.status}
            breath={session.breath}
            roundProgress={session.roundProgress}
            elapsedSeconds={session.elapsedSeconds}
            totalSeconds={session.totalSeconds}
            onToggle={session.toggle}
          />
        </div>

        {/* Right: the settings panel. */}
        <div className="BreathingColumn">
          <Customize
            phaseSeconds={phaseSeconds}
            onPhaseSecondsChange={setPhaseSeconds}
            sessionMinutes={sessionMinutes}
            onSessionMinutesChange={setSessionMinutes}
            metronome={metronome}
            onMetronomeChange={setMetronome}
            status={session.status}
            onToggle={session.toggle}
          />
        </div>
      </div>

      {/* Below both columns: overall session progress, play/pause and reset. */}
      <div className="BreathingProgressRow">
        <Progress
          sessionProgress={session.sessionProgress}
          elapsedSeconds={session.elapsedSeconds}
          totalSeconds={session.totalSeconds}
          roundsCompleted={session.roundsCompleted}
          totalRounds={session.totalRounds}
          status={session.status}
          onToggle={session.toggle}
          onReset={session.reset}
        />
      </div>
    </div>
  );
}
