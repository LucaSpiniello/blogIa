import { NextRequest, NextResponse } from "next/server";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);

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

    if (!BREVO_API_KEY || !Number.isFinite(BREVO_LIST_ID)) {
      return NextResponse.json(
        { error: "Brevo no esta configurado todavia." },
        { status: 503 }
      );
    }

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: normalizedEmail,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!brevoRes.ok) {
      const payload = await brevoRes.json().catch(() => ({}));
      console.error("Brevo subscribe failed", payload);
      return NextResponse.json(
        { error: payload.message || "No se pudo guardar el email." },
        { status: brevoRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed: false,
    });
  } catch (error) {
    console.error("Subscribe route failed", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
