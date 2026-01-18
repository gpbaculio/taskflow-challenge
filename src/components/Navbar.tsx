import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 flex items-center px-8 justify-between">
      <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
        TaskFlow
      </Link>
      <div className="flex gap-6 items-center italic text-sm text-zinc-400">
        Premium Task Management
      </div>
    </nav>
  );
}
