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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalido" }, { status: 400 });
    }

    const data = loadSubscribers();

    if (data.emails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { ok: true, alreadySubscribed: true, count: data.emails.length },
        { status: 200 }
      );
    }

    data.emails.push(email.toLowerCase());
    data.updated = new Date().toISOString();
    saveSubscribers(data);

    return NextResponse.json({
      ok: true,
      alreadySubscribed: false,
      count: data.emails.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
