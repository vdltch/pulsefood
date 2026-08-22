import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const input = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  try {
    const { email } = input.parse(await request.json());
    await db.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      create: { email: email.toLowerCase() },
      update: { active: true },
    });
    return NextResponse.json({ message: "Bienvenue dans PULSE." }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Entre une adresse e-mail valide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Inscription momentanément indisponible." }, { status: 500 });
  }
}
