import React from "react";
import "./Instructions.styles.css";

export default function Instructions() {
  const instructions = [
    "Sit upright with a straight back, shoulders relaxed, hands in your lap.",
    "Breathe in slowly through your nose for the full inhale count.",
    "Hold with full lungs, keeping your jaw and throat loose.",
    "Exhale gently through your mouth at a steady pace.",
    "Hold again with empty lungs, calm and still.",
    "Repeat until your session time is up – the timer cues every phase.",
  ];

  const patterns = [
    {
      title: "Beginner 3-3-3-3",
      description: "Shorter holds for your first sessions.",
    },
    {
      title: "Classic 4-4-4-4",
      description: "The standard pattern used by athletes and Navy SEALs.",
    },
    {
      title: "Extended 5-5-5-5",
      description: "Slower and deeper once the basics feel easy.",
    },
  ];

  return (
    <div className="Instructions">
      {/* Instructions */}
      <div>
        <h2 className="InstructionsHeading">Instructions</h2>
        <div className="InstructionsList">
          {instructions.map((text, idx) => (
            <div key={idx} className="InstructionStep">
              <div className="InstructionStepNumber">
                {idx + 1}
              </div>
              <p className="InstructionStepText">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Try a pattern */}
      <div>
        <h2 className="PatternsHeading">Try a pattern</h2>
        <p className="PatternsSubtitle">Tap one to load it into the timer above.</p>
        <div className="PatternsList">
          {patterns.map((pattern, idx) => (
            <div key={idx} className="PatternCard">
              <h3 className="PatternCardTitle">
                {pattern.title}
              </h3>
              <p className="PatternCardText">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
