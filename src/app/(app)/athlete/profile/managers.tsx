"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, ExternalLink, Clock } from "lucide-react";
import {
  CloudinaryVideoUpload,
  type UploadedVideo,
} from "@/components/cloudinary-video-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import {
  addVideo,
  deleteVideo,
  addStat,
  deleteStat,
  addDocument,
  deleteDocument,
} from "@/lib/actions/athlete";
import type { ActionState } from "@/lib/actions/auth";
import type { Video, Statistic, Document } from "@/generated/prisma/client";

const DOC_LABELS: Record<string, string> = {
  RESUME: "Resume",
  TRANSCRIPT: "Transcript",
  CERTIFICATE: "Certificate",
};

function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}

/* ---------------- Videos ---------------- */
export function VideosManager({
  videos,
  canAddMore,
  limitLabel,
  uploadsEnabled = false,
}: {
  videos: Video[];
  canAddMore: boolean;
  limitLabel?: string;
  uploadsEnabled?: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(addVideo, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [uploaded, setUploaded] = useState<UploadedVideo | null>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Video added");
      formRef.current?.reset();
      setUploaded(null);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {videos.length === 0 && (
          <li className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No highlight videos yet.
          </li>
        )}
        {videos.map((v) => (
          <li
            key={v.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-medium">
                {v.title}
                {v.moderation === "PENDING" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                    <Clock className="size-3" /> Pending review
                  </span>
                )}
                {v.moderation === "REJECTED" && (
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Rejected
                  </span>
                )}
              </p>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-sm text-primary hover:underline"
              >
                {v.url} <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
            <DeleteButton id={v.id} action={deleteVideo} />
          </li>
        ))}
      </ul>

      {canAddMore ? (
        uploadsEnabled ? (
          <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="v-title">Title</Label>
              <Input id="v-title" name="title" placeholder="Senior season highlights" required />
            </div>
            <CloudinaryVideoUpload onUploaded={setUploaded} />
            {uploaded && (
              <>
                <input type="hidden" name="url" value={uploaded.url} />
                <input type="hidden" name="publicId" value={uploaded.publicId} />
                <input type="hidden" name="thumbnail" value={uploaded.thumbnail ?? ""} />
              </>
            )}
            <p className="text-xs text-muted-foreground">
              Uploaded videos are automatically scanned for inappropriate content
              and viruses, and go live once approved.
            </p>
            <SubmitButton disabled={!uploaded}>
              <Plus className="size-4" /> Add video
            </SubmitButton>
          </form>
        ) : (
          <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="v-title">Title</Label>
                <Input id="v-title" name="title" placeholder="Senior season highlights" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-url">Video URL</Label>
                <Input id="v-url" name="url" type="url" placeholder="https://youtube.com/…" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-thumb">Thumbnail URL (optional)</Label>
              <Input id="v-thumb" name="thumbnail" type="url" placeholder="https://…" />
            </div>
            <SubmitButton>
              <Plus className="size-4" /> Add video
            </SubmitButton>
          </form>
        )
      ) : (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
          {limitLabel}
        </div>
      )}
    </div>
  );
}

/* ---------------- Stats ---------------- */
export function StatsManager({
  stats,
  sport,
}: {
  stats: Statistic[];
  sport: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(addStat, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Stat added");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <ul className="space-y-2">
        {stats.length === 0 && (
          <li className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No stats logged yet.
          </li>
        )}
        {stats.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div>
              <span className="font-medium">{s.statName}: </span>
              <span>{s.value}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                {s.season ? `${s.season} · ` : ""}
                {s.sport}
              </span>
            </div>
            <DeleteButton id={s.id} action={deleteStat} />
          </li>
        ))}
      </ul>

      <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border p-4">
        <input type="hidden" name="sport" value={sport} />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="s-name">Stat</Label>
            <Input id="s-name" name="statName" placeholder="Passing yards" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-value">Value</Label>
            <Input id="s-value" name="value" placeholder="3,200" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-season">Season</Label>
            <Input id="s-season" name="season" placeholder="2025" />
          </div>
        </div>
        <SubmitButton>
          <Plus className="size-4" /> Add stat
        </SubmitButton>
      </form>
    </div>
  );
}

/* ---------------- Documents ---------------- */
export function DocumentsManager({ documents }: { documents: Document[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    addDocument,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Document added");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <ul className="space-y-2">
        {documents.length === 0 && (
          <li className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No documents uploaded yet.
          </li>
        )}
        {documents.map((d) => (
          <li
            key={d.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {d.title}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {DOC_LABELS[d.type]}
                </span>
              </p>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-sm text-primary hover:underline"
              >
                {d.url} <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
            <DeleteButton id={d.id} action={deleteDocument} />
          </li>
        ))}
      </ul>

      <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="d-type">Type</Label>
            <Select name="type" defaultValue="RESUME" required>
              <SelectTrigger id="d-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESUME">Resume</SelectItem>
                <SelectItem value="TRANSCRIPT">Transcript</SelectItem>
                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="d-title">Title</Label>
            <Input id="d-title" name="title" placeholder="2025 Transcript" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="d-url">URL</Label>
            <Input id="d-url" name="url" type="url" placeholder="https://…" required />
          </div>
        </div>
        <SubmitButton>
          <Plus className="size-4" /> Add document
        </SubmitButton>
      </form>
    </div>
  );
}
