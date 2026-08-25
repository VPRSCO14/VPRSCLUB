/**
 * Placeholders de "fotografía de producto" mientras no hay imágenes reales.
 * Cada uno evoca un material del manual de marca (metal, vidrio, concreto, madera oscura)
 * con un degradado suave en vez de fondos de color planos o luces RGB.
 */
export const MATERIAL_GRADIENTS = [
  // metal
  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%), linear-gradient(160deg, #3d4144 0%, #14161a 100%)",
  // vidrio
  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(160deg, #4a4a4a 0%, #1c1c1c 100%)",
  // concreto
  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 55%), linear-gradient(160deg, #3a3a3a 0%, #191919 100%)",
  // madera oscura
  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 55%), linear-gradient(160deg, #3a2f28 0%, #16110d 100%)",
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getMaterialGradient(seed: string): string {
  const index = hashSeed(seed) % MATERIAL_GRADIENTS.length;
  return MATERIAL_GRADIENTS[index];
}
