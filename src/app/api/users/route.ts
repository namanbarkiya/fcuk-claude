import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import type { User } from '@/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email } = body;

  if (!username || !email) {
    return NextResponse.json(
      { error: 'username and email are required' },
      { status: 400 }
    );
  }

  // Check if username already exists and return that user
  const { data: existingUser, error: lookupError } = await getSupabaseAdmin()
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (lookupError && lookupError.code !== 'PGRST116') {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (existingUser) {
    return NextResponse.json(existingUser as User);
  }

  // Create new user
  const { data: newUser, error: insertError } = await getSupabaseAdmin()
    .from('users')
    .insert({ username, email })
    .select('*')
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json(newUser as User, { status: 201 });
}
