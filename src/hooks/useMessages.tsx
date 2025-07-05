import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video';
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    
    try {
      // Simulation de messages
      const mockMessages: Message[] = [
        {
          id: '1',
          conversation_id: conversationId,
          sender_id: 'user-123',
          content: 'Salut ! Comment ça va ?',
          timestamp: new Date().toISOString(),
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) fetchMessages();
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(async (payload: Partial<Message>) => {
    if (!conversationId) return { data: null, error: 'Conversation ID manquant' };
    
    try {
      const newMessage: Message = { 
        id: Date.now().toString(), 
        conversation_id: conversationId,
        sender_id: payload.sender_id || 'current-user',
        content: payload.content || '',
        timestamp: new Date().toISOString(),
        type: payload.type || 'text'
      };
      setMessages(prev => [...prev, newMessage]);
      return { data: newMessage, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, [conversationId]);

  return { messages, loading, error, fetchMessages, sendMessage };
}