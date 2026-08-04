"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type UploadedVideo = {
  url: string;
  publicId: string;
  thumbnail: string | null;
};

/**
 * Uploads a single video file straight to Cloudinary using a server-signed
 * request, with AI moderation requested. Reports the result upward so the
 * surrounding form can submit it (the saved video stays hidden as PENDING
 * until Cloudinary's moderation webhook approves it).
 */
export function CloudinaryVideoUpload({
  onUploaded,
}: {
  onUploaded: (v: UploadedVideo) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setFileName(file.name);
    setStatus("uploading");
    try {
      const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Could not start the upload.");
      const s = await signRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", s.apiKey);
      fd.append("timestamp", s.timestamp);
      fd.append("folder", s.folder);
      fd.append("signature", s.signature);
      if (s.moderation) fd.append("moderation", s.moderation);
      if (s.notificationUrl) fd.append("notification_url", s.notificationUrl);

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${s.cloudName}/video/upload`,
        { method: "POST", body: fd },
      );
      const data = await upRes.json();
      if (!upRes.ok || !data.secure_url) {
        throw new Error(data?.error?.message ?? "Upload failed.");
      }

      const thumbnail =
        typeof data.secure_url === "string"
          ? data.secure_url.replace(/\.[^./]+$/, ".jpg")
          : null;

      onUploaded({
        url: data.secure_url,
        publicId: data.public_id,
        thumbnail,
      });
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={status === "uploading"}
        onClick={() => inputRef.current?.click()}
      >
        {status === "uploading" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Uploading &amp; scanning…
          </>
        ) : status === "done" ? (
          <>
            <CheckCircle2 className="size-4 text-emerald-600" /> Uploaded — choose
            another
          </>
        ) : (
          <>
            <UploadCloud className="size-4" /> Upload video file
          </>
        )}
      </Button>

      {status === "done" && (
        <p className="text-sm text-emerald-600">
          {fileName} uploaded. It will be published once it passes moderation.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
