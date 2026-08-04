"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Star, MessageSquare, Plus, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import {
  toggleFavorite,
  addToWatchlist,
  saveNote,
  deleteNote,
} from "@/lib/actions/coach";
import type { ActionState } from "@/lib/actions/auth";
import { formatDate } from "@/lib/format";

type Note = { id: string; body: string; createdAt: Date };
type WL = { id: string; name: string };

export function CoachActions({
  studentId,
  messageHref,
  isFavorited,
  watchlists,
  notes,
  canUsePro,
}: {
  studentId: string;
  messageHref: string;
  isFavorited: boolean;
  watchlists: WL[];
  notes: Note[];
  canUsePro: boolean;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-5">
          <Button asChild className="w-full">
            <Link href={messageHref}>
              <MessageSquare className="size-4" /> Contact athlete
            </Link>
          </Button>
          <form action={toggleFavorite}>
            <input type="hidden" name="studentId" value={studentId} />
            <Button
              type="submit"
              variant={isFavorited ? "default" : "outline"}
              className="w-full"
            >
              <Star
                className="size-4"
                fill={isFavorited ? "currentColor" : "none"}
              />
              {isFavorited ? "Favorited" : "Add to favorites"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Watchlists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add to watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          {!canUsePro ? (
            <ProLock feature="Watchlists" />
          ) : watchlists.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No watchlists yet.{" "}
              <Link href="/coach/watchlists" className="text-primary">
                Create one
              </Link>
              .
            </p>
          ) : (
            <WatchlistAdder studentId={studentId} watchlists={watchlists} />
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Private notes</CardTitle>
        </CardHeader>
        <CardContent>
          {!canUsePro ? (
            <ProLock feature="Coach notes" />
          ) : (
            <NotesPanel studentId={studentId} notes={notes} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProLock({ feature }: { feature: string }) {
  return (
    <div className="rounded-lg border border-dashed p-4 text-center">
      <Lock className="mx-auto mb-2 size-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {feature} are a Coach Pro feature.
      </p>
      <Button variant="link" size="sm" asChild>
        <Link href="/pricing">Upgrade to Pro</Link>
      </Button>
    </div>
  );
}

function WatchlistAdder({
  studentId,
  watchlists,
}: {
  studentId: string;
  watchlists: WL[];
}) {
  const [value, setValue] = useState("");
  return (
    <form action={addToWatchlist} className="flex gap-2">
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="watchlistId" value={value} />
      <Select value={value} onValueChange={(v) => setValue(v ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select watchlist" />
        </SelectTrigger>
        <SelectContent>
          {watchlists.map((w) => (
            <SelectItem key={w.id} value={w.id}>
              {w.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="icon" disabled={!value}>
        <Plus className="size-4" />
      </Button>
    </form>
  );
}

function NotesPanel({
  studentId,
  notes,
}: {
  studentId: string;
  notes: Note[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveNote, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Note saved");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="rounded-md border bg-muted/40 p-2 text-sm">
            <p className="whitespace-pre-wrap">{n.body}</p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(n.createdAt)}</span>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={n.id} />
                <input type="hidden" name="studentId" value={studentId} />
                <button
                  type="submit"
                  className="hover:text-destructive"
                  aria-label="Delete note"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <form ref={formRef} action={formAction} className="space-y-2">
        <input type="hidden" name="studentId" value={studentId} />
        <Textarea name="body" rows={3} placeholder="Add a private note…" required />
        <SubmitButton variant="outline" className="w-full">
          Save note
        </SubmitButton>
      </form>
    </div>
  );
}
