import type { RunnerMove } from "./runner-move.type"

export type RunnerAnimationPlan = {
  /** Milliseconds to spend on one base-to-base step (per wave) */
  waveMs: number
  /** Each wave runs all moves in parallel, then the next wave starts. */
  waves: RunnerMove[][]
}
