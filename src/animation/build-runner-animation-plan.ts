import type { GameState } from "../game/game-state.type"
import type { GameEvent } from "../game/game-event.type"
import type { BaseSpot } from "./base-spot.type"
import type { RunnerId } from "./runner-id.type"
import type { RunnerMove } from "./runner-move.type"
import type { RunnerAnimationPlan } from "./runner-animation-plan.type"

const DEFAULT_WAVE_MS = 300

function posToSpot(p: number): BaseSpot {
  if (p <= 0) return "home"
  if (p === 1) return 1
  if (p === 2) return 2
  if (p === 3) return 3
  return "scored"
}

type Run = { id: RunnerId; pos: number }

function buildHitWaves(
  f: boolean,
  s: boolean,
  t: boolean,
  advance: number
): RunnerMove[][] {
  const initial: Run[] = []
  if (t) initial.push({ id: "3", pos: 3 })
  if (s) initial.push({ id: "2", pos: 2 })
  if (f) initial.push({ id: "1", pos: 1 })
  initial.push({ id: "b", pos: 0 })

  const waves: RunnerMove[][] = []
  let r = initial
  for (let w = 0; w < advance; w++) {
    const moves: RunnerMove[] = []
    const next: Run[] = []
    for (const u of r) {
      const from = posToSpot(u.pos)
      const newPos = u.pos + 1
      const to: BaseSpot = newPos >= 4 ? "scored" : posToSpot(newPos)
      moves.push({ runnerId: u.id, from, to })
      if (newPos < 4) {
        next.push({ id: u.id, pos: newPos })
      }
    }
    waves.push(moves)
    r = next
  }
  return waves
}

function buildWalkWaves(
  f: boolean,
  s: boolean,
  t: boolean
): RunnerMove[][] {
  if (!f) {
    return [[{ runnerId: "b", from: "home", to: 1 }]]
  }
  if (f && s && t) {
    return [
      [
        { runnerId: "3", from: 3, to: "scored" },
        { runnerId: "2", from: 2, to: 3 },
        { runnerId: "1", from: 1, to: 2 },
        { runnerId: "b", from: "home", to: 1 },
      ],
    ]
  }
  if (f && !s && t) {
    return [
      [
        { runnerId: "1", from: 1, to: 2 },
        { runnerId: "b", from: "home", to: 1 },
      ],
    ]
  }
  if (f && s && !t) {
    return [
      [
        { runnerId: "2", from: 2, to: 3 },
        { runnerId: "1", from: 1, to: 2 },
        { runnerId: "b", from: "home", to: 1 },
      ],
    ]
  }
  if (f && !s && !t) {
    return [
      [
        { runnerId: "1", from: 1, to: 2 },
        { runnerId: "b", from: "home", to: 1 },
      ],
    ]
  }
  return [[]]
}

/**
 * If the event moves runners, returns a step-by-step plan. Otherwise null (state updates apply immediately).
 */
export function buildRunnerAnimationPlan(
  from: GameState,
  next: GameState,
  event: GameEvent
): RunnerAnimationPlan | null {
  void next /* reserved for validating walk vs. engine in future */
  if (event.type === "RESET" || event.type === "OUT" || event.type === "STRIKEOUT") {
    return null
  }

  if (event.type === "SINGLE") {
    return { waveMs: DEFAULT_WAVE_MS, waves: buildHitWaves(...from.bases, 1) }
  }
  if (event.type === "DOUBLE") {
    return { waveMs: DEFAULT_WAVE_MS, waves: buildHitWaves(...from.bases, 2) }
  }
  if (event.type === "TRIPLE") {
    return { waveMs: DEFAULT_WAVE_MS, waves: buildHitWaves(...from.bases, 3) }
  }
  if (event.type === "HOME_RUN") {
    return { waveMs: DEFAULT_WAVE_MS, waves: buildHitWaves(...from.bases, 4) }
  }
  if (event.type === "WALK") {
    const [f, s, t] = from.bases
    const w = buildWalkWaves(f, s, t)
    if (w.length === 0 || (w.length === 1 && w[0]!.length === 0)) {
      return null
    }
    return { waveMs: Math.round(DEFAULT_WAVE_MS * 0.9), waves: w }
  }

  return null
}
