import crypto from "node:crypto";

/**
 * Cloudinary integration for moderated media uploads.
 *
 * Uploads go directly from the browser to Cloudinary using a server-signed
 * request (the API secret never leaves the server). We request Cloudinary's
 * AI moderation add-on(s) on upload; Cloudinary then calls our webhook with
 * the moderation verdict, which flips the Video from PENDING → APPROVED/REJECTED.
 *
 * Required env (set in Vercel once your Cloudinary account is ready):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 * Optional:
 *   CLOUDINARY_MODERATION   e.g. "aws_rek_video" or "aws_rek_video|perception_point"
 *                           (must match the add-ons you enabled in Cloudinary)
 */

export function cloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    moderation: process.env.CLOUDINARY_MODERATION ?? "",
  };
}

export function cloudinaryConfigured(): boolean {
  const c = cloudinaryConfig();
  return Boolean(c.cloudName && c.apiKey && c.apiSecret);
}

/**
 * Cloudinary signature = sha1( sorted "k=v&k=v" of the signed params + apiSecret ).
 * Only the params actually sent to the upload endpoint (excluding file, api_key,
 * resource_type, cloud_name) participate in the signature.
 */
export function signParams(
  params: Record<string, string>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] !== undefined)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/**
 * Verify a Cloudinary webhook notification.
 * Signature = sha1( rawBody + X-Cld-Timestamp + apiSecret ).
 */
export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  apiSecret: string,
): boolean {
  const expected = crypto
    .createHash("sha1")
    .update(rawBody + timestamp + apiSecret)
    .digest("hex");
  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
