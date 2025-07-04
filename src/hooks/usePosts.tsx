import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
    const channel = supabase.channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const createPost = useCallback(async (payload) => {
    const { data, error } = await supabase.from('posts').insert([payload]).select().single();
    if (!error) setPosts((prev) => [data, ...prev]);
    return { data, error };
  }, []);

  const updatePost = useCallback(async (id, updates) => {
    // Filter out undefined and null values to prevent 400 errors
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    // Ensure poll is properly serialized if it exists
    if (cleanUpdates.poll && typeof cleanUpdates.poll === 'object') {
      cleanUpdates.poll = JSON.stringify(cleanUpdates.poll);
    }
    
    const { data, error } = await supabase
      .from('posts')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();
      
    if (!error) {
      setPosts((prev) => prev.map(p => p.id === id ? data : p));
    } else {
      console.error('Error updating post:', error);
    }
    return { data, error };
  }, []);

  const deletePost = useCallback(async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) setPosts((prev) => prev.filter(p => p.id !== id));
    return { error };
  }, []);

  const likePost = useCallback(async (postId, userId) => {
    return await supabase.from('likes').insert([{ player_id: postId, user_id: userId }]);
  }, []);

  const unlikePost = useCallback(async (postId, userId) => {
    return await supabase.from('likes').delete().eq('player_id', postId).eq('user_id', userId);
  }, []);

  const votePost = useCallback(async (postId, userId, value) => {
    return await supabase.from('votes').upsert([{ post_id: postId, user_id: userId, value }]);
  }, []);

  return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost, likePost, unlikePost, votePost };
}