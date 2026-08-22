export function studioPath(suffix = "") {
  const base = (process.env.STUDIO_PATH || "/studio-pulse-7k4m9x").replace(/\/$/, "");
  return `${base}${suffix.startsWith("/") || !suffix ? suffix : `/${suffix}`}`;
}
