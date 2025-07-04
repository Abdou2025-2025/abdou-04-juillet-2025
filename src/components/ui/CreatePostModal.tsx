import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Image, Video, BarChart3 } from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onPost: (content: string, image?: string, video?: string, poll?: { question: string, options: string[] }) => void;
}

export function CreatePostModal({ open, onClose, onPost }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!content.trim() && !selectedImage && !selectedVideo && !showPoll) return;

    let poll = undefined;
    if (showPoll && pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2) {
      poll = {
        question: pollQuestion,
        options: pollOptions.filter(opt => opt.trim())
      };
    }

    onPost(content, selectedImage || undefined, selectedVideo || undefined, poll);
    setContent("");
    setSelectedImage(null);
    setSelectedVideo(null);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-background text-foreground max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-gradient-gold">Créer une publication</DialogTitle>
          <DialogDescription>
            Partagez vos prédictions, analyses ou statistiques avec la communauté.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez vos prédictions, analyses ou stats..."
          className="min-h-[100px]"
        />

        {/* Preview image/vidéo */}
        {selectedImage && (
          <div className="relative mt-3">
            <img
              src={selectedImage}
              alt="Preview"
              className="rounded-lg object-cover w-full max-h-52"
            />
            <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setSelectedImage(null)}>×</Button>
          </div>
        )}
        {selectedVideo && (
          <div className="relative mt-3">
            <video src={selectedVideo} controls className="rounded-lg w-full max-h-52" />
            <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setSelectedVideo(null)}>×</Button>
          </div>
        )}

        {/* Sondage */}
        {showPoll && (
          <div className="bg-muted/50 rounded-xl p-3 space-y-2 mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">Sondage</span>
              <Button variant="outline" size="sm" onClick={() => setShowPoll(false)}>Annuler</Button>
            </div>
            <Input
              className="mb-2"
              placeholder="Question du sondage"
              value={pollQuestion}
              onChange={e => setPollQuestion(e.target.value)}
            />
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <Input
                  className="flex-1"
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

        <div className="flex items-center gap-2 mt-2">
          <Button
            size="sm"
            variant={selectedImage ? "default" : "outline"}
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={!!selectedVideo || showPoll}
          >
            <Image className="w-4 h-4" />
            Photo
          </Button>
          <Button
            size="sm"
            variant={selectedVideo ? "default" : "outline"}
            className="gap-2"
            onClick={() => videoInputRef.current?.click()}
            disabled={!!selectedImage || showPoll}
          >
            <Video className="w-4 h-4" />
            Vidéo
          </Button>
          <Button
            size="sm"
            variant={showPoll ? "default" : "outline"}
            className="gap-2"
            onClick={() => {
              setShowPoll(!showPoll);
              setSelectedImage(null);
              setSelectedVideo(null);
            }}
          >
            <BarChart3 className="w-4 h-4" />
            Sondage
          </Button>
        </div>

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setSelectedImage(event.target?.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        
        <input
          type="file"
          accept="video/*"
          hidden
          ref={videoInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setSelectedVideo(event.target?.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim() && !selectedImage && !selectedVideo && !showPoll}>
            Publier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 