"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setState("loading");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    setMessage(result.message || result.error);
    setState(response.ok ? "success" : "error");
    if (response.ok) setEmail("");
  }

  return <div className="newsletter-widget">
    <form onSubmit={subscribe}>
      <input aria-label="Adresse e-mail" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ton@email.fr" />
      <button disabled={state === "loading"} aria-label="S'inscrire">{state === "success" ? <Check /> : <ArrowRight />}</button>
    </form>
    <p className={state}>{state === "loading" ? "Inscription…" : message}</p>
  </div>;
}
