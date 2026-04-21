import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  views?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Comment = {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  created_at: string;
};

export async function getPosts(limit?: number, offset = 0) {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + (limit ? limit - 1 : 99));

    const { data, error } = await query;
    if (error) throw error;
    return data as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data as Post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Post[];
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

export async function getPostComments(postId: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(comment: Omit<Comment, 'id' | 'created_at' | 'approved'>) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...comment, approved: false, created_at: new Date().toISOString() }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, created_at: new Date().toISOString() }])
      .select();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return false;
  }
}
