/**
 * AGRONOMIC HEURISTIC ADJUSTMENTS
 * 
 * Rules of implementation:
 * 1. Must be documented as heuristic adjustments.
 * 2. Must NOT be described as official government formulas.
 * 3. Explain that it is an engineering approximation based on agronomic literature.
 */

/**
 * Heuristic adjustment for soil types.
 * Derived from general agronomic literature indicating nutrient retention capabilities.
 * Sandy soils leach N and K faster, requiring slightly higher doses.
 * Peat soils have different base nutrient profiles.
 * 
 * Not an official Ministry of Agriculture formula.
 */
export const SOIL_FACTOR: Record<string, { n: number; p: number; k: number; description: string }> = {
  clay: { n: 1.0, p: 1.0, k: 1.0, description: "Tanah liat (standar retensi hara normal)" },
  loam: { n: 1.0, p: 1.0, k: 1.0, description: "Tanah lempung (standar retensi hara normal)" },
  sandy: { n: 1.2, p: 1.1, k: 1.2, description: "Tanah berpasir (N & K mudah tercuci, butuh 20% ekstra)" },
  peat: { n: 1.0, p: 1.3, k: 1.1, description: "Tanah gambut (sering defisiensi P, butuh 30% ekstra)" },
};

/**
 * Heuristic adjustment for growth stages.
 * Represents the percentage of the total dosage applied at each stage.
 * Used to split fertilizer applications.
 * 
 * Not a national regulation, just an agronomic best practice.
 */
export const PHASE_DISTRIBUTION: Record<string, number> = {
  seedling: 0.1,    // 10%
  vegetative: 0.5,  // 50%
  flowering: 0.25,  // 25%
  harvest: 0.15,    // 15%
};
