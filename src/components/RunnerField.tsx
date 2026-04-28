import type { BaseSpot } from "../animation/base-spot.type"
import type { RunnerId } from "../animation/runner-id.type"
import type { RunnersAt } from "../animation/runner-positions"

const order: RunnerId[] = ["b", "1", "2", "3"]

function spotToClass(spot: BaseSpot): string {
  if (spot === "home") {
    return "diamond__runner--p-home"
  }
  if (spot === "scored") {
    return "diamond__runner--p-scored"
  }
  if (spot === 1) {
    return "diamond__runner--p-1"
  }
  if (spot === 2) {
    return "diamond__runner--p-2"
  }
  return "diamond__runner--p-3"
}

export function RunnerField({ at }: { at: RunnersAt | null }) {
  if (at == null) {
    return null
  }
  return (
    <div className="diamond__runners" aria-hidden>
      {order.map((id) => {
        const spot = at[id]
        if (spot == null) {
          return null
        }
        return (
          <div
            key={id}
            className={`diamond__runner ${spotToClass(spot)}`}
            title={typeof spot === "string" && spot === "scored" ? "Run scored" : `Runner at ${String(spot)}`}
          />
        )
      })}
    </div>
  )
}
