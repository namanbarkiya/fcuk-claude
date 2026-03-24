"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { User } from "@/types";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import PostInput from "@/components/PostInput";
import PostFeed, { type SortMode } from "@/components/PostFeed";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [feedKey, setFeedKey] = useState(0);
  const [sort, setSort] = useState<SortMode>("latest");
  const [hydrated, setHydrated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("fcuk-claude-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem("fcuk-claude-user");
      }
    }
    setHydrated(true);
  }, []);

  // Listen for login prompts from child components
  useEffect(() => {
    const handler = () => setShowLogin(true);
    window.addEventListener("prompt-login", handler);
    return () => window.removeEventListener("prompt-login", handler);
  }, []);

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
    setShowLogin(false);
  }

  function handleLogout() {
    localStorage.removeItem("fcuk-claude-user");
    setUser(null);
  }

  function handlePostCreated() {
    setFeedKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header user={user} onLogout={handleLogout} />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-10 sm:py-14 text-center px-4">
          <p className="text-sm text-text-muted mb-3">claude shipped another feature. your roadmap just died.</p>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            claude's <span className="text-accent">changelog</span><br className="hidden sm:block" />{" "}
            is your obituary
          </h1>
          <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-md mx-auto">
            claude ships faster than your entire team.
            this is where we cope about it.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-surface border border-border-subtle rounded-full px-4 py-1.5 text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
              real devs. real rage. zero filter.
            </div>
            <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5 text-xs text-accent">
              <span>✦</span>
              proudly built using claude code
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
          {/* Post input or login prompt */}
          {hydrated && (
            <section className="mb-8">
              {user ? (
                <PostInput user={user} onPostCreated={handlePostCreated} />
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-surface border border-border-subtle rounded-2xl p-5 text-center hover:border-accent transition-colors group cursor-pointer"
                >
                  <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    got something to say? <span className="text-accent font-medium">log in to post</span>
                  </p>
                  <p className="mt-1 text-xs text-text-muted">no email verification. just pick a name and start ranting.</p>
                </button>
              )}
            </section>
          )}

          {/* Sort tabs */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-border-subtle" />
            {(
              [
                { key: "latest", label: "latest" },
                { key: "popular", label: "most reacted" },
                { key: "longest", label: "longest rants" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setSort(tab.key);
                  setFeedKey((k) => k + 1);
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  sort === tab.key
                    ? "bg-accent text-white"
                    : "bg-surface border border-border-subtle text-text-muted hover:text-text-primary hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Feed */}
          <PostFeed key={`${feedKey}-${sort}`} userId={user?.id ?? null} sort={sort} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface mt-auto">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
          <p className="text-xs text-text-muted text-center leading-relaxed">
            This site is a community-driven, satirical project built entirely for fun and entertainment.
            It is <strong className="text-text-secondary">not affiliated with, endorsed by, or sponsored by Anthropic, PBC.</strong>{" "}
            &ldquo;Claude&rdquo; and &ldquo;Anthropic&rdquo; are trademarks of Anthropic, PBC.
            All user-generated content is the sole responsibility of its authors.
            If Anthropic or any rights holder wants this site modified or removed, we will happily comply — just reach out.
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href="/terms" className="text-xs text-text-muted hover:text-accent transition-colors">Terms</Link>
            <span className="text-border-subtle">·</span>
            <Link href="/privacy" className="text-xs text-text-muted hover:text-accent transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      {showLogin && (
        <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
