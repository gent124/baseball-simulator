import type { Bases, GameState, Half } from "./game-state.type"
import type { GameEvent } from "./game-event.type"

export const INITIAL_STATE: GameState = {
  inning: 1,
  half: "top",
  outs: 0,
  bases: [false, false, false],
  score: { home: 0, away: 0 },
}

function scoringTeamForHalf(half: Half): "home" | "away" {
  return half === "top" ? "away" : "home"
}

function withRuns(state: GameState, extraRuns: number): GameState {
  if (extraRuns <= 0) return state
  const team = scoringTeamForHalf(state.half)
  return {
    ...state,
    score: {
      ...state.score,
      [team]: state.score[team] + extraRuns,
    },
  }
}

function endHalfInning(
  s: GameState
): { inning: number; half: Half; outs: 0; bases: Bases } {
  if (s.half === "top") {
    return { inning: s.inning, half: "bottom", outs: 0, bases: [false, false, false] }
  }
  return {
    inning: s.inning + 1,
    half: "top",
    outs: 0,
    bases: [false, false, false],
  }
}

function applyOutLike(
  state: GameState,
  isStrikeout: boolean
): { state: GameState; summary: string } {
  const action = isStrikeout ? "Strikeout" : "Out"

  if (state.outs < 2) {
    const next = (state.outs + 1) as 1 | 2
    return {
      state: { ...state, outs: next },
      summary: `${action} — now ${next} out${next === 1 ? "" : "s"}`,
    }
  }

  const next = endHalfInning(state)
  return {
    state: {
      ...state,
      inning: next.inning,
      half: next.half,
      outs: 0,
      bases: next.bases,
    },
    summary: `${action} — 3 out; change sides. ${formatHalfInningMessage(next.half, next.inning)}`,
  }
}

function formatHalfInningMessage(half: Half, inning: number) {
  return `Now ${half} of the ${inning}${ordinalSuffix(inning)}`
}

