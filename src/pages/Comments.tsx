import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface Comment {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  timestamp: string;
  replies?: Comment[];
}

interface CommentsProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onAddReply: (commentId: string, reply: Comment) => void;
  onClose: () => void;
}

const initialComments: Comment[] = [
  {
    id: "c1",
    user: { name: "Alex", avatar: "" },
    content: "Super post !",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    replies: [
      {
        id: "r1",
        user: { name: "Sophie", avatar: "" },
        content: "Je suis d'accord !",
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      },
    ],
  },
];

function CommentThread({ comment, onReply, replyTo, setReplyTo, replyText, setReplyText, handleAddReply, navigate, setShowThreadModal, openedReplies, setOpenedReplies }: any) {
  const repliesToShow = comment.replies?.slice(0, 3) || [];
  const hasMoreReplies = (comment.replies?.length || 0) > 3;
  const isOpen = openedReplies[comment.id];

  return (
    <div className="pl-0 md:pl-4 border-l-2 border-muted space-y-2 mt-2">
      <div className="flex gap-2 items-start">
        <Avatar className="w-8 h-8 cursor-pointer" onClick={() => navigate(`/profile/${comment.user.name}`)}>
          {comment.user.avatar ? (
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          ) : (
            <AvatarFallback>{comment.user.name.slice(0,2)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold text-sm">{comment.user.name}</div>
          <div className="text-xs text-muted-foreground mb-1">
            {formatDistanceToNow(parseISO(comment.timestamp), { addSuffix: true, locale: fr })}
          </div>
          <div className="text-sm mb-2">{comment.content}</div>
          <Button size="sm" variant="ghost" type="button" onClick={() => setReplyTo(comment.id)}>Répondre</Button>
          {replyTo === comment.id && (
            <div className="mt-2">
              <Textarea
                placeholder="Votre réponse..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="min-h-[32px]"
              />
              <div className="flex justify-end mt-1 gap-2">
                <Button size="sm" type="button" variant="outline" onClick={() => {setReplyTo(null); setReplyText("");}}>Annuler</Button>
                <Button size="sm" type="button" onClick={() => {
                  handleAddReply(comment.id, {
                    id: Date.now().toString(),
                    user: { name: "Vous", avatar: "" },
                    content: replyText,
                    timestamp: new Date().toISOString(),
                    replies: []
                  });
                  setReplyTo(null);
                  setReplyText("");
                }} disabled={!replyText.trim()}>Répondre</Button>
              </div>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && !isOpen && (
            <Button size="sm" variant="outline" className="mt-2" onClick={() => setOpenedReplies((prev: any) => ({...prev, [comment.id]: true}))}>
              Voir les réponses ({comment.replies.length})
            </Button>
          )}
          {isOpen && (
            <>
              {repliesToShow.map(reply => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  replyTo={replyTo}
                  setReplyTo={setReplyTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleAddReply={handleAddReply}
                  navigate={navigate}
                  setShowThreadModal={setShowThreadModal}
                  openedReplies={openedReplies}
                  setOpenedReplies={setOpenedReplies}
                />
              ))}
              {hasMoreReplies && (
                <Button size="sm" variant="outline" className="mt-2" onClick={() => setShowThreadModal({comment, path: []})}>Voir plus de réponses</Button>
              )}
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => setOpenedReplies((prev: any) => ({...prev, [comment.id]: false}))}>Masquer les réponses</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function addReplyRecursive(commentsArr, parentId, reply) {
  return commentsArr.map(c =>
    c.id === parentId
      ? { ...c, replies: [...(c.replies || []), reply] }
      : { ...c, replies: c.replies ? addReplyRecursive(c.replies, parentId, reply) : [] }
  );
}

export default function Comments({ postId, comments, onAddComment, onAddReply, onClose }: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteUsers, setAutocompleteUsers] = useState<string[]>([]);
  const [notifiedUsers, setNotifiedUsers] = useState<string[]>([]);
  const [showThreadModal, setShowThreadModal] = useState<{comment: Comment, path: string[]} | null>(null);
  const [openedReplies, setOpenedReplies] = useState<{[id: string]: boolean}>({});
  const navigate = useNavigate();

  const fakeUsers = ["Alex", "Sophie", "Marco", "Fatima", "Yassine", "Lina", "Paul", "Sarah"];
  const allUsers = Array.from(new Set([
    ...comments.filter(Boolean).map((c: any) => c?.user?.name).filter(Boolean),
    ...comments.filter(Boolean).flatMap((c: any) => (c.replies || []).filter(Boolean).map((r: any) => r?.user?.name).filter(Boolean))
  ])).filter(u => u && u !== "Vous");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment({
        id: Date.now().toString(),
        user: { name: "Vous", avatar: "" },
        content: newComment,
        timestamp: new Date().toISOString(),
        replies: []
      });
      const mentions = Array.from(new Set((newComment.match(/@([\w]+)/g) || []).map(m => m.slice(1)).filter(u => u !== "Vous")));
      mentions.forEach(user => toast(`@${user} a été mentionné dans un commentaire !`));
      setNewComment("");
      setShowAutocomplete(false);
    }
  };

  const handleAddReply = (commentId, reply) => {
    onAddReply(commentId, {
      ...reply,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center overflow-x-hidden">
      <div className="bg-background w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-lg p-4 max-h-[90vh] overflow-y-auto pb-24">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Commentaires</h2>
          <Button variant="ghost" type="button" onClick={onClose}>Fermer</Button>
        </div>
        <div className="flex gap-2 items-start mt-2 mb-4">
          <Avatar className="w-8 h-8"><AvatarFallback>VO</AvatarFallback></Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={e => {
                setNewComment(e.target.value);
                const match = /@([\w]*)$/.exec(e.target.value.slice(0, e.target.selectionStart));
                if (match) {
                  setAutocompleteUsers(allUsers.filter(u => u.toLowerCase().startsWith(match[1].toLowerCase()) && u !== "Vous"));
                  setShowAutocomplete(true);
                } else {
                  setShowAutocomplete(false);
                }
              }}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
              placeholder="Ajouter un commentaire..."
              className="w-full min-h-[60px]"
            />
            {showAutocomplete && autocompleteUsers.length > 0 && (
              <div className="absolute bg-card border rounded shadow z-50 mt-1 max-h-40 overflow-auto">
                {autocompleteUsers.map(user => (
                  <div
                    key={user}
                    className="px-3 py-2 hover:bg-muted cursor-pointer"
                    onMouseDown={() => {
                      setNewComment(c => c.replace(/@([\w]*)$/, `@${user} `));
                      setShowAutocomplete(false);
                    }}
                  >
                    @{user}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-1">
              <Button className="ml-2 btn-golden" onClick={handleAddComment} disabled={!newComment.trim()}>Envoyer</Button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={onAddReply}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleAddReply={handleAddReply}
              navigate={navigate}
              setShowThreadModal={setShowThreadModal}
              openedReplies={openedReplies}
              setOpenedReplies={setOpenedReplies}
            />
          ))}
        </div>
      </div>
      {showThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">
          <div className="bg-background w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-lg p-4 max-h-[90vh] overflow-y-auto pb-24">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Sous-réponses</h2>
              <Button variant="ghost" type="button" onClick={() => setShowThreadModal(null)}>Retour</Button>
            </div>
            <div className="space-y-4">
              <CommentThread
                comment={showThreadModal.comment}
                onReply={onAddReply}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleAddReply={(parentId: string) => {
                  if (replyText.trim()) {
                    const addReplyRecursive = (commentsArr: any[]): any[] =>
                      commentsArr.map(c =>
                        c.id === parentId
                          ? {
                              ...c,
                              replies: [
                                ...(c.replies || []),
                                {
                                  id: Date.now().toString(),
                                  user: { name: "Vous", avatar: "" },
                                  content: replyText,
                                  timestamp: new Date().toISOString(),
                                  replies: []
                                }
                              ]
                            }
                          : {
                              ...c,
                              replies: c.replies ? addReplyRecursive(c.replies) : []
                            }
                      );
                    onAddReply(parentId, {
                      id: Date.now().toString(),
                      user: { name: "Vous", avatar: "" },
                      content: replyText,
                      timestamp: new Date().toISOString(),
                      replies: []
                    });
                    setReplyTo(null);
                    setReplyText("");
                  }
                }}
                navigate={navigate}
                setShowThreadModal={setShowThreadModal}
                openedReplies={openedReplies}
                setOpenedReplies={setOpenedReplies}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 