"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Post, ReactionCount } from "@/types";

const REACTION_EMOJIS = ["👍", "🔥", "😂", "💀", "❤️"];

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "1d";
  if (days < 7) return `${days}d`;

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface PostCardProps {
  post: Post;
  userId: string | null;
  variant?: "wide" | "tall" | "normal";
  reactions: ReactionCount[];
  onReactionsChange: (postId: string, reactions: ReactionCount[]) => void;
}

export default function PostCard({
  post,
  userId,
  reactions,
  onReactionsChange,
}: PostCardProps) {
  const [isPending, setIsPending] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPicker) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  async function handleReaction(emoji: string) {
    if (!userId || isPending) return;
    setShowPicker(false);
    setIsPending(emoji);

    // Optimistic update
    const existing = reactions.find((r) => r.emoji === emoji);
    let optimistic: ReactionCount[];
    if (existing) {
      if (existing.reacted) {
        optimistic = reactions
          .map((r) => r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r)
          .filter((r) => r.count > 0);
      } else {
        optimistic = reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r
        );
      }
    } else {
      optimistic = [...reactions, { emoji, count: 1, reacted: true }];
    }
    onReactionsChange(post.id, optimistic);

    try {
      const res = await fetch(`/api/posts/${post.id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, emoji }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reactions: ReactionCount[] };
        onReactionsChange(post.id, data.reactions);
      }
    } catch {
      // optimistic state stays
    } finally {
      setIsPending(null);
    }
  }

  return (
    <article className="bg-surface border border-border-subtle rounded-2xl p-4 hover:border-border transition-colors group h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
        <span className="text-lg select-none leading-none">{post.emoji}</span>
        <span className="text-sm font-semibold text-accent truncate">
          @{post.username}
        </span>
        <span className="text-xs text-text-muted ml-auto flex-shrink-0">
          {getRelativeTime(post.created_at)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-text-primary leading-relaxed break-words whitespace-pre-wrap">
          {post.content}
        </p>
        {post.image_url && <PostImage url={post.image_url} />}
      </div>

      {/* Reactions */}
      <div className="mt-2 pt-2 border-t border-border-subtle flex flex-wrap items-center gap-1 flex-shrink-0">
        {reactions.map((r) => (
          <button
            key={r.emoji}
            type="button"
            disabled={!userId}
            onClick={() => handleReaction(r.emoji)}
            title={userId ? undefined : "Log in to react"}
            className={[
              "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-all",
              r.reacted
                ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                : "bg-bg-hover text-text-primary hover:bg-bg-elevated",
              !userId ? "cursor-default" : "cursor-pointer",
            ].join(" ")}
          >
            <span className="text-[11px]">{r.emoji}</span>
            <span
              className={`text-[10px] font-medium tabular-nums ${
                r.reacted ? "text-accent" : "text-text-muted"
              }`}
            >
              {r.count}
            </span>
          </button>
        ))}

        {userId && (
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className={[
                "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors",
                showPicker
                  ? "bg-accent/15 text-accent"
                  : "bg-bg-hover text-text-muted hover:text-text-primary hover:bg-bg-elevated opacity-0 group-hover:opacity-100",
              ].join(" ")}
              aria-label="Add reaction"
            >
              +
            </button>

            {showPicker && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center gap-0.5 bg-bg-elevated border border-border rounded-xl px-1.5 py-1 shadow-lg z-10">
                {REACTION_EMOJIS.map((emoji) => {
                  const existing = reactions.find((r) => r.emoji === emoji);
                  const alreadyReacted = existing?.reacted ?? false;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleReaction(emoji)}
                      className={[
                        "w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all hover:scale-125",
                        alreadyReacted ? "bg-accent/15" : "hover:bg-bg-hover",
                      ].join(" ")}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function PostImage({ url }: { url: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="mt-2 block w-full rounded-lg overflow-hidden border border-border-subtle hover:border-accent transition-colors cursor-zoom-in"
      >
        <Image
          src={url}
          alt="Roast attachment"
          width={400}
          height={250}
          className="w-full h-auto object-cover bg-bg"
          unoptimized
        />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setExpanded(false)}
        >
          <Image
            src={url}
            alt="Roast attachment (full size)"
            width={1200}
            height={800}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            unoptimized
          />
        </div>
      )}
    </>
  );
}
