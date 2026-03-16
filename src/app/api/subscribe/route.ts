import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "content/subscribers.json");

function loadSubscribers(): { emails: string[]; updated: string } {
  if (fs.existsSync(SUBSCRIBERS_FILE)) {
    return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, "utf8"));
  }
  return { emails: [], updated: "" };
}

function saveSubscribers(data: { emails: string[]; updated: string }) {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function isReadOnlyFsError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("read-only") ||
    message.includes("ero fs") ||
    message.includes("erofs") ||
    message.includes("permission denied") ||
    message.includes("eacces") ||
    message.includes("operation not permitted") ||
    message.includes("eperm")
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "Email invalido" }, { status: 400 });
    }

    const data = loadSubscribers();

    if (data.emails.includes(normalizedEmail)) {
      return NextResponse.json(
        { ok: true, alreadySubscribed: true, count: data.emails.length },
        { status: 200 }
      );
    }

    try {
      data.emails.push(normalizedEmail);
      data.updated = new Date().toISOString();
      saveSubscribers(data);
    } catch (error) {
      console.error("Failed to persist subscribers.json", error);

      if (isReadOnlyFsError(error)) {
        return NextResponse.json(
          {
            error:
              "Waitlist storage is not enabled in this environment yet. Your email could not be saved.",
          },
          { status: 503 }
        );
      }

      throw error;
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed: false,
      count: data.emails.length,
    });
  } catch (error) {
    console.error("Subscribe route failed", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
