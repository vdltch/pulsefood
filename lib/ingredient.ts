export type StructuredIngredient = { label: string; quantity?: number | null; unit?: string | null; name?: string | null };

const units = ["c. à soupe", "c. à café", "cuillères à soupe", "cuillères à café", "kg", "g", "mg", "l", "cl", "ml", "pièce", "pièces", "botte", "gousse", "gousses", "pincée", "tranche", "tranches"];

export function parseIngredient(label: string): StructuredIngredient {
  const normalized = label.trim();
  const match = normalized.match(/^(\d+(?:[.,]\d+)?|\d+\s*\/\s*\d+)\s*(.*)$/);
  if (!match) return { label: normalized, name: normalized };
  const raw = match[1].replace(",", ".");
  const quantity = raw.includes("/") ? raw.split("/").map(Number).reduce((a, b) => a / b) : Number(raw);
  const rest = match[2].trim();
  const unit = [...units].sort((a,b)=>b.length-a.length).find((candidate) => rest.toLocaleLowerCase("fr").startsWith(candidate));
  const name = (unit ? rest.slice(unit.length) : rest).replace(/^\s*(de |d'|du |des )/i, "").trim();
  return { label: normalized, quantity, unit: unit || null, name: name || rest };
}

export function formatIngredient(item: StructuredIngredient, ratio = 1) {
  if (item.quantity == null) return item.label;
  const value = item.quantity * ratio;
  const quantity = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
  return [quantity, item.unit, item.name].filter(Boolean).join(" ");
}
