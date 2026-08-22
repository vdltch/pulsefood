import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./responsive-fixes.css";
import "./admin.css";
import "./product.css";
import "./editorial.css";
import "./safety.css";
import "./pwa.css";
import { ShoppingDrawer } from "@/components/shopping-drawer";
import { PwaShell } from "@/components/pwa-shell";
export const metadata: Metadata = {
  metadataBase: new URL("https://pulsefood.fr"),
  title: "Pulse — Veggie. Protéiné. Vivant.",
  description: "La cuisine végétarienne qui nourrit vraiment.",
  applicationName: "PULSE Food",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {capable:true,statusBarStyle:"black-translucent",title:"PULSE"},
  formatDetection: {telephone:false},
};
export const viewport: Viewport = { themeColor: "#17251b", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}<ShoppingDrawer/><PwaShell/></body></html> }
