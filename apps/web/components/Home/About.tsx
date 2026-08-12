import "./About.styles.css";

export default function About() {
    return (
        <div className="About">
            <div className="AboutEyebrow">
                4-4-4-4 Guided timer
            </div>
            <div className="AboutContent">
                <h1 className="AboutHeading">
                    Box breathing, one<br className="AboutHeadingBreak" /> calm round at a time
                </h1>
                <p className="AboutLead">
                    Inhale, hold, exhale, hold — one full square is one round. Set your rhythm on the right, then let the circle lead your breath.
                </p>
            </div>
        </div>
    );
}
