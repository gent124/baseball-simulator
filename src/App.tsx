import { useCallback, useEffect, useRef, useState } from "react"
import { buildRunnerAnimationPlan } from "./animation/build-runner-animation-plan"
import {
  applyRunnerWave,
  inferBasesFromRunners,
  makeInitialRunnersMap,
  type RunnersAt,
  stripScoredRunners,
} from "./animation/runner-positions"
import { applyEvent, INITIAL_STATE } from "./game/apply-event"
import { RunnerField } from "./components/RunnerField"
import { ActionInfoModal } from "./components/ActionInfoModal"
import { TeachingGuide } from "./components/TeachingGuide"
import type { GameState } from "./game/game-state.type"
import type { GameEvent } from "./game/game-event.type"
import "./App.css"

type AppModel = {
  game: GameState
  lastAction: string
  playByPlay: string[]
}

const MAX_PBP = 32

function withScoreSummary(summary: string, game: GameState): string {
  return `${summary} (Score: A ${game.score.away} - H ${game.score.home})`
}

function nextModelAfterEvent(
  prev: AppModel,
  outGame: GameState,
  summary: string,
  event: GameEvent
): AppModel {
  const summaryWithScore = withScoreSummary(summary, outGame)
  if (event.type === "RESET") {
    return { game: outGame, lastAction: summaryWithScore, playByPlay: [] }
  }
  return {
    game: outGame,
    lastAction: summaryWithScore,
    playByPlay: [summaryWithScore, ...prev.playByPlay].slice(0, MAX_PBP),
  }
}

const controlButtons: { label: string; event: GameEvent }[] = [
  { label: "Single", event: { type: "SINGLE" } },
  { label: "Double", event: { type: "DOUBLE" } },
  { label: "Triple", event: { type: "TRIPLE" } },
  { label: "Home run", event: { type: "HOME_RUN" } },
  { label: "Walk", event: { type: "WALK" } },
  { label: "Out", event: { type: "OUT" } },
  { label: "Strikeout", event: { type: "STRIKEOUT" } },
  { label: "Reset game", event: { type: "RESET" } },
]

const baseLabels: [string, string, string] = [
  "1st base (occupied)",
  "2nd base (occupied)",
  "3rd base (occupied)",
]

function baseNoop() {
  /* Bases follow game events. */
}

function doubleRaf(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => {
    setTimeout(r, ms)
  })
}

