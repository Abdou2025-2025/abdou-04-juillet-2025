import { useState, useEffect, useCallback } from 'react';

// Données simulées pour les posts
const mockPosts = [
  {
    id: '1',
    user_id: 'user-123',
    user: { name: 'Alex Martin', avatar: '', verified: true },
    content: 'Mbappé est vraiment impressionnant cette saison ! Ses stats parlent d\'elles-mêmes 🔥',
    image: null,
    video: null,
    poll: null,
    likes: 45,
    comments: 12,
    shares: 8,
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
    likes: 23,
    comments: 18,
    shares: 5,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: 'post'
  }
];

export function usePosts() {
  const [posts, setPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (payload) => {
    try {
      const newPost = {
        id: Date.now().toString(),
        user_id: payload.user_id || 'user-123',
        user: { name: 'Vous', avatar: '', verified: false },
        content: payload.content,
        image: payload.image || null,
        video: payload.video || null,
        poll: payload.poll ? (typeof payload.poll === 'string' ? JSON.parse(payload.poll) : payload.poll) : null,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        type: 'post'
      };
      
      setPosts(prev => [newPost, ...prev]);
      return { data: newPost, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }, []);

  const updatePost = useCallback(async (id, updates) => {
    try {
      const updatedPost = posts.find(p => p.id === id);
      if (!updatedPost) {
        return { data: null, error: { message: 'Post non trouvé' } };
      }

      const newPost = {
        ...updatedPost,
        ...updates,
        poll: updates.poll ? (typeof updates.poll === 'string' ? JSON.parse(updates.poll) : updates.poll) : updatedPost.poll
      };

      setPosts(prev => prev.map(p => p.id === id ? newPost : p));
      return { data: newPost, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }, [posts]);

  const deletePost = useCallback(async (id) => {
    try {
      setPosts(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const likePost = useCallback(async (postId, userId) => {
    try {
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const unlikePost = useCallback(async (postId, userId) => {
    try {
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p
      ));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const votePost = useCallback(async (postId, userId, value) => {
    try {
      // Simulation d'un vote
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost, likePost, unlikePost, votePost };
}