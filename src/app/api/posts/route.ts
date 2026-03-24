import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import type { Post, ReactionCount } from '@/types';

type SortMode = 'latest' | 'popular' | 'longest';

// Batch-fetch reactions for a list of post IDs + build per-post ReactionCount[]
async function getReactionsForPosts(
  postIds: string[],
  userId: string | null
): Promise<Record<string, ReactionCount[]>> {
  if (postIds.length === 0) return {};

  const db = getSupabaseAdmin();
  const { data: rows } = await db
    .from('reactions')
    .select('post_id, emoji, user_id')
    .in('post_id', postIds);

  if (!rows) return {};

  // Group: { postId -> { emoji -> { count, userReacted } } }
  const map: Record<string, Record<string, { count: number; reacted: boolean }>> = {};

  for (const r of rows) {
    if (!map[r.post_id]) map[r.post_id] = {};
    if (!map[r.post_id][r.emoji]) map[r.post_id][r.emoji] = { count: 0, reacted: false };
    map[r.post_id][r.emoji].count++;
    if (userId && r.user_id === userId) map[r.post_id][r.emoji].reacted = true;
  }

  const result: Record<string, ReactionCount[]> = {};
  for (const postId of Object.keys(map)) {
    result[postId] = Object.entries(map[postId]).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      reacted: data.reacted,
    }));
  }
  return result;
}

async function fetchPosts(
  sort: SortMode,
  limit: number,
  cursor: string | null,
  userId: string | null
) {
  const db = getSupabaseAdmin();

  let pagePosts: Post[];
  let nextCursor: string | null;

  if (sort === 'latest') {
    let query = db
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) query = query.lt('created_at', cursor);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const posts = data as Post[];
    const hasMore = posts.length > limit;
    pagePosts = hasMore ? posts.slice(0, limit) : posts;
    nextCursor = hasMore ? pagePosts[pagePosts.length - 1].created_at : null;
  } else {
    const offset = parseInt(cursor ?? '0', 10) || 0;
    const rpcName = sort === 'popular' ? 'get_popular_posts' : 'get_longest_posts';

    const { data, error } = await db.rpc(rpcName, { lim: limit + 1, off: offset });

    if (!error && data) {
      const posts = data as Post[];
      const hasMore = posts.length > limit;
      pagePosts = hasMore ? posts.slice(0, limit) : posts;
      nextCursor = hasMore ? String(offset + limit) : null;
    } else {
      // Fallback
      const fb = await db.from('posts').select('*').order('created_at', { ascending: false }).range(offset, offset + limit);
      const posts = (fb.data ?? []) as Post[];
      const hasMore = posts.length > limit;
      pagePosts = hasMore ? posts.slice(0, limit) : posts;
      nextCursor = hasMore ? String(offset + limit) : null;
    }
  }

  // Single batch query for all reactions
  const postIds = pagePosts.map((p) => p.id);
  const reactions = await getReactionsForPosts(postIds, userId);

  return { posts: pagePosts, nextCursor, reactions };
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const cursor = sp.get('cursor');
  const sort = (sp.get('sort') ?? 'latest') as SortMode;
  const userId = sp.get('user_id');
  const limit = Math.min(Math.max(parseInt(sp.get('limit') ?? '20', 10) || 20, 1), 100);

  try {
    const result = await fetchPosts(sort, limit, cursor, userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { user_id, username, content, emoji, image_url } = body;

  if (!user_id || !username || !content) {
    return NextResponse.json(
      { error: 'user_id, username, and content are required' },
      { status: 400 }
    );
  }

  const { data: newPost, error } = await getSupabaseAdmin()
    .from('posts')
    .insert({
      user_id,
      username,
      content,
      emoji: emoji ?? '🤬',
      image_url: image_url ?? null,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newPost as Post, { status: 201 });
}
