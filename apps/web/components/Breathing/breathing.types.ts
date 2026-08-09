export type PhaseType = "Inhale" | "Hold" | "Exhale" | "Pause";

export interface CustomizeProps {
  inhaleTime: number;
  setInhaleTime: (val: number) => void;
  holdTime: number;
  setHoldTime: (val: number) => void;
  exhaleTime: number;
  setExhaleTime: (val: number) => void;
  pauseTime: number;
  setPauseTime: (val: number) => void;
  sessionDuration: number;
  setSessionDuration: (val: number) => void;
  metronome: string;
  setMetronome: (val: string) => void;
  isActive: boolean;
  onToggleStart: () => void;
}

export interface BreathableProps {
  currentPhase: PhaseType;
  phaseTimeLeft: number;
  phaseTotalTime: number;
  isActive: boolean;
  onToggleStart: () => void;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  currentRound: number;
  totalRounds: number;
}

export interface ProgressProps {
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  isActive: boolean;
  onToggleStart: () => void;
  onReset: () => void;
}
