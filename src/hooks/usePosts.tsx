import { useState, useEffect, useCallback } from 'react';

export interface User {
  name: string;
  avatar: string;
  verified: boolean;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface Post {
  id: string;
  user_id: string;
  user: User;
  content: string;
  image: string | null;
  video: string | null;
  poll: Poll | null;
  timestamp: string;
  type: 'post';
}

// Données simulées pour les posts
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: 'user-123',
    user: { name: 'Alex Martin', avatar: '', verified: true },
    content: 'Mbappé est vraiment impressionnant cette saison ! Ses stats parlent d\'elles-mêmes 🔥',
    image: null,
    video: null,
    poll: null,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'post'
  },
  {
    id: '2',
    user_id: 'user-456',
    user: { name: 'Sophie Durand', avatar: '', verified: false },
    content: 'Qui selon vous mérite le Ballon d\'Or cette année ?',
    image: null,
    video: null,
    poll: {
      question: 'Votre favori pour le Ballon d\'Or 2025 ?',
      options: [
        { text: 'Mbappé', votes: 45 },
        { text: 'Haaland', votes: 38 },
        { text: 'Bellingham', votes: 32 },
        { text: 'Autre', votes: 15 }
      ]
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: 'post'
  }
];

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (payload: Partial<Post>) => {
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        user_id: payload.user_id || 'user-123',
        user: { name: 'Vous', avatar: '', verified: false },
        content: payload.content || '',
        image: payload.image || null,
        video: payload.video || null,
        poll: payload.poll || null,
        timestamp: new Date().toISOString(),
        type: 'post'
      };
      
      setPosts(prev => [newPost, ...prev]);
      return { data: newPost, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, []);

  const updatePost = useCallback(async (id: string, updates: Partial<Post>) => {
    try {
      const updatedPost = posts.find(p => p.id === id);
      if (!updatedPost) {
        return { data: null, error: 'Post non trouvé' };
      }

      const newPost: Post = {
        ...updatedPost,
        ...updates
      };

      setPosts(prev => prev.map(p => p.id === id ? newPost : p));
      return { data: newPost, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, [posts]);

  const deletePost = useCallback(async (id: string) => {
    try {
      setPosts(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return { error: errorMessage };
    }
  }, []);

  const likePost = useCallback(async (postId: string, userId: string) => {
    try {
      // Simulation d'un like
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      return { error: errorMessage };
    }
  }, []);

  const unlikePost = useCallback(async (postId: string, userId: string) => {
    try {
      // Simulation d'un unlike
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      return { error: errorMessage };
    }
  }, []);

  const votePost = useCallback(async (postId: string, userId: string, value: number) => {
    try {
      // Simulation d'un vote
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      return { error: errorMessage };
    }
  }, []);

  return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost, likePost, unlikePost, votePost };
}