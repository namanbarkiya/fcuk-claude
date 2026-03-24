"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Post, ReactionCount } from "@/types";
import PostCard from "./PostCard";

const PAGE_LIMIT = 20;


export type SortMode = "latest" | "popular" | "longest";

interface PostFeedProps {
  userId: string | null;
  sort?: SortMode;
}

interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  reactions: Record<string, ReactionCount[]>;
}

export default function PostFeed({ userId, sort = "latest" }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Record<string, ReactionCount[]>>({});
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingMoreRef = useRef(false);

  const fetchPage = useCallback(
    async (cursor: string | null, replace: boolean) => {
      if (replace) {
        setIsLoading(true);
        setError("");
      }
      try {
        const params = new URLSearchParams({ limit: String(PAGE_LIMIT), sort });
        if (cursor) params.set("cursor", cursor);
        if (userId) params.set("user_id", userId);
        const res = await fetch(`/api/posts?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = (await res.json()) as FeedResponse;
        if (replace) {
          setPosts(data.posts);
          setReactions(data.reactions ?? {});
        } else {
          setPosts((prev) => [...prev, ...data.posts]);
          setReactions((prev) => ({ ...prev, ...(data.reactions ?? {}) }));
        }
        setNextCursor(data.nextCursor);
      } catch {
        setError("Could not load roasts. Please refresh.");
      } finally {
        if (replace) setIsLoading(false);
        setIsFetchingMore(false);
        isFetchingMoreRef.current = false;
      }
    },
    [sort, userId]
  );

  useEffect(() => {
    fetchPage(null, true);
  }, [fetchPage]);

  useEffect(() => {
    const handler = () => { fetchPage(null, true); };
    window.addEventListener("roast-posted", handler);
    return () => window.removeEventListener("roast-posted", handler);
  }, [fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextCursor && !isFetchingMoreRef.current) {
          isFetchingMoreRef.current = true;
          setIsFetchingMore(true);
          fetchPage(nextCursor, false);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, fetchPage]);

  // Update a single post's reactions after a toggle
  const updateReactions = useCallback((postId: string, updated: ReactionCount[]) => {
    setReactions((prev) => ({ ...prev, [postId]: updated }));
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-start">
        {Array.from({ length: 3 }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface border border-border-subtle rounded-2xl p-4 animate-pulse"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-16 rounded bg-bg-hover" />
                  <div className="h-3 w-10 rounded bg-bg-hover" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full rounded bg-bg-hover" />
                  <div className="h-3 w-3/4 rounded bg-bg-hover" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-8 text-center">
        <p className="text-sm text-error">{error}</p>
        <button
          onClick={() => fetchPage(null, true)}
          className="mt-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-12 text-center">
        <div className="text-4xl mb-3">💀</div>
        <p className="text-sm font-medium text-text-primary">dead silence.</p>
        <p className="mt-1 text-sm text-text-secondary">
          be the first to tell claude what you really think.
        </p>
      </div>
    );
  }

  // Distribute posts into columns in row-order (left-to-right, then down)
  const colCount = 3;
  const columns: Post[][] = Array.from({ length: colCount }, () => []);
  posts.forEach((post, i) => {
    columns[i % colCount].push(post);
  });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-start">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3">
            {col.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userId={userId}
                reactions={reactions[post.id] ?? []}
                onReactionsChange={updateReactions}
              />
            ))}
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" />

      {isFetchingMore && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 rounded-full border-2 border-border border-t-accent animate-spin" />
        </div>
      )}

      {!nextCursor && posts.length > 0 && (
        <div className="py-6 text-center">
          <p className="text-xs text-text-muted">
            you scrolled through all the pain. maybe go outside. or don't. claude will probably break something while you're gone.
          </p>
        </div>
      )}
    </>
  );
}
