import { useEffect, useId, useRef } from "react"
import { applyEvent } from "../game/apply-event"
import { getActionInfoForEventType } from "../content/action-info-by-event"
import type { GameEvent } from "../game/game-event.type"
import type { GameState } from "../game/game-state.type"

type Props = {
  event: GameEvent | null
  game: GameState
  onClose: () => void
  onRunPlay: (event: GameEvent) => void
}

function formatBases(bases: GameState["bases"]): string {
  const occupied: string[] = []
  if (bases[0]) occupied.push("1st")
  if (bases[1]) occupied.push("2nd")
  if (bases[2]) occupied.push("3rd")
  return occupied.length > 0 ? occupied.join(", ") : "empty"
}

function formatInningLabel(inning: number): string {
  const v = inning % 100
  if (v >= 11 && v <= 13) return `${inning}th`
  switch (inning % 10) {
    case 1:
      return `${inning}st`
    case 2:
      return `${inning}nd`
    case 3:
      return `${inning}rd`
    default:
      return `${inning}th`
  }
}

export function ActionInfoModal({ event, game, onClose, onRunPlay }: Props) {
  const titleId = useId()
  const runButtonRef = useRef<HTMLButtonElement>(null)

  const info = event ? getActionInfoForEventType(event.type) : null
  const preview = event ? applyEvent(game, event) : null

  useEffect(() => {
    if (!event) {
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = requestAnimationFrame(() => {
      runButtonRef.current?.focus()
    })
    return () => {
      document.body.style.overflow = prev
      cancelAnimationFrame(t)
    }
  }, [event])

  useEffect(() => {
    if (!event) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
    }
  }, [event, onClose])

  if (!event || !info) {
    return null
  }

  return (
    <div className="modal" role="presentation">
      <button
        type="button"
        className="modal__backdrop"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <h2 className="modal__title" id={titleId}>
          {info.title}
        </h2>
        <div className="modal__body">
          {info.blocks.map((b) => (
            <div key={b.heading} className="modal__section">
              <h3 className="modal__h3">{b.heading}</h3>
              {b.heading === "This play in the sim" && preview ? (
                <p className="modal__p">
                  {(() => {
                    const battingTeam = game.half === "top" ? "away" : "home"
                    const runsScored = preview.state.score[battingTeam] - game.score[battingTeam]
                    const changedHalf =
                      preview.state.half !== game.half || preview.state.inning !== game.inning
                    return (
                      <>
                        <strong>Before:</strong> bases {formatBases(game.bases)}, {game.outs} out
                        {game.outs === 1 ? "" : "s"}.
                        <br />
                        <strong>After:</strong> bases {formatBases(preview.state.bases)}, runs{" "}
                        {runsScored >= 0 ? `+${runsScored}` : runsScored}, {preview.state.outs} out
                        {preview.state.outs === 1 ? "" : "s"}.
                        {changedHalf ? (
                          <>
                            <br />
                            <strong>Next:</strong> half-inning over, now{" "}
                            {preview.state.half === "top" ? "Top" : "Bottom"}{" "}
                            {formatInningLabel(preview.state.inning)}.
                          </>
                        ) : null}
                      </>
                    )
                  })()}
                </p>
              ) : (
                <p className="modal__p">{b.body}</p>
              )}
            </div>
          ))}
        </div>
        <div className="modal__actions">
          <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            ref={runButtonRef}
            className="modal__btn modal__btn--primary"
            onClick={() => {
              onRunPlay(event)
            }}
          >
            {info.runButtonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
