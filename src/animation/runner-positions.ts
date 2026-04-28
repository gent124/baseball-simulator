import type { Bases } from "../game/game-state.type"
import type { BaseSpot } from "./base-spot.type"
import type { RunnerId } from "./runner-id.type"
import type { RunnerMove } from "./runner-move.type"

export type RunnersAt = Partial<Record<RunnerId, BaseSpot>>

export function makeInitialRunnersMap(bases: Bases): RunnersAt {
  const m: RunnersAt = { b: "home" }
  if (bases[0]) m[1] = 1
  if (bases[1]) m[2] = 2
  if (bases[2]) m[3] = 3
  return m
}

export function applyRunnerWave(at: RunnersAt, wave: RunnerMove[]): RunnersAt {
  const next: RunnersAt = { ...at }
  for (const m of wave) {
    next[m.runnerId] = m.to
  }
  return next
}

export function stripScoredRunners(at: RunnersAt): RunnersAt {
  const next: RunnersAt = { ...at }
  for (const k of Object.keys(next) as RunnerId[]) {
    if (next[k] === "scored") {
      delete next[k]
    }
  }
  return next
}

/**
 * Bases that show as occupied: any runner (including the batter) on that base.
 */
export function inferBasesFromRunners(at: RunnersAt | null, fallback: Bases): Bases {
  if (!at) {
    return fallback
  }
  const spots = new Set<BaseSpot>()
  for (const v of Object.values(at) as BaseSpot[]) {
    spots.add(v)
  }
  return [spots.has(1), spots.has(2), spots.has(3)]
}
