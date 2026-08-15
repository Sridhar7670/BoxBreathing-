import { Button } from "@/components/ui";
import "./header.styles.css";

export default function Header() {
    return (
        <header className="header">
            <div className="Logo">Box Breathing</div>
            <Button
                className="header-Button"
            >
                Sign up free
            </Button>
        </header>
    );
}