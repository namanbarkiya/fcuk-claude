# fcuk claude

the wall anthropic doesn't want you to see.

a rage-posting platform where devs tell Claude AI exactly what they think. rate limits, hallucinations, deleted code, broken production. all the rage, none of the apologies.

**proudly built using claude code.**

## Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind v4 + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: localStorage (username + email, no real auth)
- **Fonts**: Geist Sans + Libre Baskerville (serif headings)
- **Theme**: Full dark mode, Claude-inspired warm palette

## Features

- Bento grid feed layout (4-col desktop, 2-col mobile, mixed card sizes)
- Emoji reactions with popup picker (batched API, no N+1)
- Infinite scroll with cursor-based pagination
- Sort by: latest, most reacted, longest rants
- Image URL attachments on posts
- Multilingual support (EN, DE, JP, FR, ES, PT)
- Simple login (username + email stored in localStorage)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd claude-roast
npm install
```

### 2. Supabase

Create a project at [supabase.com](https://supabase.com), then run these in the SQL Editor (in order):

1. `supabase-schema.sql` - tables, indexes, RLS policies, RPC functions

### 3. Environment variables

Copy `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/
    page.tsx              # main page (hero + feed + login modal)
    layout.tsx            # root layout, fonts, SEO metadata
    globals.css           # tailwind theme tokens (dark mode)
    api/
      users/route.ts      # POST - create/login user
      posts/route.ts      # GET - paginated feed + batched reactions
                          # POST - create post
      posts/[id]/
        reactions/route.ts # GET/POST - reaction toggle
  components/
    Header.tsx            # fixed header with logo + user
    LoginForm.tsx         # modal login (username + email)
    PostInput.tsx         # composer with emoji picker + image URL
    PostCard.tsx          # bento card with reactions
    PostFeed.tsx          # bento grid + infinite scroll + sort
  lib/
    supabase.ts           # client-side supabase (lazy init)
    supabase-server.ts    # server-side supabase (service role)
  types/
    index.ts              # User, Post, Reaction, ReactionCount

SQL files (run in Supabase SQL Editor):
  supabase-schema.sql     # schema + RLS + RPC functions
```

## API

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users` | Create or login user by username |
| GET | `/api/posts?sort=latest&limit=20&cursor=...&user_id=...` | Paginated feed with batched reactions |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/[id]/reactions?user_id=...` | Get reactions for a post |
| POST | `/api/posts/[id]/reactions` | Toggle a reaction |

## Deploy

```bash
npm run build   # verify it builds
vercel           # deploy to Vercel
```

Set the three env vars in Vercel project settings.
