import type { BaseSpot } from "./base-spot.type"
import type { RunnerId } from "./runner-id.type"

export type RunnerMove = {
  runnerId: RunnerId
  from: BaseSpot
  to: BaseSpot
}
