export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  username: string;
  content: string;
  emoji: string;
  image_url: string | null;
  created_at: string;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface ReactionCount {
  emoji: string;
  count: number;
  reacted: boolean; // whether current user reacted with this emoji
}
