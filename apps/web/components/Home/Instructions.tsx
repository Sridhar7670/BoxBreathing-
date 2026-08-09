import React from "react";

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
    <div className="px-8 py-12 md:py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 border-b border-[#E3E1D5]">
      {/* Instructions */}
      <div>
        <h2 className="text-3xl font-semibold text-[#2C3328] mb-8">Instructions</h2>
        <div className="space-y-6">
          {instructions.map((text, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7D9B76] text-white flex items-center justify-center font-medium mt-1">
                {idx + 1}
              </div>
              <p className="text-[#4B554B] text-lg leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Try a pattern */}
      <div>
        <h2 className="text-3xl font-semibold text-[#2C3328] mb-2">Try a pattern</h2>
        <p className="text-[#4B554B] mb-6 text-lg">Tap one to load it into the timer above.</p>
        <div className="space-y-4">
          {patterns.map((pattern, idx) => (
            <div
              key={idx}
              className="bg-[#EAECE4] p-6 rounded-2xl cursor-pointer hover:bg-[#DFE2D8] transition-colors border border-[#D1D5C9]"
            >
              <h3 className="text-xl font-semibold text-[#2C3328] mb-1">
                {pattern.title}
              </h3>
              <p className="text-[#4B554B] text-base">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
