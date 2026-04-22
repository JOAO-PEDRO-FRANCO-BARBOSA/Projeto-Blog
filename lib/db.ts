import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/i, '');
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string; // UUID
  name: string;
  slug: string;
  description: string | null;
  created_at: string; // timestamp
  updated_at: string | null; // timestamp
};

export type Post = {
  id: string; // UUID
  category_id: string | null; // UUID
  category: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  published: boolean;
  created_at: string; // timestamp
  updated_at: string; // timestamp
  views: number | null;
  keywords: string[] | null;
  read_time: number | null;
};

export type Comment = {
  id: string; // UUID
  post_id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  created_at: string; // timestamp
  updated_at: string | null; // timestamp
};

export type NewsletterSubscriber = {
  id: string; // UUID
  email: string;
  created_at: string; // timestamp
};

type DbResult<T> = {
  data: T;
  errorMessage: string | null;
};

type PostRow = {
  id: string;
  category_id?: string | null;
  category?: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  author: string | null;
  published: boolean | null;
  created_at: string;
  updated_at: string | null;
  views?: number | null;
  keywords?: string[] | null;
  read_time?: number | null;
};

function mapPostRow(row: PostRow, categoryNameFromMap?: string): Post {
  return {
    id: row.id,
    category_id: row.category_id ?? null,
    category: row.category ?? categoryNameFromMap ?? null,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    image: row.image ?? null,
    author: row.author ?? 'Zentrixa',
    published: row.published ?? false,
    created_at: row.created_at,
    updated_at: row.updated_at ?? row.created_at,
    views: row.views ?? null,
    keywords: row.keywords ?? null,
    read_time: row.read_time ?? null,
  };
}

function mapCategoryRow(row: Partial<Category>): Category {
  return {
    id: row.id || '',
    name: row.name || '',
    slug: row.slug || '',
    description: row.description ?? null,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at ?? null,
  };
};

export async function getCategories(): Promise<DbResult<Category[]>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      data: (data || []).map((row) => mapCategoryRow(row as Partial<Category>)),
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      data: [],
      errorMessage: 'Erro ao buscar categorias.',
    };
  }
}

export async function getPosts(limit?: number, offset = 0, categorySlug?: string): Promise<DbResult<Post[]>> {
  try {
    const categoriesResult = await getCategories();
    const categoriesById = new Map(categoriesResult.data.map((cat) => [cat.id, cat.name]));

    let query = supabase.from('posts').select('*').eq('published', true);

    if (categorySlug) {
      const categoryMatch = categoriesResult.data.find((cat) => cat.slug === categorySlug);
      if (categoryMatch) {
        query = query.eq('category_id', categoryMatch.id);
      } else {
        query = query.eq('category', categorySlug);
      }
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + (limit ? limit - 1 : 99));

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const mapped = (data || []).map((row) => {
      const typedRow = row as PostRow;
      return mapPostRow(typedRow, typedRow.category_id ? categoriesById.get(typedRow.category_id) : undefined);
    });

    return {
      data: mapped,
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      data: [],
      errorMessage: 'Erro ao buscar posts.',
    };
  }
}

export async function getPostBySlug(slug: string): Promise<DbResult<Post | null>> {
  try {
    const categoriesResult = await getCategories();
    const categoriesById = new Map(categoriesResult.data.map((cat) => [cat.id, cat.name]));

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      throw error;
    }

    const typedRow = data as PostRow;
    return {
      data: mapPostRow(typedRow, typedRow.category_id ? categoriesById.get(typedRow.category_id) : undefined),
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      data: null,
      errorMessage: 'Erro ao buscar post.',
    };
  }
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<DbResult<Post[]>> {
  try {
    const categoriesResult = await getCategories();
    const categoriesById = new Map(categoriesResult.data.map((cat) => [cat.id, cat.name]));
    let query = supabase
      .from('posts')
      .select('*')
      .neq('id', post.id)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (post.category_id) {
      query = query.eq('category_id', post.category_id);
    } else if (post.category) {
      query = query.eq('category', post.category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const mapped = (data || []).map((row) => {
      const typedRow = row as PostRow;
      return mapPostRow(typedRow, typedRow.category_id ? categoriesById.get(typedRow.category_id) : undefined);
    });

    return {
      data: mapped,
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return {
      data: [],
      errorMessage: 'Erro ao buscar artigos relacionados.',
    };
  }
}

export async function searchPosts(query: string): Promise<DbResult<Pick<Post, 'id' | 'title' | 'slug' | 'excerpt'>[]>> {
  try {
    const safeQuery = query.trim();
    if (safeQuery.length < 2) {
      return { data: [], errorMessage: null };
    }

    const likeQuery = `%${safeQuery}%`;

    const { data, error } = await supabase
      .from('posts')
      .select('id,title,slug,excerpt')
      .eq('published', true)
      .or(`title.ilike.${likeQuery},excerpt.ilike.${likeQuery},content.ilike.${likeQuery}`)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      throw error;
    }

    return {
      data: (data || []).map((row) => ({
        id: (row as { id: string }).id,
        title: (row as { title: string }).title,
        slug: (row as { slug: string }).slug,
        excerpt: (row as { excerpt: string | null }).excerpt ?? '',
      })),
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    return {
      data: [],
      errorMessage: 'Erro ao buscar posts.',
    };
  }
}

export async function getApprovedComments(postId: string): Promise<DbResult<Comment[]>> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: (data || []) as Comment[],
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      data: [],
      errorMessage: 'Erro ao buscar comentários.',
    };
  }
}

export async function createComment(comment: {
  post_id: string;
  name: string;
  email: string;
  content: string;
}): Promise<DbResult<Comment | null>> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          ...comment,
          approved: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return {
      data: (data?.[0] as Comment | undefined) ?? null,
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      data: null,
      errorMessage: 'Erro ao enviar comentário.',
    };
  }
}

export async function subscribeNewsletter(email: string): Promise<DbResult<NewsletterSubscriber | null>> {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, created_at: new Date().toISOString() }])
      .select();

    if (error) {
      throw error;
    }

    return {
      data: (data?.[0] as NewsletterSubscriber | undefined) ?? null,
      errorMessage: null,
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      data: null,
      errorMessage: 'Erro ao inscrever e-mail.',
    };
  }
}
