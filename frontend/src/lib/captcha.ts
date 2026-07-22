export async function verifyCaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    // In production, we should also check if data.score > 0.5 for v3
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
  action?: string;
};

export async function verifyTurnstile(
  token: string,
  remoteip?: string,
  expectedAction?: string
) {
  const secret = process.env.TURNSTILE_SECRET;

  if (!secret) {
    console.error("Turnstile verification error: TURNSTILE_SECRET is not configured");
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });

    if (remoteip) {
      body.set("remoteip", remoteip);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await response.json()) as TurnstileResponse;

    if (!data.success) {
      console.warn("Turnstile verification failed:", data["error-codes"] ?? []);
      return false;
    }

    if (expectedAction && data.action !== expectedAction) {
      console.warn("Turnstile verification failed: unexpected action", data.action);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
