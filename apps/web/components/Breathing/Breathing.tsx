"use client";

import React, { useEffect, useState } from "react";
import Breathable from "./Breathable";
import Customize from "./Customize";
import { PhaseType } from "./breathing.types";
import { getNextPhase, playMetronomeBeep } from "./breathing.utils";
import "./Breathing.styles.css";

const DEFAULT_PHASE_SECONDS = 4;
const DEFAULT_SESSION_MINUTES = 5;
const TICK_INTERVAL_MS = 1000;

export default function Breathing() {
  // How long each phase of a round lasts, in seconds.
  const [inhaleTime, setInhaleTime] = useState(DEFAULT_PHASE_SECONDS);
  const [holdTime, setHoldTime] = useState(DEFAULT_PHASE_SECONDS);
  const [exhaleTime, setExhaleTime] = useState(DEFAULT_PHASE_SECONDS);
  const [pauseTime, setPauseTime] = useState(DEFAULT_PHASE_SECONDS);

  // Session-wide settings.
  const [sessionDuration, setSessionDuration] = useState(DEFAULT_SESSION_MINUTES); // minutes
  const [metronome, setMetronome] = useState("Off");

  // Where we currently are in the session.
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<PhaseType>("Inhale");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(DEFAULT_PHASE_SECONDS);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

  const phaseDurations: Record<PhaseType, number> = {
    Inhale: inhaleTime,
    Hold: holdTime,
    Exhale: exhaleTime,
    Pause: pauseTime,
  };

  const totalDurationSeconds = sessionDuration * 60;
  const roundDurationSeconds = Math.max(1, inhaleTime + holdTime + exhaleTime + pauseTime);

  // How many full rounds fit in the session, and which one we are on right now.
  const totalRounds = Math.max(1, Math.round(totalDurationSeconds / roundDurationSeconds));
  const currentRound = Math.min(
    totalRounds,
    Math.floor(totalElapsedSeconds / roundDurationSeconds) + 1
  );

  // While the session is paused, the countdown should follow the sliders as they move.
  useEffect(() => {
    if (!isActive) {
      setPhaseTimeLeft(phaseDurations[currentPhase]);
    }
  }, [inhaleTime, holdTime, exhaleTime, pauseTime, currentPhase, isActive]);

  // The session clock: one tick per second while the session is running.
  useEffect(() => {
    if (!isActive) return;

    const advanceOneSecond = () => {
      // Count the second, and stop the session once the full duration is reached.
      setTotalElapsedSeconds((elapsed) => {
        if (elapsed + 1 >= totalDurationSeconds) {
          setIsActive(false);
          return totalDurationSeconds;
        }
        return elapsed + 1;
      });

      // Count down the current phase, moving to the next phase when it runs out.
      setPhaseTimeLeft((timeLeft) => {
        playMetronomeBeep(metronome);

        if (timeLeft > 1) return timeLeft - 1;

        const nextPhase = getNextPhase(currentPhase);
        setCurrentPhase(nextPhase);
        return phaseDurations[nextPhase];
      });
    };

    const interval = setInterval(advanceOneSecond, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [
    isActive,
    currentPhase,
    inhaleTime,
    holdTime,
    exhaleTime,
    pauseTime,
    totalDurationSeconds,
    metronome,
  ]);

  const handleToggleStart = () => setIsActive((active) => !active);

  return (
    <div className="BreathingLayout">
      {/* Two equal columns from md up, stacked on mobile. */}
      <div className="BreathingGrid">
        {/* Left: the breathing circle and session status. */}
        <div className="BreathingColumn">
          <Breathable
            currentPhase={currentPhase}
            phaseTimeLeft={phaseTimeLeft}
            phaseTotalTime={phaseDurations[currentPhase]}
            isActive={isActive}
            onToggleStart={handleToggleStart}
            totalElapsedSeconds={totalElapsedSeconds}
            totalDurationSeconds={totalDurationSeconds}
            currentRound={currentRound}
            totalRounds={totalRounds}
          />
        </div>

        {/* Right: the settings panel. */}
        <div className="BreathingColumn">
          <Customize
            inhaleTime={inhaleTime}
            setInhaleTime={setInhaleTime}
            holdTime={holdTime}
            setHoldTime={setHoldTime}
            exhaleTime={exhaleTime}
            setExhaleTime={setExhaleTime}
            pauseTime={pauseTime}
            setPauseTime={setPauseTime}
            sessionDuration={sessionDuration}
            setSessionDuration={setSessionDuration}
            metronome={metronome}
            setMetronome={setMetronome}
            isActive={isActive}
            onToggleStart={handleToggleStart}
          />
        </div>
      </div>
    </div>
  );
}
