import Link from 'next/link';
import Image from 'next/image';
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            {/* <video src="/animated-404-error-page-template-animation-gif-download-7190377.mp4" autoPlay muted loop width={450} height={350} /> */}
            <Image
                src="/404 Error.png"
                alt="404"
                width={250}
                height={250}  // adjust to match your image aspect ratio
                style={{ maxWidth: '100%', height: 'auto' }}
                sizes="(max-width: 768px) 100vw, 250px"
            />
            <p className="text-zinc-400 text-md">The page you&apos;re looking for doesn&apos;t exist or has been moved...</p>
            <Link
                href="/"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
            >
                Go home
            </Link>
        </div>
    );
}

