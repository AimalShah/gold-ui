/**
 * Gold King Mathematical Engine
 * Weights are stored as integer milligrams (mg).
 * Money is stored as integer PKR.
 */

export interface WeightParts {
  tola: number
  masha: number
  ratti: number
  grams: number
}

export const DEFAULT_GRAMS_PER_TOLA = 11.664
export const MASHA_PER_TOLA = 12
export const RATTI_PER_MASHA = 8
export const RATTI_PER_TOLA = 96 // 12 * 8

export function getMgPerTola(gramsPerTola = DEFAULT_GRAMS_PER_TOLA): number {
  return Math.round(gramsPerTola * 1000)
}

export function getMgPerMasha(gramsPerTola = DEFAULT_GRAMS_PER_TOLA): number {
  return (gramsPerTola * 1000) / MASHA_PER_TOLA
}

export function getMgPerRatti(gramsPerTola = DEFAULT_GRAMS_PER_TOLA): number {
  return (gramsPerTola * 1000) / RATTI_PER_TOLA
}

/**
 * Convert integer milligrams to Tola, Masha, Ratti, and Grams
 */
export function toParts(mg: number, gramsPerTola = DEFAULT_GRAMS_PER_TOLA): WeightParts {
  if (isNaN(mg) || mg === 0) {
    return { tola: 0, masha: 0, ratti: 0, grams: 0 }
  }

  const isNeg = mg < 0
  const absMg = Math.abs(mg)

  const grams = absMg / 1000
  const mgPerRatti = getMgPerRatti(gramsPerTola)
  
  // Total ratti count (float)
  const totalRatti = absMg / mgPerRatti
  const tola = Math.floor(totalRatti / RATTI_PER_TOLA)
  const remRattiAfterTola = totalRatti - (tola * RATTI_PER_TOLA)
  const masha = Math.floor(remRattiAfterTola / RATTI_PER_MASHA)
  const ratti = Number((remRattiAfterTola - (masha * RATTI_PER_MASHA)).toFixed(3))

  return {
    tola: isNeg ? -tola : tola,
    masha: isNeg ? -masha : masha,
    ratti: isNeg ? -ratti : ratti,
    grams: Number((isNeg ? -grams : grams).toFixed(4)),
  }
}

/**
 * Convert parts (Tola, Masha, Ratti) or Grams to integer milligrams
 */
export function fromParts(parts: Partial<WeightParts>, gramsPerTola = DEFAULT_GRAMS_PER_TOLA): number {
  if (parts.grams !== undefined && parts.grams !== null && !isNaN(parts.grams)) {
    return Math.round(parts.grams * 1000)
  }

  const tola = parts.tola || 0
  const masha = parts.masha || 0
  const ratti = parts.ratti || 0

  const mgPerTola = getMgPerTola(gramsPerTola)
  const mgPerMasha = getMgPerMasha(gramsPerTola)
  const mgPerRatti = getMgPerRatti(gramsPerTola)

  const totalMg = (tola * mgPerTola) + (masha * mgPerMasha) + (ratti * mgPerRatti)
  return Math.round(totalMg)
}

/**
 * Format integer milligrams as grams (e.g. 11.664 g)
 */
