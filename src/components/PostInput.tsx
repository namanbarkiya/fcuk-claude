"use client";

import { useState } from "react";
import Image from "next/image";
import type { User } from "@/types";

const RAGE_EMOJIS = ["🤬", "😡", "💢", "🔥", "💀", "😤"];
const MAX_CHARS = 500;

interface PostInputProps {
  user: User;
  onPostCreated: () => void;
}

export default function PostInput({ user, onPostCreated }: PostInputProps) {
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🤬");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = content.trim().length === 0;
  const trimmedUrl = imageUrl.trim();
  const hasImage = trimmedUrl.length > 0;

  function removeImage() {
    setImageUrl("");
    setShowImageInput(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEmpty || isOverLimit || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username,
          content: content.trim(),
          emoji: selectedEmoji,
          image_url: hasImage ? trimmedUrl : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to post. Try again.");
        return;
      }
      setContent("");
      setSelectedEmoji("🤬");
      removeImage();
      onPostCreated();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <form onSubmit={handleSubmit}>
        {/* Emoji picker */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-text-muted mr-1">
            your mood rn:
          </span>
          {RAGE_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={`w-9 h-9 rounded-lg text-lg transition-all flex items-center justify-center ${
                selectedEmoji === emoji
                  ? "bg-accent/15 ring-2 ring-accent scale-110"
                  : "bg-bg-hover hover:bg-border-subtle"
              }`}
              aria-label={`Select emoji ${emoji}`}
              aria-pressed={selectedEmoji === emoji}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="claude just mass-deleted my production db and said 'i noticed some improvements'..."
          rows={4}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted bg-bg resize-none outline-none transition-colors ${
            isOverLimit
              ? "border-error focus:ring-2 focus:ring-error/20"
              : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
          }`}
        />

        {/* Image URL input */}
        {showImageInput && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
              <button
                type="button"
                onClick={removeImage}
                className="text-xs text-text-muted hover:text-error transition-colors px-2 py-2"
                aria-label="Remove image URL"
              >
                &times;
              </button>
            </div>
            {hasImage && (
              <div className="relative rounded-lg overflow-hidden border border-border bg-bg inline-block">
                <Image
                  src={trimmedUrl}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="max-h-48 w-auto object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 transition-colors border ${
                hasImage
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-bg border-border text-text-muted hover:text-text-primary hover:border-accent"
              }`}
              aria-label="Add image URL"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {hasImage ? "Change" : "Image"}
            </button>

            <span className={`text-xs tabular-nums ${
              isOverLimit ? "text-error font-medium" : charCount > MAX_CHARS * 0.8 ? "text-accent" : "text-text-muted"
            }`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          <button
            type="submit"
            disabled={isEmpty || isOverLimit || isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-base leading-none">{selectedEmoji}</span>
            {isSubmitting ? "posting..." : "send it"}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-error">{error}</p>
        )}
      </form>
    </div>
  );
}
