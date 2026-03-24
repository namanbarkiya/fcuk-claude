import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import type { ReactionCount } from '@/types';

async function getReactionCounts(postId: string, userId?: string): Promise<ReactionCount[]> {
  const { data: reactions, error } = await getSupabaseAdmin()
    .from('reactions')
    .select('emoji, user_id')
    .eq('post_id', postId);

  if (error || !reactions) return [];

  const counts: Record<string, { count: number; reacted: boolean }> = {};
  for (const reaction of reactions) {
    if (!counts[reaction.emoji]) {
      counts[reaction.emoji] = { count: 0, reacted: false };
    }
    counts[reaction.emoji].count += 1;
    if (userId && reaction.user_id === userId) {
      counts[reaction.emoji].reacted = true;
    }
  }

  return Object.entries(counts).map(([emoji, { count, reacted }]) => ({
    emoji,
    count,
    reacted,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.nextUrl.searchParams.get('user_id') ?? undefined;

  const reactionCounts = await getReactionCounts(id, userId);

  return NextResponse.json({ reactions: reactionCounts });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { user_id, emoji } = body as { user_id?: string; emoji?: string };

  if (!user_id || !emoji) {
    return NextResponse.json(
      { error: 'user_id and emoji are required' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Check if the reaction already exists
  const { data: existing, error: selectError } = await supabase
    .from('reactions')
    .select('id')
    .eq('post_id', id)
    .eq('user_id', user_id)
    .eq('emoji', emoji)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  if (existing) {
    // Delete (unreact)
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existing.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  } else {
    // Insert (react)
    const { error: insertError } = await supabase
      .from('reactions')
      .insert({ post_id: id, user_id, emoji });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  const reactionCounts = await getReactionCounts(id, user_id);
  return NextResponse.json({ reactions: reactionCounts });
}
