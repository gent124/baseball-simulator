export type GameEventType =
  | "SINGLE"
  | "DOUBLE"
  | "TRIPLE"
  | "HOME_RUN"
  | "WALK"
  | "OUT"
  | "STRIKEOUT"
  | "RESET"

export type GameEvent = { type: GameEventType }
