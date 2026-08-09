import { Button } from "../ui/button";

export default function Header() {
    return (
        <header className="flex flex-row items-center justify-between border-b border-[#E3E1D5] px-8 py-5">
            <div className="font-semibold text-xl text-[#2C3328]">Box Breathing</div>
            <Button
                className="bg-[#799479] hover:bg-[#6A846A] text-white rounded-full px-5 h-10 font-medium border-none shadow-sm"
            >
                Sign up free
            </Button>
        </header>
    );
}