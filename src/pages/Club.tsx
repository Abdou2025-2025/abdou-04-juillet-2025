import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Plus, Image, Video, BarChart3, Trophy, Users, MoreVertical, Edit, Flag, Star, Trash } from "lucide-react";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { CreatePostModal } from '@/components/ui/CreatePostModal';
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { supabase } from "@/lib/supabaseClient";

export default function Club() {
  const { posts, createPost, updatePost, deletePost, likePost, unlikePost, votePost, loading } = usePosts();
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [votedPolls, setVotedPolls] = useState<{ [postId: string]: number | null }>({});
  const [commentsByPost, setCommentsByPost] = useState<{ [postId: string]: any[] }>({});
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [reportedPosts, setReportedPosts] = useState<string[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<string[]>([]);
  const navigate = useNavigate();
  const stickyRef = useRef<HTMLDivElement>(null);
  const [stickyHeight, setStickyHeight] = useState(140);

  useLayoutEffect(() => {
    function updateHeight() {
      if (stickyRef.current) {
        setStickyHeight(stickyRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleVote = async (postId: string, optionIdx: number) => {
    if (!user) return;
    await votePost(postId, user.id, optionIdx);
    setVotedPolls(prev => ({ ...prev, [postId]: optionIdx }));
  };

  const handleCreatePost = async () => {
    const hasValidPoll = showPoll && pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2;
    if (newPost.trim() || hasValidPoll) {
      const payload: any = {
        user: { name: "Vous", avatar: "", verified: false },
        content: newPost,
        image: postImage,
        video: postVideo,
        poll: hasValidPoll
          ? {
              question: pollQuestion,
              options: pollOptions.filter(opt => opt.trim()).map(opt => ({ text: opt, votes: 0 })),
            }
          : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        type: "post"
      };
      await createPost(payload);
      setNewPost("");
      setPostImage(null);
      setPostVideo(null);
      setShowCreatePost(false);
      setShowPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    }
  };

  const getPostById = (id: string) => posts.find(p => p.id === id);

  const PostCard = ({ post }: { post: any }) => {
    const { likes: likeList, loading: likesLoading, like, unlike } = useLikes(post.id);
    const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
    const [optimisticCount, setOptimisticCount] = useState<number | null>(null);
    const isLiked = optimisticLiked !== null ? optimisticLiked : !!likeList.find(l => l.user_id === user?.id);
    const likeCount = optimisticCount !== null ? optimisticCount : likeList.length;
    useEffect(() => {
      setOptimisticLiked(null);
      setOptimisticCount(null);
    }, [likeList.length, user?.id]);
    const handleLikeClick = async () => {
      if (!user || likesLoading) return;
      if (isLiked) {
        setOptimisticLiked(false);
        setOptimisticCount(likeCount - 1);
        await unlike(user.id);
      } else {
        setOptimisticLiked(true);
        setOptimisticCount(likeCount + 1);
        await like(user.id);
      }
    };
    let displayDate: string = "";
    let tooltip: string = "";
    let dateObj: Date | null = null;
    if (post.timestamp) {
      try {
        dateObj = parseISO(post.timestamp);
        if (!isNaN(dateObj.getTime())) {
          const now = new Date();
          const diffMs = now.getTime() - dateObj.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          if (diffHours < 24) {
            displayDate = formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
          } else {
            displayDate = format(dateObj, "d MMMM, HH:mm", { locale: fr });
          }
          tooltip = format(dateObj, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
        } else {
          displayDate = "Date inconnue";
        }
      } catch {
        displayDate = "Date inconnue";
      }
    } else {
      displayDate = "Date inconnue";
    }
    return (
      <Card className="card-golden animate-slide-up">
        <CardContent className="p-0">
          {/* Header du post */}
          <div className="p-3 pb-2">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10 cursor-pointer" onClick={() => post.user?.name && navigate(`/profile/${post.user.name}`)}>
                  <AvatarImage src={post.user?.avatar || undefined} alt={post.user?.name || "?"} />
                  <AvatarFallback>{post.user?.name ? post.user.name.slice(0, 2) : "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{post.user?.name || "Utilisateur inconnu"}</h3>
                    {post.user?.verified && (
                      <Badge className="bg-primary/10 text-primary text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground" title={tooltip}>
                    {displayDate}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2"><MoreVertical className="w-5 h-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const postToEdit = getPostById(post.id);
                    setEditPostId(postToEdit.id);
                    setNewPost(postToEdit.content || "");
                    setPostImage(postToEdit.image || null);
                    setPostVideo(postToEdit.video || null);
                    let pollObj = postToEdit.poll;
                    if (typeof pollObj === 'string') {
                      try { pollObj = JSON.parse(pollObj); } catch {}
                    }
                    if (pollObj) {
                      setShowPoll(true);
                      setPollQuestion(pollObj.question);
                      setPollOptions(pollObj.options.map((opt: any) => opt.text));
                    } else {
                      setShowPoll(false);
                      setPollQuestion("");
                      setPollOptions(["", ""]);
                    }
                  }}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setReportedPosts(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id]);
                    toast.success(reportedPosts.includes(post.id) ? 'Signalement retiré !' : 'Post signalé !');
                  }}><Flag className="w-4 h-4 mr-2" />{reportedPosts.includes(post.id) ? 'Retirer le signalement' : 'Signaler'}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setFavoritePosts(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id]);
                    toast.success(favoritePosts.includes(post.id) ? 'Retiré des favoris !' : 'Ajouté aux favoris !');
                  }}><Star className="w-4 h-4 mr-2" />{favoritePosts.includes(post.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={async () => {
                    const { error } = await deletePost(post.id);
                    if (!error) {
                      toast.success('Post supprimé !');
                    } else {
                      toast.error('Erreur lors de la suppression');
                    }
                  }}><Trash className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Contenu du post */}
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed">{post.content}</p>
            
            {/* Image */}
            {post.image && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Vidéo */}
            {post.video && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <video 
                  src={post.video} 
                  controls
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Sondage */}
            {post.poll && (
              <div className="mt-3 space-y-3">
                <h4 className="font-semibold text-sm">{post.poll.question}</h4>
                <div className="space-y-2">
                  {post.poll.options.map((option: any, index: number) => {
                    const total = post.poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
                    const percentage = total > 0 ? (option.votes / total) * 100 : 0;
                    const votedIdx = votedPolls[post.id];
                    const hasVoted = typeof votedIdx === 'number';
                    const isSelected = votedIdx === index;
                    return (
                      <Button
                        key={option.text + "-" + index}
                        variant={isSelected ? "default" : hasVoted ? "secondary" : "outline"}
                        type="button"
                        className="w-full h-auto p-3 justify-between hover:bg-primary/5"
                        onClick={() => handleVote(post.id, index)}
                      >
                        <span className="text-sm">{option.text}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {percentage.toFixed(0)}%
                          </span>
                          <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stats */}
            {post.stats && (
              <div className="mt-3 grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{post.stats.goals}</div>
                  <div className="text-xs text-muted-foreground">Buts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{post.stats.assists}</div>
                  <div className="text-xs text-muted-foreground">Passes</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{post.stats.matches}</div>
                  <div className="text-xs text-muted-foreground">Matchs</div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className={`flex items-center gap-2 hover:text-red-500 ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={handleLikeClick}
                disabled={likesLoading}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                <span className="text-xs">{likesLoading ? '...' : likeCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="flex items-center gap-2 text-muted-foreground"
                onClick={() => setShowCommentsFor(post.id)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{commentsByPost[post.id]?.length || 0}</span>
                <span className="text-xs ml-1">Commentaires</span>
              </Button>
              
              <Button variant="ghost" size="sm" type="button" className="flex items-center gap-2 text-muted-foreground"
                onClick={() => {
                  const url = `${window.location.origin}/post/${post.id}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Lien du post copié !");
                }}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs">{post.shares}</span>
              </Button>
            </div>
          </div>

          {/* Étoile de favori */}
          {favoritePosts.includes(post.id) && <Star className="w-5 h-5 text-yellow-400 absolute top-2 right-2 cursor-pointer" onClick={() => setFavoritePosts(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id])} />}
          {reportedPosts.includes(post.id) && <Flag className="w-5 h-5 text-red-400 absolute top-2 right-8 cursor-pointer" onClick={() => setReportedPosts(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id])} />}
        </CardContent>
      </Card>
    );
  };

  function addReplyRecursive(commentsArr, parentId, reply) {
    return commentsArr.map(c =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : { ...c, replies: c.replies ? addReplyRecursive(c.replies, parentId, reply) : [] }
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header sticky */}
      <header ref={stickyRef} className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-3 max-w-[320px] mx-auto">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary animate-float" />
            <div>
              <h1 className="text-gradient-gold font-bold text-base">Club</h1>
              <p className="text-xs text-muted-foreground">Communauté</p>
            </div>
          </div>
        </div>
      </header>
      {/* Bouton Partager + Modale création de post */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <Card className="card-golden">
          <CardContent className="p-4">
            <Button
              className="w-full btn-golden-outline justify-start"
              onClick={() => setShowCreatePost(!showCreatePost)}
            >
              <Plus className="w-5 h-5 mr-3" />
              Partager votre avis sur le Ballon d'Or...
            </Button>
          </CardContent>
        </Card>
        <CreatePostModal
          open={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPost={async (content, image, video, poll) => {
            if (!user) return;
            const hasValidPoll = poll && poll.question && poll.options && poll.options.length >= 2;
            const payload = {
              user_id: user.id,
              content,
              image: image || null,
              video: video || null,
              poll: hasValidPoll ? JSON.stringify(poll) : null,
              likes: 0,
              comments: 0,
              shares: 0,
              timestamp: new Date().toISOString(),
              type: "post"
            };
            await createPost(payload);
            setShowCreatePost(false);
          }}
        />
      </div>
      {/* Feed Club */}
      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        {posts.map(post => (
          <div
            key={post.id}
            className="rounded-2xl"
          >
            <PostCard post={post} />
          </div>
        ))}
      </main>

      {/* Modal de commentaires */}
      {showCommentsFor && (
        <Comments
          postId={showCommentsFor}
          comments={commentsByPost[showCommentsFor] || []}
          onAddComment={comment => setCommentsByPost(prev => ({
            ...prev,
            [showCommentsFor]: [comment, ...(prev[showCommentsFor] || [])]
          }))}
          onAddReply={(commentId, reply) => setCommentsByPost(prev => ({
            ...prev,
            [showCommentsFor]: addReplyRecursive(prev[showCommentsFor] || [], commentId, reply)
          }))}
          onClose={() => setShowCommentsFor(null)}
        />
      )}

      {/* Modal d'édition de post */}
      {editPostId && (
        <form onSubmit={e => e.preventDefault()} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <Card className="card-golden animate-scale-in max-w-md w-full relative">
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-gradient-gold">Modifier la publication</h3>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-[60vh] pb-24">
              <Textarea
                placeholder="Partagez votre avis, vos prédictions, vos analyses..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] border-border/50"
              />
              {/* Aperçu image/vidéo */}
              {(postImage || postVideo) && (
                <div className="relative mt-2">
                  {postImage && (
                    <div className="mb-2">
                      <img src={postImage} alt="Aperçu" className="w-full max-h-48 object-contain rounded-lg" />
                      <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setPostImage(null)}>×</Button>
                    </div>
                  )}
                  {postVideo && (
                    <div className="mb-2">
                      <video src={postVideo} controls className="w-full max-h-48 rounded-lg" />
                      <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setPostVideo(null)}>×</Button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                {/* Bouton image */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setPostImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                      setPostVideo(null);
                      setShowPoll(false);
                    }
                  }}
                />
                <Button size="sm" variant="outline" type="button" className="flex items-center gap-2"
                  onClick={() => imageInputRef.current?.click()} disabled={showPoll}>
                  <Image className="w-4 h-4" />
                  Photo
                </Button>
                {/* Bouton vidéo */}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setPostVideo(ev.target?.result as string);
                      reader.readAsDataURL(file);
                      setPostImage(null);
                      setShowPoll(false);
                    }
                  }}
                />
                <Button size="sm" variant="outline" type="button" className="flex items-center gap-2"
                  onClick={() => videoInputRef.current?.click()} disabled={showPoll}>
                  <Video className="w-4 h-4" />
                  Vidéo
                </Button>
                {/* Bouton sondage */}
                <Button size="sm" variant="outline" className="flex items-center gap-2"
                  onClick={() => { setShowPoll(true); setPostImage(null); setPostVideo(null); }}
                  disabled={!!postImage || !!postVideo || showPoll}>
                  <BarChart3 className="w-4 h-4" />
                  Sondage
                </Button>
              </div>
              {/* Formulaire sondage */}
              {showPoll && (
                <div className="bg-black/30 rounded-xl p-3 space-y-2 mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gradient-gold">Sondage</span>
                    <Button variant="outline" size="sm" onClick={() => setShowPoll(false)}>Annuler</Button>
                  </div>
                  <Input
                    className="mb-2 bg-black/40 text-yellow-200 border-none"
                    placeholder="Question du sondage"
                    value={pollQuestion}
                    onChange={e => setPollQuestion(e.target.value)}
                  />
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                      <Input
                        className="flex-1 bg-black/40 text-yellow-200 border-none"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => setPollOptions(options => options.map((o, i) => i === idx ? e.target.value : o))}
                      />
                      {pollOptions.length > 2 && (
                        <Button size="icon" variant="destructive" onClick={() => setPollOptions(options => options.filter((_, i) => i !== idx))}>×</Button>
                      )}
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="mt-1" onClick={() => setPollOptions(opts => [...opts, ''])}>+ Ajouter une option</Button>
                </div>
              )}
            </CardContent>
            <div className="flex gap-2 px-6 py-4 bg-black/80 backdrop-blur-sm rounded-b-2xl sticky bottom-0 left-0 w-full z-10">
              <Button variant="outline" className="flex-1" onClick={() => setEditPostId(null)}>Annuler</Button>
              <Button className="flex-1 btn-golden" onClick={async () => {
                if (!editPostId) return;
                const updates: any = {
                  content: newPost,
                  image: postImage ?? null,
                  video: postVideo ?? null,
                };
                if (showPoll && pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2) {
                  updates.poll = JSON.stringify({
                    question: pollQuestion,
                    options: pollOptions.filter(opt => opt.trim()).map(opt => ({ text: opt, votes: 0 })),
                  });
                } else {
                  updates.poll = null;
                }
                await updatePost(editPostId, updates);
                setEditPostId(null);
                setNewPost("");
                setPostImage(null);
                setPostVideo(null);
                setShowPoll(false);
                setPollQuestion("");
                setPollOptions(["", ""]);
              }} disabled={!(newPost.trim() || (showPoll && pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2))}>Enregistrer</Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}