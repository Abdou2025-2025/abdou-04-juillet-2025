import { useState, useEffect, useCallback } from 'react';

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    // Simulation de messages
    const mockMessages = [];
    setMessages(mockMessages);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) fetchMessages();
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(async (payload) => {
    const newMessage = { id: Date.now().toString(), ...payload };
    setMessages(prev => [...prev, newMessage]);
    return { data: newMessage, error: null };
  }, []);

  return { messages, loading, error, fetchMessages, sendMessage };
}