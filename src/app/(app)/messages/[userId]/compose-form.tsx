"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { sendMessage } from "@/lib/actions/messages";
import type { ActionState } from "@/lib/actions/auth";

export function ComposeForm({ receiverId }: { receiverId: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    sendMessage,
    {},
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      ref.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="flex items-end gap-2">
      <input type="hidden" name="receiverId" value={receiverId} />
      <Textarea
        name="body"
        rows={2}
        placeholder="Write a message…"
        required
        className="resize-none"
      />
      <SubmitButton>
        <Send className="size-4" /> Send
      </SubmitButton>
    </form>
  );
}