export default function App() {
  const [model, setModel] = useState<AppModel>({
    game: INITIAL_STATE,
    lastAction: "Welcome — use the play buttons to simulate plate appearances.",
    playByPlay: [],
  })
  const modelRef = useRef(model)
  const playLock = useRef(false)
  useEffect(() => {
    modelRef.current = model
  }, [model])
  const [runnersAt, setRunnersAt] = useState<RunnersAt | null>(null)
  const [animating, setAnimating] = useState(false)
  const [appView, setAppView] = useState<"play" | "learn">("play")
  const [pendingPlayInfo, setPendingPlayInfo] = useState<GameEvent | null>(null)

  useEffect(() => {
    return () => {
      setRunnersAt(null)
    }
  }, [])

  const runEvent = useCallback(async (event: GameEvent) => {
    if (playLock.current) {
      return
    }
    playLock.current = true
    try {
      const g0 = modelRef.current.game
      const { state, summary } = applyEvent(g0, event)
      const from = g0
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const plan = reduced ? null : buildRunnerAnimationPlan(from, state, event)
      if (!plan || plan.waves.length === 0) {
        setModel((m) => nextModelAfterEvent(m, state, summary, event))
        return
      }

      setAnimating(true)
      let at = makeInitialRunnersMap(from.bases)
      setRunnersAt(at)
      try {
        await doubleRaf()
        for (const wave of plan.waves) {
          at = applyRunnerWave(at, wave)
          setRunnersAt({ ...at })
          await sleep(plan.waveMs)
          at = stripScoredRunners(at)
          setRunnersAt({ ...at })
        }
        setModel((m) => nextModelAfterEvent(m, state, summary, event))
        setRunnersAt(null)
      } catch (e) {
        setRunnersAt(null)
        throw e
      } finally {
        setAnimating(false)
      }
    } finally {
      playLock.current = false
    }
  }, [])

  const g = model.game
  const showRunners = runnersAt != null
  const visBases = showRunners ? inferBasesFromRunners(runnersAt, g.bases) : g.bases
  const batting: "home" | "away" = g.half === "top" ? "away" : "home"

  return (
    <div className={`app${animating ? " app--animating" : ""}`}>
      <header className="app__header">
        <h1 className="app__title">Baseball score simulator</h1>
        <p className="app__subtitle">
          Minimal &quot;engine&quot; view — {batting} team is batting,{" "}
          {g.half === "top" ? "home" : "away"} in the field. Runners step from base to base; honors
          reduced-motion. <strong>Pick a play</strong> to read what it means, then run it in the
          dialog.
        </p>
        <nav className="app__nav" role="tablist" aria-label="Main">
          <button
            type="button"
            role="tab"
            id="tab-play"
            className={appView === "play" ? "app__tab app__tab--on" : "app__tab"}
            aria-selected={appView === "play"}
            aria-controls="play-panel"
            onClick={() => {
              setAppView("play")
            }}>
            Play
          </button>
          <button
            type="button"
            role="tab"
            id="tab-learn"
            className={appView === "learn" ? "app__tab app__tab--on" : "app__tab"}
            aria-selected={appView === "learn"}
            aria-controls="teach-panel"
            onClick={() => {
              setAppView("learn")
            }}>
            How it works
          </button>
        </nav>
      </header>

      {appView === "learn" ? (
        <div className="app__teach-outer" role="presentation">
          <TeachingGuide />
        </div>
      ) : (
        <div className="app__play" id="play-panel" role="tabpanel" aria-labelledby="tab-play">
      <div className="app__layout">
        <section className="app__diamond-wrap" aria-label="Bases and situation">
          <div className="diamond__stats">
            <p>
              <span className="diamond__stat-lbl">Inning</span>{" "}
              <span className="diamond__stat-val">
                {g.half === "top" ? "Top" : "Bottom"} {g.inning}
              </span>
            </p>
            <p>
              <span className="diamond__stat-lbl">Outs</span>{" "}
              <span className="diamond__stat-val">{g.outs}</span>
            </p>
            <p>
              <span className="diamond__stat-lbl">Score</span>{" "}
              <span className="diamond__stat-val">
                A {g.score.away} — H {g.score.home}
              </span>
            </p>
          </div>

          <div className="diamond">
            <button
              type="button"
              className={`diamond__base diamond__base--2 ${
                visBases[1] ? "diamond__base--on" : ""
              }${showRunners ? " diamond__base--dim" : ""}`}
              title={visBases[1] ? baseLabels[1] : "2nd base (empty)"}
              aria-pressed={visBases[1]}
              onClick={baseNoop}
            >
              2nd
            </button>
            <button
              type="button"
              className={`diamond__base diamond__base--1 ${
                visBases[0] ? "diamond__base--on" : ""
              }${showRunners ? " diamond__base--dim" : ""}`}
              title={visBases[0] ? baseLabels[0] : "1st base (empty)"}
              aria-pressed={visBases[0]}
              onClick={baseNoop}
            >
              1st
            </button>
            <button
              type="button"
              className={`diamond__base diamond__base--3 ${
                visBases[2] ? "diamond__base--on" : ""
              }${showRunners ? " diamond__base--dim" : ""}`}
              title={visBases[2] ? baseLabels[2] : "3rd base (empty)"}
              aria-pressed={visBases[2]}
              onClick={baseNoop}
            >
              3rd
            </button>
            <div className="diamond__home" aria-hidden>
              Home
            </div>
            <RunnerField at={showRunners ? runnersAt : null} />
          </div>
        </section>

        <aside className="app__controls" aria-label="Plays">
          {controlButtons.map((b) => (
            <button
              type="button"
              key={b.label}
              className="app__control-btn"
              disabled={animating}
              onClick={() => {
                setPendingPlayInfo(b.event)
              }}
            >
              {b.label}
            </button>
          ))}
        </aside>
      </div>

      <section className="app__narration">
        <p className="app__last">
          <span className="app__narr-lbl">Last</span> {model.lastAction}
        </p>
        <h2 className="app__pbp-title">Play-by-play</h2>
        <ol className="app__pbp">
          {model.playByPlay.length === 0 ? (
            <li className="app__pbp-empty">Plays you record will show here.</li>
          ) : (
            model.playByPlay.map((line, i) => (
              <li key={`${model.playByPlay.length - i}-${line}`}>{line}</li>
            ))
          )}
        </ol>
      </section>
        </div>
      )}

      <ActionInfoModal
        event={pendingPlayInfo}
        game={g}
        onClose={() => {
          setPendingPlayInfo(null)
        }}
        onRunPlay={(e) => {
          setPendingPlayInfo(null)
          void runEvent(e)
        }}
      />
    </div>
  )
}
