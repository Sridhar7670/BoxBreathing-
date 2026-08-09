"use client";

import React, { useState, useEffect, useRef } from "react";
import Breathable from "./Breathable";
import Customize from "./Customize";
import { PhaseType } from "./breathing.types";

export default function Breathing() {
  // Settings state
  const [inhaleTime, setInhaleTime] = useState<number>(4);
  const [holdTime, setHoldTime] = useState<number>(4);
  const [exhaleTime, setExhaleTime] = useState<number>(4);
  const [pauseTime, setPauseTime] = useState<number>(4);
  const [sessionDuration, setSessionDuration] = useState<number>(5); // in minutes
  const [metronome, setMetronome] = useState<string>("Off");

  // Timer & Phase state
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<PhaseType>("Inhale");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(4);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);

  // Audio Context for optional Metronome beep
  const audioCtxRef = useRef<AudioContext | null>(null);

  const totalDurationSeconds = sessionDuration * 60;
  const singleRoundDuration = inhaleTime + holdTime + exhaleTime + pauseTime;
  const totalRounds = Math.max(1, Math.round(totalDurationSeconds / Math.max(1, singleRoundDuration)));
  const currentRound = Math.min(totalRounds, Math.floor(totalElapsedSeconds / Math.max(1, singleRoundDuration)) + 1);

  const playBeep = () => {
    if (metronome === "Off") return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const volumeMap: Record<string, number> = { Soft: 0.05, Med: 0.15, Loud: 0.3 };
      gain.gain.value = volumeMap[metronome] || 0.1;

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Fallthrough
    }
  };

  const getPhaseDuration = (phase: PhaseType) => {
    switch (phase) {
      case "Inhale":
        return inhaleTime;
      case "Hold":
        return holdTime;
      case "Exhale":
        return exhaleTime;
      case "Pause":
        return pauseTime;
    }
  };

  // Sync phaseTimeLeft when sliders change while inactive
  useEffect(() => {
    if (!isActive) {
      setPhaseTimeLeft(getPhaseDuration(currentPhase));
    }
  }, [inhaleTime, holdTime, exhaleTime, pauseTime, currentPhase, isActive]);

  // Main breathing timer interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTotalElapsedSeconds((prevTotal) => {
          if (prevTotal + 1 >= totalDurationSeconds) {
            setIsActive(false);
            return totalDurationSeconds;
          }
          return prevTotal + 1;
        });

        setPhaseTimeLeft((prevPhaseTime) => {
          playBeep();
          if (prevPhaseTime > 1) {
            return prevPhaseTime - 1;
          }

          // Advance to next phase
          let nextPhase: PhaseType = "Inhale";
          if (currentPhase === "Inhale") nextPhase = "Hold";
          else if (currentPhase === "Hold") nextPhase = "Exhale";
          else if (currentPhase === "Exhale") nextPhase = "Pause";
          else if (currentPhase === "Pause") nextPhase = "Inhale";

          setCurrentPhase(nextPhase);
          return getPhaseDuration(nextPhase);
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentPhase, inhaleTime, holdTime, exhaleTime, pauseTime, totalDurationSeconds, metronome]);

  const handleToggleStart = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      {/* 50-50 Equal Column Split on laptops/desktops (md:grid-cols-2), stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Left Section - Breathable Animation & Status */}
        <div className="w-full flex justify-center">
          <Breathable
            currentPhase={currentPhase}
            phaseTimeLeft={phaseTimeLeft}
            phaseTotalTime={getPhaseDuration(currentPhase)}
            isActive={isActive}
            onToggleStart={handleToggleStart}
            totalElapsedSeconds={totalElapsedSeconds}
            totalDurationSeconds={totalDurationSeconds}
            currentRound={currentRound}
            totalRounds={totalRounds}
          />
        </div>

        {/* Right Section - Customize Controls */}
        <div className="w-full flex justify-center">
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
