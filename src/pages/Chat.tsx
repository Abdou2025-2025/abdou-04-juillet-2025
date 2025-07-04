import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Plus, Search, MoreVertical, Camera, Smile } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input as ShadInput } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, parse, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import clsx from "clsx";

// Données de test pour les conversations
const conversationsData = [
  {
    id: "1",
    type: "private",
    name: "Alex Martin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    lastMessage: "Mbappé va gagner c'est sûr !",
    timestamp: "14:32",
    unread: 2,
    online: true
  },
  {
    id: "2",
    type: "group",
    name: "🏆 Fans Real Madrid",
    avatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
    lastMessage: "Sophie: Les stats de Bellingham sont folles",
    timestamp: "13:45",
    unread: 5,
    participants: 47
  },
  {
    id: "3",
    type: "private",
    name: "Sophie Durand",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    lastMessage: "Tu as vu le dernier match ?",
    timestamp: "12:20",
    unread: 0,
    online: false
  },
  {
    id: "4",
    type: "group",
    name: "⚽ Débat Ballon d'Or",
    avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
    lastMessage: "Marco: Haaland mérite sa place",
    timestamp: "11:55",
    unread: 12,
    participants: 156
  }
];

type Message = {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: string;
  status: string;
  image?: string;
};

const messagesData: Message[] = [
  {
    id: "1",
    senderId: "other",
    senderName: "Alex Martin",
    content: "Salut ! Tu as vu les dernières stats de Mbappé ?",
    timestamp: "14:30",
    status: "read"
  },
  {
    id: "2",
    senderId: "me",
    content: "Oui ! Il est vraiment en forme cette saison",
    timestamp: "14:31",
    status: "read"
  },
  {
    id: "3",
    senderId: "other",
    senderName: "Alex Martin",
    content: "Mbappé va gagner c'est sûr !",
    timestamp: "14:32",
    status: "delivered"
  }
];

const fakeUsers = ["Alex", "Sophie", "Marco", "Fatima", "Yassine", "Lina", "Paul", "Sarah"];

// Helper pour détecter si le message est un unique emoji (unicode)
function isSingleEmoji(text: string) {
  // Regex unicode emoji (large coverage)
  return /^\p{Emoji}$/u.test(text.trim()) || /^\p{Extended_Pictographic}$/u.test(text.trim());
}

// Utilitaire pour formater la date de groupe
function formatDateGroup(dateStr: string) {
  const [h, m] = dateStr.split(":");
  const now = new Date();
  const msgDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m));
  if (isToday(msgDate)) return "Aujourd'hui";
  if (isYesterday(msgDate)) return "Hier";
  return format(msgDate, "EEEE d MMMM yyyy", { locale: fr });
}

// Regroupe les messages par date (jour)
function groupMessagesByDay(messages: Message[]) {
  const groups: { date: string, items: Message[] }[] = [];
  messages.forEach(msg => {
    // On suppose timestamp = "HH:mm"
    const [h, m] = msg.timestamp.split(":");
    const now = new Date();
    const msgDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m));
    const key = msgDate.toDateString();
    let group = groups.find(g => g.date === key);
    if (!group) {
      group = { date: key, items: [] };
      groups.push(group);
    }
    group.items.push(msg);
  });
  return groups;
}

// Helper pour parser le timestamp HH:mm en Date du jour
function parseMsgTimestamp(ts: string) {
  const [h, m] = ts.split(":");
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m));
}