export function formatGrams(mg: number, decimals = 3): string {
  if (isNaN(mg)) return "0." + "0".repeat(decimals)
  return (mg / 1000).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format integer milligrams as Tola-Masha-Ratti string
 */
export function formatTMR(mg: number, gramsPerTola = DEFAULT_GRAMS_PER_TOLA): string {
  const parts = toParts(mg, gramsPerTola)
  return `${parts.tola}T ${parts.masha}M ${parts.ratti.toFixed(2)}R`
}

/**
 * Format integer PKR money with thousands separators
 */
export function formatMoney(pkr: number): string {
  if (isNaN(pkr)) return "Rs 0"
  return "Rs " + Math.round(pkr).toLocaleString('en-PK')
}

/**
 * Cut total calculation:
 * cutTotal = cutPerTola * (weight / GRAMS_PER_TOLA)
 * All weights in mg
 */
export function calculateCutTotal(
  weightMg: number,
  cutPerTolaMg: number,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): number {
  const mgPerTola = getMgPerTola(gramsPerTola)
  if (mgPerTola === 0) return 0
  const tolas = weightMg / mgPerTola
  return Math.round(cutPerTolaMg * tolas)
}

/**
 * Polish total calculation:
 * polishTotal = polishPerTola * (weight / GRAMS_PER_TOLA)
 */
export function calculatePolishTotal(
  weightMg: number,
  polishPerTolaMg: number,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): number {
  const mgPerTola = getMgPerTola(gramsPerTola)
  if (mgPerTola === 0) return 0
  const tolas = weightMg / mgPerTola
  return Math.round(polishPerTolaMg * tolas)
}

/**
 * Total WT = Weight - Cut - Polish
 */
export function calculateTotalWeight(weightMg: number, cutTotalMg: number, polishTotalMg: number): number {
  return weightMg - cutTotalMg - polishTotalMg
}

/**
 * Gold Value = (TotalWT_g / gramsPerTola * GoldRate) * (carat / 24)
 */
export function calculateGoldValue(
  totalWeightMg: number,
  goldRatePkr: number,
  carat = 24,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): number {
  const mgPerTola = getMgPerTola(gramsPerTola)
  if (mgPerTola === 0) return 0
  const tolas = totalWeightMg / mgPerTola
  const pureRatio = Math.min(Math.max(carat / 24, 0), 1)
  return Math.round(tolas * goldRatePkr * pureRatio)
}

export type ChargesMode = 'per_tola' | 'labour' | 'fix'

/**
 * Total Price with charges
 */
export function calculateTotalPrice(
  goldValuePkr: number,
  chargesPkr: number,
  chargesMode: ChargesMode = 'per_tola',
  totalWeightMg: number = 0,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): number {
  let effectiveCharges = chargesPkr
  if (chargesMode === 'per_tola') {
    const mgPerTola = getMgPerTola(gramsPerTola)
    const tolas = totalWeightMg / (mgPerTola || 1)
    effectiveCharges = Math.round(chargesPkr * tolas)
  }
  return goldValuePkr + effectiveCharges
}

/**
 * Zakat = 2.5% of total price
 */
export function calculateZakat(totalPricePkr: number, rate = 0.025): number {
  return Math.round(totalPricePkr * rate)
}

/**
 * Tehleel Karat & Per-mille
 * karat = pureGold / firstWeight * 24
 * permille = pureGold / firstWeight * 1000
 */
export function calculateTehleel(firstWeightMg: number, pureGoldMg: number): {
  karat: number
  permille: number
  purityPercent: number
} {
  if (!firstWeightMg || firstWeightMg <= 0) {
    return { karat: 24, permille: 1000, purityPercent: 100 }
  }
  const ratio = pureGoldMg / firstWeightMg
  const karat = Number((ratio * 24).toFixed(2))
  const permille = Math.round(ratio * 1000)
  const purityPercent = Number((ratio * 100).toFixed(2))
  return { karat, permille, purityPercent }
}

/**
 * Amount to Gold (A)
 * weight = (amount / rate) * gramsPerTola
 */
export function amountToGoldMg(
  amountPkr: number,
  goldRatePkr: number,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): number {
  if (!goldRatePkr || goldRatePkr <= 0) return 0
  const tolas = amountPkr / goldRatePkr
  return Math.round(tolas * gramsPerTola * 1000)
}

/**
 * Per-gram rate to per-tola rate (Ctrl+G)
 */
export function perGramToPerTolaRate(
  perGramRatePkr: number,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): number {
  return Math.round(perGramRatePkr * gramsPerTola)
}

/**
 * Gold Karat / Impurity breakdown
 * Formula from recording verified
 */
export function calculateImpurity(
  firstWeightMg: number,
  secondWeightMg: number,
  cutPerTolaMg: number,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA
): { impurityMg: number; pureGoldMg: number } {
  // If second weight is lower, difference is base loss/impurity plus cut
  const diffMg = Math.max(0, firstWeightMg - secondWeightMg)
  const cutMg = calculateCutTotal(firstWeightMg, cutPerTolaMg, gramsPerTola)
  const impurityMg = Math.min(firstWeightMg, diffMg + cutMg)
  const pureGoldMg = Math.max(0, firstWeightMg - impurityMg)
  return { impurityMg, pureGoldMg }
}
