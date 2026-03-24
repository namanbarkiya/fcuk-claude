"use client";

import Image from "next/image";
import type { User } from "@/types";

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border-subtle">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                <a
                    href="/"
                    className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors"
                >
                    <Image
                        src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claude-color.png"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        unoptimized
                    />
                    <span
                        className="text-lg font-bold tracking-tight"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        c-laude
                    </span>
                </a>

                {user && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-accent font-medium truncate max-w-[140px]">
                            @{user.username}
                        </span>
                        <button
                            onClick={onLogout}
                            className="text-xs font-medium text-text-muted hover:text-text-primary border border-border rounded-lg px-3 py-1.5 transition-colors hover:border-accent hover:text-accent"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
