import { useEffect, useId, useRef } from "react"
import { getActionInfoForEventType } from "../content/action-info-by-event"
import type { GameEvent } from "../game/game-event.type"

type Props = {
  event: GameEvent | null
  onClose: () => void
  onRunPlay: (event: GameEvent) => void
}

export function ActionInfoModal({ event, onClose, onRunPlay }: Props) {
  const titleId = useId()
  const runButtonRef = useRef<HTMLButtonElement>(null)

  const info = event ? getActionInfoForEventType(event.type) : null

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
              {b.heading === "This play in the sim" && b.body.includes("Before:") && b.body.includes("After:") ? (
                <p className="modal__p">
                  {(() => {
                    const beforeStart = b.body.indexOf("Before:")
                    const afterStart = b.body.indexOf("After:")
                    if (beforeStart === -1 || afterStart === -1 || afterStart <= beforeStart) {
                      return b.body
                    }
                    const beforeText = b.body.slice(beforeStart + "Before:".length, afterStart).trim()
                    const afterText = b.body.slice(afterStart + "After:".length).trim()
                    return (
                      <>
                        <strong>Before:</strong> {beforeText}
                        <br />
                        <strong>After:</strong> {afterText}
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