function ordinalSuffix(n: number): string {
  const v = n % 100
  if (v >= 11 && v <= 13) return "th"
  switch (n % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

/**
 * Bases [1st,2nd,3rd]. Batter to 1st, force when 1st is occupied; a run scores on
 * bases-loaded walk.
 */
function walkBases(f: boolean, s: boolean, t: boolean): { bases: Bases; runs: number } {
  if (!f) {
    return { bases: [true, s, t], runs: 0 }
  }
  if (f && s && t) {
    return { bases: [true, s, t], runs: 1 }
  }
  if (f && !s && t) {
    return { bases: [true, true, t], runs: 0 }
  }
  if (f && s && !t) {
    return { bases: [true, true, true], runs: 0 }
  }
  if (f && !s && !t) {
    return { bases: [true, true, false], runs: 0 }
  }
  throw new Error("walkBases: unreachable case")
}

/**
 * Batter at home (0); base runners at 1,2,3. All advance n bases. np ≥ 4 scores a run.
 */
function hitBases(
  f: boolean,
  s: boolean,
  t: boolean,
  n: 1 | 2 | 3
): { bases: Bases; runs: number } {
  const next: Bases = [false, false, false]
  let runs = 0
  const pos: number[] = []
  if (f) pos.push(1)
  if (s) pos.push(2)
  if (t) pos.push(3)
  pos.push(0)
  for (const p of pos) {
    const np = p + n
    if (np >= 4) runs += 1
    else {
      next[np - 1] = true
    }
  }
  return { bases: next, runs }
}

export function applyEvent(state: GameState, event: GameEvent): { state: GameState; summary: string } {
  if (event.type === "RESET") {
    return { state: { ...INITIAL_STATE }, summary: "Game reset" }
  }

  if (event.type === "OUT" || event.type === "STRIKEOUT") {
    return applyOutLike(state, event.type === "STRIKEOUT")
  }

  const [f, s, t] = state.bases

  if (event.type === "SINGLE" || event.type === "DOUBLE") {
    const n: 1 | 2 = event.type === "SINGLE" ? 1 : 2
    const { bases, runs } = hitBases(f, s, t, n)
    return {
      state: withRuns({ ...state, bases }, runs),
      summary: buildHitSummaryFromBases(
        event.type,
        n,
        state.bases,
        runs
      ),
    }
  }

  if (event.type === "TRIPLE") {
    const nOn = (f ? 1 : 0) + (s ? 1 : 0) + (t ? 1 : 0)
    return {
      state: withRuns({ ...state, bases: [false, false, true] }, nOn),
      summary: buildTripleSummary(f, s, t, nOn),
    }
  }

  if (event.type === "HOME_RUN") {
    const r = 1 + (f ? 1 : 0) + (s ? 1 : 0) + (t ? 1 : 0)
    return {
      state: withRuns({ ...state, bases: [false, false, false] }, r),
      summary: buildHomeRunSummary(f, s, t, r),
    }
  }

  if (event.type === "WALK") {
    const { bases, runs } = walkBases(f, s, t)
    return {
      state: withRuns({ ...state, bases }, runs),
      summary: buildWalkSummary(f, s, t, runs),
    }
  }

  return { state, summary: "Unknown" }
}

/**
 * For a hit advance of n, which occupied bases' runners reach home? Position p
 * (1–3 for bases, batter separate) — score when p + n >= 4.
 */
function buildTripleSummary(
  f: boolean,
  s: boolean,
  t: boolean,
  nScoring: number
): string {
  if (nScoring === 0) {
    return "Triple: batter to 3rd, bases were empty"
  }
  const parts: string[] = []
  if (f) {
    parts.push("1st")
  }
  if (s) {
    parts.push("2nd")
  }
  if (t) {
    parts.push("3rd")
  }
  const who = formatRunnersList(parts)
  if (nScoring === 1) {
    return `Triple: 1 run (runner on ${who} scores); batter to 3rd`
  }
  return `Triple: ${nScoring} runs (runners on ${who} all score); batter to 3rd`
}

function buildHomeRunSummary(
  f: boolean,
  s: boolean,
  t: boolean,
  totalRuns: number
): string {
  if (totalRuns === 1) {
    return "Home run: 1 run (batter only)"
  }
  const o: string[] = []
  if (f) {
    o.push("1st")
  }
  if (s) {
    o.push("2nd")
  }
  if (t) {
    o.push("3rd")
  }
  if (o.length === 0) {
    return `Home run: ${totalRuns} runs (should not happen — batter only)`
  }
  return `Home run: ${totalRuns} total — batter and runners on ${formatRunnersList(o)} all score`
}

function whoScoredFromHit(
  f: boolean,
  s: boolean,
  t: boolean,
  n: 1 | 2
): string[] {
  const out: string[] = []
  if (t && 3 + n >= 4) {
    out.push("3rd")
  }
  if (s && 2 + n >= 4) {
    out.push("2nd")
  }
  if (f && 1 + n >= 4) {
    out.push("1st")
  }
  return out
}

function formatRunnersList(labels: string[]): string {
  if (labels.length === 0) {
    return ""
  }
  if (labels.length === 1) {
    return labels[0]!
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`
  }
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
}

function buildHitSummaryFromBases(
  kind: "SINGLE" | "DOUBLE",
  n: 1 | 2,
  before: Bases,
  runs: number
): string {
  const name = kind === "SINGLE" ? "Single" : "Double"
  const [f, s, t] = before
  if (runs === 0) {
    if (!f && !s && !t) {
      return `${name}: no runs; batter to ${n === 1 ? "1st" : "2nd"}`
    }
    return `${name}: no runs; runners move up, none score`
  }
  const origins = whoScoredFromHit(f, s, t, n)
  const fromText = formatRunnersList(origins)
  if (runs === 1) {
    return `${name}: 1 run (runner on ${fromText} scores)`
  }
  return `${name}: ${runs} runs (runners on ${fromText} score on the ${name.toLowerCase()})`
}

function buildWalkSummary(f: boolean, s: boolean, t: boolean, runs: number): string {
  if (runs === 1) {
    return "Walk: 1 run (3rd baserunner forced home on bases loaded); still loaded"
  }
  if (!f) {
    if (!s && !t) {
      return "Walk: batter to 1st"
    }
    return "Walk: batter to 1st; runners on 2nd/3rd hold (no one on 1st before pitch)"
  }
  if (f && !s && t) {
    return "Walk: 1st & 3rd — 1st→2nd, batter to 1st, runner stays on 3rd"
  }
  if (f && s && !t) {
    return "Walk: 1st & 2nd — 1st→2nd, 2nd→3rd, batter to 1st (loaded)"
  }
  if (f && !s && !t) {
    return "Walk: 1st occupied — 1st→2nd, batter to 1st"
  }
  return "Walk: batter to 1st, runners advance on the force"
}
