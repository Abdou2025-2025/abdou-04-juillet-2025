// Base de données simulée utilisant localStorage pour la persistance
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  club: string;
  photo: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
    rating: number;
  };
  created_at: string;
}

export interface Vote {
  id: string;
  player_id: string;
  user_id: string;
  value: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  video?: string;
  poll?: {
    question: string;
    options: Array<{ text: string; votes: number }>;
  };
  timestamp: string;
  type: 'post';
  likes_count: number;
  comments_count: number;
}

export interface Like {
  id: string;
  post_id?: string;
  player_id?: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user: User;
  content: string;
  timestamp: string;
  replies?: Comment[];
  likes_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender: User;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'video';
}

export interface Conversation {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: User[];
  last_message?: Message;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'reply' | 'vote' | 'message';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

class MockDatabase {
  private storageKey = 'ballonDor_app_data';

  private defaultData = {
    users: [
      {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Utilisateur Test',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        verified: true,
        created_at: new Date().toISOString()
      }
    ] as User[],
    players: [
      {
        id: '1',
        name: 'Kylian Mbappé',
        position: 'Attaquant',
        club: 'Real Madrid',
        photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        stats: { goals: 45, assists: 12, matches: 50, rating: 9.2 },
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Erling Haaland',
        position: 'Attaquant',
        club: 'Manchester City',
        photo: 'https://images.unsplash.com/photo-1556506751-69a7d6fb64dd?w=400&h=400&fit=crop',
        stats: { goals: 52, assists: 8, matches: 48, rating: 9.0 },
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Jude Bellingham',
        position: 'Milieu',
        club: 'Real Madrid',
        photo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=400&fit=crop',
        stats: { goals: 23, assists: 15, matches: 47, rating: 8.8 },
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Pedri González',
        position: 'Milieu',
        club: 'FC Barcelone',
        photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
        stats: { goals: 8, assists: 22, matches: 45, rating: 8.5 },
        created_at: new Date().toISOString()
      }
    ] as Player[],
    posts: [
      {
        id: '1',
        user_id: 'user-123',
        user: { name: 'Alex Martin', avatar: '', verified: true },
        content: 'Mbappé est vraiment impressionnant cette saison ! Ses stats parlent d\'elles-mêmes 🔥',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'post' as const,
        likes_count: 45,
        comments_count: 12
      },
      {
        id: '2',
        user_id: 'user-456',
        user: { name: 'Sophie Durand', avatar: '', verified: false },
        content: 'Qui selon vous mérite le Ballon d\'Or cette année ?',
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
        type: 'post' as const,
        likes_count: 78,
        comments_count: 23
      }
    ] as Post[],
    votes: [] as Vote[],
    likes: [] as Like[],
    comments: [] as Comment[],
    messages: [] as Message[],
    conversations: [] as Conversation[],
    notifications: [] as Notification[]
  };

  private getData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return { ...this.defaultData, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Erreur lors de la lecture des données:', error);
    }
    return this.defaultData;
  }

  private saveData(data: any) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des données:', error);
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.getData().users;
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const data = this.getData();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    data.users.push(newUser);
    this.saveData(data);
    return newUser;
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    return this.getData().players;
  }

  async getPlayerById(id: string): Promise<Player | null> {
    const players = await this.getPlayers();
    return players.find(p => p.id === id) || null;
  }

  // Votes
  async getVotes(playerId?: string): Promise<Vote[]> {
    const votes = this.getData().votes;
    return playerId ? votes.filter(v => v.player_id === playerId) : votes;
  }

  async createVote(vote: Omit<Vote, 'id' | 'created_at'>): Promise<Vote> {
    const data = this.getData();
    const newVote: Vote = {
      ...vote,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    data.votes.push(newVote);
    this.saveData(data);
    return newVote;
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return this.getData().posts;
  }

  async createPost(post: Omit<Post, 'id' | 'timestamp' | 'likes_count' | 'comments_count'>): Promise<Post> {
    const data = this.getData();
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0
    };
    data.posts.unshift(newPost);
    this.saveData(data);
    return newPost;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const data = this.getData();
    const index = data.posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    data.posts[index] = { ...data.posts[index], ...updates };
    this.saveData(data);
    return data.posts[index];
  }

  async deletePost(id: string): Promise<boolean> {
    const data = this.getData();
    const index = data.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    data.posts.splice(index, 1);
    this.saveData(data);
    return true;
  }

  // Likes
  async getLikes(postId?: string, playerId?: string): Promise<Like[]> {
    const likes = this.getData().likes;
    if (postId) return likes.filter(l => l.post_id === postId);
    if (playerId) return likes.filter(l => l.player_id === playerId);
    return likes;
  }

  async createLike(like: Omit<Like, 'id' | 'created_at'>): Promise<Like> {
    const data = this.getData();
    const newLike: Like = {
      ...like,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    data.likes.push(newLike);
    this.saveData(data);
    return newLike;
  }

  async deleteLike(id: string): Promise<boolean> {
    const data = this.getData();
    const index = data.likes.findIndex(l => l.id === id);
    if (index === -1) return false;
    
    data.likes.splice(index, 1);
    this.saveData(data);
    return true;
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = this.getData().messages;
    return messages.filter(m => m.conversation_id === conversationId);
  }

  async createMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const data = this.getData();
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    data.messages.push(newMessage);
    this.saveData(data);
    return newMessage;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const notifications = this.getData().notifications;
    return notifications.filter(n => n.user_id === userId);
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const data = this.getData();
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    data.notifications.push(newNotification);
    this.saveData(data);
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const data = this.getData();
    const notification = data.notifications.find(n => n.id === id);
    if (!notification) return false;
    
    notification.read = true;
    this.saveData(data);
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const data = this.getData();
    const index = data.notifications.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    data.notifications.splice(index, 1);
    this.saveData(data);
    return true;
  }

  // Réinitialiser les données
  async resetData(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }

  // Exporter les données
  async exportData(): Promise<string> {
    return JSON.stringify(this.getData(), null, 2);
  }

  // Importer les données
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      return false;
    }
  }
}

export const mockDB = new MockDatabase();