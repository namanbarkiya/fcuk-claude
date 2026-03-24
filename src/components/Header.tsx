"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showInfo) return;
    function handleClick(e: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showInfo]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border-subtle">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <a
          href="/"
          className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors"
        >
          <Image
            src="/logo.svg"
            alt="fcuk claude"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            c-laude
          </span>
        </a>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-sm text-accent font-medium truncate max-w-[140px]">
                @{user.username}
              </span>
              <button
                onClick={onLogout}
                className="text-xs font-medium text-text-muted hover:text-text-primary border border-border rounded-lg px-3 py-1.5 transition-colors hover:border-accent hover:text-accent"
              >
                Log out
              </button>
            </>
          )}

          {/* Info button */}
          <div className="relative" ref={infoRef}>
            <button
              onClick={() => setShowInfo((v) => !v)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                showInfo
                  ? "bg-accent/15 text-accent"
                  : "bg-surface border border-border-subtle text-text-muted hover:text-text-primary hover:border-border"
              }`}
              aria-label="Info"
            >
              i
            </button>

            {showInfo && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-bg-elevated border border-border rounded-xl p-4 shadow-lg z-50">
                <div className="flex flex-col gap-3">
                  <a
                    href="https://x.com/namanbarkiya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @namanbarkiya
                  </a>
                  <a
                    href="https://github.com/namanbarkiya/fcuk-claude"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    source code
                  </a>
                  <div className="border-t border-border-subtle pt-2 flex flex-col gap-2">
                    <p className="text-[10px] text-text-muted/60 leading-relaxed">
                      This is a community-driven, satirical project built entirely for fun.
                      Not affiliated with, endorsed by, or sponsored by Anthropic, PBC.
                      All user-generated content is the sole responsibility of its authors.
                      If Anthropic or any rights holder wants this site modified or removed, we will happily comply.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link href="/terms" className="text-[10px] text-text-muted hover:text-accent transition-colors">Terms</Link>
                      <Link href="/privacy" className="text-[10px] text-text-muted hover:text-accent transition-colors">Privacy</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
