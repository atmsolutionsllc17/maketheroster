/**
 * Cloudflare Turnstile verification.
 *
 * If TURNSTILE_SECRET_KEY is not set, CAPTCHA is treated as disabled (returns
 * true) so the app keeps working locally / before keys are configured. Set
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY (client) + TURNSTILE_SECRET_KEY (server) to
 * enforce it.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — do not block
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/** Whether the CAPTCHA widget should render (client-safe public key present). */
export function turnstileEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}
