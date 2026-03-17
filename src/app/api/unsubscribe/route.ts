import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET;

function tokenFor(email: string) {
  return crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET || "")
    .update(email)
    .digest("hex");
}

function htmlPage(title: string, body: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${title}</title></head><body style="margin:0;background:#071018;color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;"><div style="max-width:640px;margin:0 auto;padding:48px 20px;"><div style="font-size:48px;font-weight:900;letter-spacing:-0.08em;">5AI</div><div style="margin-top:24px;padding:28px;border:1px solid #223548;border-radius:24px;background:#0D1924;"><h1 style="margin:0 0 12px;font-size:28px;line-height:1.05;">${title}</h1><p style="margin:0;color:#8CA0B6;line-height:1.7;">${body}</p></div></div></body></html>`,
    {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  const token = request.nextUrl.searchParams.get("token");

  if (!email || !token || !BREVO_API_KEY || !Number.isFinite(BREVO_LIST_ID) || !UNSUBSCRIBE_SECRET) {
    return htmlPage(
      "Invalid unsubscribe link",
      "This unsubscribe link is missing information or the server is not configured correctly.",
      400
    );
  }

  if (tokenFor(email) !== token) {
    return htmlPage(
      "Invalid unsubscribe link",
      "This unsubscribe link is not valid.",
      403
    );
  }

  const response = await fetch(
    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        unlinkListIds: [BREVO_LIST_ID],
      }),
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    console.error("Brevo unsubscribe failed", payload);
    return htmlPage(
      "Could not unsubscribe",
      "We could not process your unsubscribe request right now. Please try again later.",
      502
    );
  }

  return htmlPage(
    "You are unsubscribed",
    "You will no longer receive the 5AI daily digest at this email address."
  );
}
