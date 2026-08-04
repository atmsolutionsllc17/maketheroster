import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinaryConfig, verifyWebhookSignature } from "@/lib/cloudinary";

/**
 * Cloudinary calls this when async moderation finishes. We verify the
 * signature, then flip the matching Video to APPROVED or REJECTED.
 * Videos that fail moderation stay hidden (public profile shows APPROVED only).
 */
export async function POST(req: Request) {
  const { apiSecret } = cloudinaryConfig();
  if (!apiSecret) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text();
  const timestamp = req.headers.get("x-cld-timestamp") ?? "";
  const signature = req.headers.get("x-cld-signature") ?? "";

  if (!verifyWebhookSignature(raw, timestamp, signature, apiSecret)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  let body: {
    notification_type?: string;
    public_id?: string;
    moderation_status?: string;
    moderation_kind?: string;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  if (body.notification_type === "moderation" && body.public_id) {
    const approved = body.moderation_status === "approved";
    await prisma.video.updateMany({
      where: { publicId: body.public_id },
      data: { moderation: approved ? "APPROVED" : "REJECTED" },
    });
  }

  return NextResponse.json({ ok: true });
}
