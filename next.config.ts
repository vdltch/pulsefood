import type { NextConfig } from "next";
const securityHeaders=[{key:"X-Content-Type-Options",value:"nosniff"},{key:"X-Frame-Options",value:"DENY"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},{key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},{key:"Content-Security-Policy",value:"default-src 'self'; img-src 'self' data: https://images.unsplash.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self'"}];
const nextConfig: NextConfig = { output: "standalone", poweredByHeader:false, compress:true, images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },async headers(){return [{source:"/:path*",headers:securityHeaders}]} };
export default nextConfig;