// Helper pour format Facebook-like
function formatMsgTimestamp(ts: string) {
  const msgDate = parseMsgTimestamp(ts);
  const now = new Date();
  const diffMs = now.getTime() - msgDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  let displayDate = "";
  if (diffHours < 24 && isToday(msgDate)) {
    displayDate = formatDistanceToNow(msgDate, { addSuffix: true, locale: fr });
  } else {
    displayDate = format(msgDate, "d MMMM, HH:mm", { locale: fr });
  }
  const tooltip = format(msgDate, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
  return { displayDate, tooltip };
}

function parseMembersCount(str: string) {
  if (str.includes("K")) {
    return Math.round(parseFloat(str) * 1000);
  }
  return parseInt(str.replace(/[^0-9]/g, ""), 10);
}

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState(conversationsData);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<string[]>(fakeUsers);
  const [footerHeight, setFooterHeight] = useState(0);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiList = ["😀","😂","😍","🥳","😎","😭","😡","👍","🙏","🔥","⚽","🏆"];
  const [messagesByConversation, setMessagesByConversation] = useState<{ [convId: string]: Message[] }>({});
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupWelcome, setGroupWelcome] = useState("");
  const [groupStep, setGroupStep] = useState(1);
  const [groupAvatar, setGroupAvatar] = useState("");
  const [groupUserSearch, setGroupUserSearch] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showSoloModal, setShowSoloModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("footer-nav");
    if (footer) {
      const resize = () => setFooterHeight(footer.offsetHeight);
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  const handleSendMessage = () => {
    if (message.trim() || selectedImage) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "me",
        content: message,
        timestamp: new Date().toLocaleTimeString("fr-FR", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        status: "sent",
        ...(selectedImage ? { image: selectedImage } : {})
      };
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedChat || ""]: [
          ...(prev[selectedChat || ""] || []),
          newMessage
        ]
      }));
      setMessage("");
      setSelectedImage(null);
    }
  };

  if (selectedChat) {
    const chat = conversations.find(c => c.id === selectedChat);
    const isGroup = chat?.type === "group";
    
    const groupMembers = chat && chat.type === 'group' && Array.isArray((chat as any).members) ? (chat as any).members : [];
    
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col">
        {/* Header de conversation */}
        <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${chat?.name}`)}>
              <Button size="sm" variant="ghost" onClick={e => {e.stopPropagation(); setSelectedChat(null);}}>
                ←
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={chat?.avatar} alt={chat?.name} />
                <AvatarFallback>{chat?.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm hover:underline">{chat?.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {chat?.type === "group" 
                    ? `${chat.participants} participants`
                    : "En ligne"
                  }
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost"><MoreVertical className="w-5 h-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setConversations(prev => prev.filter(c => c.id !== chat?.id));
                  setSelectedChat(null);
                  toast.success("Conversation supprimée");
                }}>Supprimer la conversation</DropdownMenuItem>
                {isGroup && <DropdownMenuItem onClick={() => {
                  setMessagesByConversation(prev => ({
                    ...prev,
                    [chat.id]: [
                      ...(prev[chat.id] || []),
                      {
                        id: Date.now().toString(),
                        senderId: "system",
                        senderName: "Système",
                        content: "Vous avez quitté le groupe.",
                        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                        status: "sent"
                      }
                    ]
                  }));
                  setTimeout(() => {
                    setConversations(prev => prev.filter(c => c.id !== chat.id));
                    setMessagesByConversation(prev => {
                      const copy = { ...prev };
                      delete copy[chat.id];
                      return copy;
                    });
                    setSelectedChat(null);
                  }, 500);
                }}>Quitter le groupe</DropdownMenuItem>}
                {isGroup && <DropdownMenuItem onClick={() => setShowMembersModal(true)}>Voir les membres</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Messages */}
        <div
          className="flex-1 max-w-md mx-auto w-full p-4 space-y-4 overflow-y-auto overflow-x-hidden"
          style={{ paddingBottom: footerHeight + 64 }}
        >
          {groupMessagesByDay(messagesByConversation[selectedChat] || []).map(group => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-4">
                <span className="bg-card px-4 py-1 rounded-full text-xs text-muted-foreground shadow border font-medium">
                  {formatDateGroup(group.items[0].timestamp)}
                </span>
              </div>
              {group.items.map((msg) => {
                const { displayDate, tooltip } = formatMsgTimestamp(msg.timestamp);
                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="relative group">
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl animate-slide-up break-words ${
                          msg.senderId === "me"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-muted-foreground"
                        }`}
                        style={{wordBreak:'break-word'}}
                      >
                        {msg.image ? (
                          <div className="mb-2 rounded bg-gradient-to-br from-yellow-50 to-yellow-100 p-1 w-full max-w-full flex justify-center">
                            <img src={msg.image} alt="upload" className="max-w-full rounded" />
                          </div>
                        ) : null}
                        {isSingleEmoji(msg.content) ? (
                          <>
                            <p className="text-4xl flex items-center justify-center min-h-[2.5rem]">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70" title={tooltip}>{displayDate}</span>
                              {msg.senderId === "me" && (
                                <span className={clsx("text-xs flex items-center gap-1", msg.status === "read" ? "text-blue-500" : "text-muted-foreground")}
                                >
                                  {msg.status === "read" && <span>✓✓</span>}
                                  {msg.status === "delivered" && <span>✓✓</span>}
                                  {msg.status === "sent" && <span>✓</span>}
                                  {msg.status === "pending" && <span>⏳</span>}
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {isGroup && msg.senderName && (
                              <span
                                className="font-semibold text-xs mr-1 cursor-pointer hover:underline"
                                onClick={() => navigate(`/profile/${msg.senderName}`)}
                              >
                                {msg.senderName}
                              </span>
                            )}
                            <p className="text-sm break-words" style={{wordBreak:'break-word'}}>
                              {msg.content}
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70" title={tooltip}>{displayDate}</span>
                              {msg.senderId === "me" && (
                                <span className={clsx("text-xs flex items-center gap-1", msg.status === "read" ? "text-blue-500" : "text-muted-foreground")}
                                >
                                  {msg.status === "read" && <span>✓✓</span>}
                                  {msg.status === "delivered" && <span>✓✓</span>}
                                  {msg.status === "sent" && <span>✓</span>}
                                  {msg.status === "pending" && <span>⏳</span>}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Input de message */}
        <div
          className="bg-card/95 backdrop-blur-md border-t border-border/50 p-4 max-w-md mx-auto w-full fixed left-1/2 -translate-x-1/2 z-40"
          style={{ bottom: footerHeight }}
        >
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setSelectedImage(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Button size="sm" variant="ghost" onClick={() => document.getElementById("file-upload")?.click()}>
              <Camera className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Tapez votre message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                className=""
              />
            </div>
            <Button
              size="sm"
              className="btn-golden"
              onClick={() => {
                handleSendMessage();
                if (selectedImage) setSelectedImage(null);
              }}
              disabled={!message.trim() && !selectedImage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {selectedImage && (
            <div className="mt-2 flex items-center gap-2">
              <img src={selectedImage} alt="preview" className="max-h-24 rounded" />
              <Button size="icon" variant="ghost" onClick={() => setSelectedImage(null)}>✕</Button>
            </div>
          )}
        </div>

        {/* MODALE MEMBRES DU GROUPE */}
        {showMembersModal && isGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-xs animate-fade-in flex flex-col gap-6 relative text-white">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setShowMembersModal(false)} aria-label="Fermer">✕</button>
              <h2 className="text-xl font-bold text-center mb-4">Membres du groupe</h2>
              <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                {groupMembers.map((user: string) => (
                  <div key={user} className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 rounded-lg p-2 transition"
                    onClick={() => { setShowMembersModal(false); navigate(`/profile/${user}`); }}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user)}`} alt={user} />
                      <AvatarFallback>{user.slice(0,2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white">{user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gradient-gold">Discussions</h1>
          <Button size="sm" className="btn-golden" onClick={() => setShowNewChatModal(true)}>
            <Plus className="w-5 h-5 mr-2" />Nouveau
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4 animate-fade-in">
        {/* Conversations */}
        <div className="space-y-2">
          {conversations.map((conversation, index) => (
            <Card
              key={conversation.id}
              className="card-golden cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedChat(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {conversation.type === "private" && conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate flex items-center gap-1">
                        {conversation.type === "group" && <span title="Groupe" className="text-lg">👥</span>}
                        {conversation.name}
                        {conversation.type === "group" && <span className="ml-1 text-[10px] bg-muted px-2 py-0.5 rounded-full">Groupe</span>}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    
                    {conversation.type === "group" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.participants} participants
                      </p>
                    )}
                  </div>
                  
                  {conversation.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Groupes populaires */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gradient-gold">
            Groupes populaires
          </h3>
          
          <div className="grid gap-3">
            {[
              {
                name: "🇫🇷 Supporters France",
                members: "2.3K membres",
                avatar: "https://images.unsplash.com/photo-1551038442-8e68eae1c3b9?w=100&h=100&fit=crop"
              },
              {
                name: "⚽ Débat Football",
                members: "1.8K membres", 
                avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop"
              }
            ].map((group, index) => (
              <Card key={index} className="card-golden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback>{group.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{group.name}</h4>
                      <p className="text-xs text-muted-foreground">{group.members}</p>
                    </div>
                    <Button size="sm" variant="outline" className="btn-golden-outline" onClick={() => {
                      const groupId = `popular-${group.name}`;
                      setConversations(prev => [
                        {
                          id: groupId,
                          type: "group",
                          name: group.name,
                          avatar: group.avatar,
                          members: ["Vous"],
                          lastMessage: `Bienvenue dans ${group.name} !`,
                          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                          unread: 0,
                          participants: parseMembersCount(group.members)
                        },
                        ...prev
                      ]);
                      setMessagesByConversation(prev => ({
                        ...prev,
                        [groupId]: [{
                          id: Date.now().toString(),
                          senderId: "system",
                          senderName: "Système",
                          content: `Bienvenue dans ${group.name} !`,
                          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                          status: "sent"
                        }]
                      }));
                      setSelectedChat(groupId);
                    }}>Rejoindre</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-xs animate-fade-in flex flex-col gap-6 relative text-white">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setShowGroupModal(false)} aria-label="Fermer">✕</button>
            <h2 className="text-xl font-bold text-center mb-2">Créer un groupe</h2>
            <input
              className="w-full border border-zinc-700 rounded p-2 bg-zinc-800 text-white placeholder:text-zinc-400 mb-2"
              placeholder="Nom du groupe"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />
            <div className="mb-2">
              <input
                className="w-full border border-zinc-700 rounded p-2 bg-zinc-800 text-white placeholder:text-zinc-400"
                placeholder="Rechercher un utilisateur..."
                value={groupUserSearch}
                onChange={e => setGroupUserSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {filteredUsers.filter(u => u.toLowerCase().includes(groupUserSearch.toLowerCase())).map(user => (
                <label key={user} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupMembers.includes(user)}
                    onChange={e => {
                      if (e.target.checked) setGroupMembers(m => [...m, user]);
                      else setGroupMembers(m => m.filter(u2 => u2 !== user));
                    }}
                    className="accent-yellow-500"
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user)}`} alt={user} />
                    <AvatarFallback>{user.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-white">{user}</span>
                </label>
              ))}
              {filteredUsers.filter(u => u.toLowerCase().includes(groupUserSearch.toLowerCase())).length === 0 && (
                <span className="text-sm text-zinc-400 text-center">Aucun utilisateur trouvé</span>
              )}
            </div>
            <button
              className="mt-4 w-full py-2 rounded-lg bg-yellow-500 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!groupName || groupMembers.length < 2}
              onClick={() => {
                if (groupName && groupMembers.length >= 2) {
                  const groupId = Date.now().toString();
                  const newGroup = {
                    id: groupId,
                    type: "group",
                    name: groupName,
                    avatar: groupAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(groupName)}`,
                    members: groupMembers,
                    lastMessage: `Bienvenue dans ${groupName} !`,
                    timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                    unread: 0,
                    participants: groupMembers.length + 1
                  };
                  setConversations(prev => [newGroup, ...prev]);
                  setMessagesByConversation(prev => ({
                    ...prev,
                    [groupId]: [{
                      id: Date.now().toString(),
                      senderId: "me",
                      senderName: "Vous",
                      content: `Bienvenue dans ${groupName} !`,
                      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                      status: "sent"
                    }]
                  }));
                  setSelectedChat(groupId);
                  setShowGroupModal(false);
                  setGroupName("");
                  setGroupMembers([]);
                  setGroupAvatar("");
                  setGroupUserSearch("");
                  toast.success(`Groupe ${groupName} créé !`);
                }
              }}
            >
              Créer le groupe
            </button>
          </div>
        </div>
      )}

      {/* MODALE NOUVEAU CHAT (CHOIX) */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-xs animate-fade-in flex flex-col gap-6 relative text-white">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setShowNewChatModal(false)} aria-label="Fermer">✕</button>
            <h2 className="text-xl font-bold text-center mb-2">Nouveau chat</h2>
            <div className="flex flex-col gap-4">
              <button
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition group"
                onClick={() => { setShowSoloModal(true); setShowNewChatModal(false); }}
              >
                <Plus className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition" />
                <span className="font-medium text-white">Créer une discussion solo</span>
              </button>
              <button
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition group"
                onClick={() => { setShowGroupModal(true); setShowNewChatModal(false); }}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full"><span className="text-lg">👥</span></span>
                <span className="font-medium text-white">Créer un groupe</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SOLO (fond noir, texte blanc, style harmonisé) */}
      {showSoloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-xs animate-fade-in flex flex-col gap-6 relative text-white">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setShowSoloModal(false)} aria-label="Fermer">✕</button>
            <h2 className="text-xl font-bold text-center mb-2">Nouvelle discussion</h2>
            <div className="mb-2">
              <input
                className="w-full border border-zinc-700 rounded p-2 bg-zinc-800 text-white placeholder:text-zinc-400"
                placeholder="Rechercher un utilisateur..."
                value={groupUserSearch}
                onChange={e => setGroupUserSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {filteredUsers.filter(u => u.toLowerCase().includes(groupUserSearch.toLowerCase())).map(user => (
                <button
                  key={user}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition"
                  onClick={() => {
                    // Créer la conversation privée si elle n'existe pas déjà
                    const exists = conversations.some(c => c.type === "private" && c.name === user);
                    if (!exists) {
                      const newConv = {
                        id: Date.now().toString(),
                        type: "private",
                        name: user,
                        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user)}`,
                        lastMessage: "",
                        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                        unread: 0,
                        online: true
                      };
                      setConversations(prev => [newConv, ...prev]);
                      setMessagesByConversation(prev => ({ ...prev, [newConv.id]: [] }));
                      setSelectedChat(newConv.id);
                    } else {
                      const conv = conversations.find(c => c.type === "private" && c.name === user);
                      setSelectedChat(conv?.id || null);
                    }
                    setShowSoloModal(false);
                    setGroupUserSearch("");
                  }}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user)}`} alt={user} />
                    <AvatarFallback>{user.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-white">{user}</span>
                </button>
              ))}
              {filteredUsers.filter(u => u.toLowerCase().includes(groupUserSearch.toLowerCase())).length === 0 && (
                <span className="text-sm text-zinc-400 text-center">Aucun utilisateur trouvé</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}