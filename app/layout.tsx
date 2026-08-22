import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./responsive-fixes.css";
export const metadata: Metadata = { title: "Pulse — Veggie. Protéiné. Vivant.", description: "La cuisine végétarienne qui nourrit vraiment." };
export const viewport: Viewport = { themeColor: "#17251b", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html> }
