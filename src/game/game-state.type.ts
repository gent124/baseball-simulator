export type Half = "top" | "bottom"

export type Score = {
  home: number
  away: number
}

/** Bases: [1st, 2nd, 3rd] — at most one runner per base in this model */
export type Bases = [boolean, boolean, boolean]

export type GameState = {
  inning: number
  half: Half
  /** 0, 1, or 2 — a third out triggers sides changing (never stored as 3) */
  outs: 0 | 1 | 2
  bases: Bases
  score: Score
}
