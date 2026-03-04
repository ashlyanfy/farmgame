import { CARE_BOOST, NUTRIENTS_BOOST } from './constants';
function clamp(v: number, min: number, max: number) { return Math.min(Math.max(v, min), max); }
interface ProgressInput { cycleStartMs: number; careIndex: number; nutrientsUsed: number; cycleDurationDays: number; }
export interface ProgressResult { progress: number; percent: number; daysLeft: number; stage: number; artAsset: 1|2|3; showFX: boolean; isReady: boolean; }
export function calculateProgress(input: ProgressInput): ProgressResult {
  const { cycleStartMs, careIndex, nutrientsUsed, cycleDurationDays } = input;
  const base = clamp((Date.now() - cycleStartMs) / (cycleDurationDays * 86400000), 0, 1);
  const care = clamp(careIndex * CARE_BOOST.step, 0, CARE_BOOST.max);
  const nutr = clamp(nutrientsUsed * NUTRIENTS_BOOST.step, 0, NUTRIENTS_BOOST.max);
  const progress = clamp(base + care + nutr, 0, 1);
  const percent = Math.floor(progress * 100);
  const daysLeft = Math.max(0, Math.ceil((1 - progress) * cycleDurationDays));
  let stage: number;
  if (progress < 0.20) stage = 1; else if (progress < 0.40) stage = 2;
  else if (progress < 0.60) stage = 3; else if (progress < 0.80) stage = 4; else stage = 5;
  const artAsset: 1|2|3 = stage <= 2 ? 1 : stage <= 4 ? 2 : 3;
  return { progress, percent, daysLeft, stage, artAsset, showFX: stage === 2 || stage === 4, isReady: progress >= 1 };
}
