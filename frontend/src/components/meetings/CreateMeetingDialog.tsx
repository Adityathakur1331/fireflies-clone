"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown, FileUp, Plus, Video } from "lucide-react";
import { createMeeting } from "@/lib/api/meetings";
import {
  fileToTranscriptRaw,
  isAllowedTranscriptFile,
} from "@/lib/transcriptFile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateMeetingDialog({
  triggerVariant = "default",
}: {
  triggerVariant?: "default" | "capture";
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [transcriptRaw, setTranscriptRaw] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsingFile, setParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setTitle("");
    setParticipants("");
    setTranscriptRaw("");
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const mutation = useMutation({
    mutationFn: () =>
      createMeeting({
        title,
        occurred_at: new Date().toISOString(),
        participants: participants
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((display_name) => ({ display_name })),
        transcript_raw: transcriptRaw || undefined,
      }),
    onSuccess: (meeting) => {
      toast.success("Meeting created");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setOpen(false);
      resetForm();
      router.push(`/meetings/${meeting.id}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAllowedTranscriptFile(file.name)) {
      toast.error("Use a .txt, .vtt, or .json transcript file.");
      e.target.value = "";
      return;
    }
    setParsingFile(true);
    try {
      const raw = await fileToTranscriptRaw(file);
      setTranscriptRaw(raw);
      setFileName(file.name);
      toast.success("Transcript loaded from file");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not parse file");
      setFileName(null);
    } finally {
      setParsingFile(false);
    }
  };

  const trigger =
    triggerVariant === "capture" ? (
      <Button variant="capture" size="sm" className="h-8 gap-1 px-2.5">
        <Video className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Capture</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
      </Button>
    ) : (
      <Button size="sm">
        <Plus className="h-4 w-4" aria-hidden />
        Upload / create
      </Button>
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create meeting</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[var(--ff-text-secondary)]">
          Add a title and participants, then paste or upload a transcript.
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Weekly product sync"
            />
          </div>
          <div>
            <Label htmlFor="participants">Participants (comma-separated)</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Alex, Rina, Dana"
            />
          </div>
          <div>
            <Label>Transcript file (optional)</Label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.vtt,.json"
                className="hidden"
                onChange={onFileChange}
                aria-label="Upload transcript file"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={parsingFile}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="h-4 w-4" aria-hidden />
                {parsingFile ? "Parsing…" : "Choose file"}
              </Button>
              {fileName && (
                <span className="text-xs text-[var(--ff-text-secondary)]">{fileName}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="transcript">Or paste transcript</Label>
            <textarea
              id="transcript"
              className="mt-1 min-h-[120px] w-full rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] p-2 text-sm text-[var(--ff-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ff-accent)]"
              value={transcriptRaw}
              onChange={(e) => {
                setTranscriptRaw(e.target.value);
                if (e.target.value) setFileName(null);
              }}
              placeholder="[00:00:05] Alex: Hello team..."
            />
          </div>
          <Button
            className="w-full"
            disabled={!title.trim() || mutation.isPending || parsingFile}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Creating…" : "Create meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
