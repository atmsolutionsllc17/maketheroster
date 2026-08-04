"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { createWatchlist } from "@/lib/actions/coach";
import type { ActionState } from "@/lib/actions/auth";

export function CreateWatchlistForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createWatchlist,
    {},
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Watchlist created");
      ref.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="flex gap-2">
      <Input name="name" placeholder="e.g. 2027 QB targets" required />
      <SubmitButton>
        <Plus className="size-4" /> Create
      </SubmitButton>
    </form>
  );
}
