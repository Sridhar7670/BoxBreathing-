import { CardProps } from "./crad.types";
import { cn } from "@/apps/lib/util";


export function Card({ title, description, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl bg-[#EAF0E6] p-6 border border-[#D5E1D1] shadow-sm",
                className
            )}
            {...props}
        >
            <h3 className="text-lg font-semibold text-[#2C3328] mb-2">{title}</h3>
            <p className="text-[#4B554B] leading-relaxed">{description}</p>
        </div>
    );
}
