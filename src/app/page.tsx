"use client";

import { useState, useEffect } from "react";
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

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
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
          <p className="text-sm text-text-muted mb-3">claude fumbled again. shocking.</p>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            the <span className="text-accent">wall</span> anthropic<br className="hidden sm:block" />{" "}
            doesn't want you to see
          </h1>
          <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-md mx-auto">
            rate limited. code deleted. $20/mo for vibes.
            this is where we post about it.
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
          {/* Post input */}
          {hydrated && user && (
            <section className="mb-8">
              <PostInput user={user} onPostCreated={handlePostCreated} />
            </section>
          )}

          {/* Sort tabs */}
          <div className={`flex items-center gap-2 mb-6 ${!hydrated || !user ? "mt-0" : ""}`}>
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

      {hydrated && !user && <LoginForm onLogin={handleLogin} />}
    </div>
  );
}
