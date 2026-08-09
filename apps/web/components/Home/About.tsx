export default function About() {
    return (
        <div className="px-6 py-12 md:py-20 max-w-2xl ">
            <div className="text-xs uppercase tracking-[0.2em] font-medium text-[#4b554b] mb-6">
                4-4-4-4 Guided timer
            </div>
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#2C3328] leading-[1.1] tracking-tight">
                    Box breathing, one<br className="hidden sm:block" /> calm round at a time
                </h1>
                <p className="text-lg md:text-xl text-[#4b554b] leading-relaxed max-w-lg">
                    Inhale, hold, exhale, hold — one full square is one round. Set your rhythm on the right, then let the circle lead your breath.
                </p>
            </div>
        </div>
    );
}