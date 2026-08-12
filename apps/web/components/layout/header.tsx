import { Button } from "../ui/button";
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