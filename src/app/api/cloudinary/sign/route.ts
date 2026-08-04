import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { cloudinaryConfig, cloudinaryConfigured, signParams } from "@/lib/cloudinary";

/**
 * Returns a short-lived signature the browser uses to upload one video
 * directly to Cloudinary with AI moderation requested. Athlete-only.
 */
export async function POST(req: Request) {
  await requireRole("ATHLETE"); // throws/redirects if not a signed-in athlete

  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Uploads are not configured." },
      { status: 503 },
    );
  }

  const { cloudName, apiKey, apiSecret, moderation } = cloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "athleteconnect/videos";

  // Only send a webhook URL Cloudinary can actually reach (public https).
  const base = process.env.AUTH_URL ?? new URL(req.url).origin;
  const notificationUrl =
    base.startsWith("https://") && !base.includes("localhost")
      ? `${base.replace(/\/$/, "")}/api/cloudinary/webhook`
      : "";

  // Params that must be signed (everything except file/api_key/resource_type/cloud_name).
  const signed: Record<string, string> = { timestamp, folder };
  if (moderation) signed.moderation = moderation;
  if (notificationUrl) signed.notification_url = notificationUrl;

  const signature = signParams(signed, apiSecret);

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
    moderation: moderation || undefined,
    notificationUrl: notificationUrl || undefined,
  });
}
