import { About, HowItWorks, Instructions } from "@/components/Home";
import { Header, Footer } from "@/components/layout";
import { Breathing } from "@/components/Breathing";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <div className="bg-[#F6F4EB] min-h-[calc(100vh-2rem)] overflow-hidden ">
        <Header />
        <About />
        <Breathing />
        <HowItWorks />
        <Instructions />
      </div>
      <Footer />
    </div>
  );
}
