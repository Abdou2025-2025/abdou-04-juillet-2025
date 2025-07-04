import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages();
    const channel = supabase.channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, fetchMessages)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(async (payload) => {
    return await supabase.from('messages').insert([payload]);
  }, []);

  return { messages, loading, error, fetchMessages, sendMessage };
} 