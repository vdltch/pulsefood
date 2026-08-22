import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./responsive-fixes.css";
import "./admin.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://pulsefood.fr"),
  title: "Pulse — Veggie. Protéiné. Vivant.",
  description: "La cuisine végétarienne qui nourrit vraiment.",
  applicationName: "PULSE Food",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};
export const viewport: Viewport = { themeColor: "#17251b", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html> }
