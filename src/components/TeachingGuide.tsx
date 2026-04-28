/** Teaching: real baseball first, then what this app does. */
export function TeachingGuide() {
  return (
    <div className="teach" id="teach-panel" role="tabpanel" aria-labelledby="tab-learn">
      <p className="teach__lead">
        This app is a <strong>toy &quot;game engine&quot;</strong> for learning baseball{" "}
        <em>state</em> (bases, runs, outs, innings). Below: <strong>real baseball</strong> first, then{" "}
        <strong>how the simulator simplifies it</strong>—so you get the <em>why</em>, not just the buttons.
        When you run a play, the app updates inning, side, outs, bases, and the score the same way each time
        for that type of result.
      </p>

      <section className="teach__section" aria-labelledby="t-model">
        <h2 className="teach__h2" id="t-model">
          What we model (and what we skip)
        </h2>
        <h3 className="teach__h3">Real baseball: many pitches; we only use the outcome</h3>
        <p>
          The <strong>pitcher</strong> throws to the <strong>catcher</strong>; the <strong>batter</strong> can
          swing or take. The count runs through <strong>balls</strong> and <strong>strikes</strong> until the
          plate appearance <em>ends</em>—e.g. <strong>strikeout</strong>, <strong>walk</strong>, or a{" "}
          <strong>ball in play</strong> (a hit, or a batted ball the defense turns into an out).
        </p>
        <p>
          <strong>This app does not model every pitch.</strong> One button = one <em>finished</em> at-bat{" "}
          <em>result</em>. The app updates bases, runs, outs, and inning as if that had already
          happened—so you can <em>see</em> base running without simulating 3–2 counts, foul tips, and tag
          plays.
        </p>
        <p>
          <span className="teach__tag">In this app</span> You pick a result (single, walk, strikeout, and so
          on). The sim does not know or care about “fastball vs curve”—only the outcome you chose.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-offense">
        <h2 className="teach__h2" id="t-offense">
          The core of offense
        </h2>
        <p>
          The infield is a <strong>square of bases</strong> (1st, 2nd, 3rd) with <strong>home</strong> where
          the batter <em>starts</em> when hitting. A <strong>run</strong> is scored when an offensive
          player legally touches 1st → 2nd → 3rd → <strong>home</strong>, in order, before the defense ends
          the half-inning (for beginners: <em>before the third out</em> in most simple cases).
        </p>
        <p>
          <strong>Why 3rd matters conceptually:</strong> from 3rd, you are <strong>one 90-foot leg</strong> from
          home. The app does not draw every step; it asks: after the play, who <em>reached home</em> and how
          many <em>new</em> runs to credit.
        </p>
        <p>
          <span className="teach__tag">In this app</span> A <strong>hit</strong> result gives every runner
          (batter or player on a base) a number of <em>bases</em> to advance. If the advance is enough to
          carry a runner <strong>from their starting point past 3rd and across home</strong> in the simple
          one-runner-per-base picture, the batting team gets a run.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-force">
        <h2 className="teach__h2" id="t-force">
          Force and tag (simplified)
        </h2>
        <p>
          Not every play is a <strong>force</strong> in real life. In this app we use a small model:
        </p>
        <ul>
          <li>
            <strong>Tag (idea):</strong> the defense can tag a runner. We keep at most <strong>one runner per
            base</strong> and skip most tag logic.
          </li>
          <li>
            <strong>Force (idea):</strong> the batter must be given <strong>1st</strong> on a walk or a hit. If
            1st is <strong>occupied</strong>, the lead runner is <em>forced</em> to leave—there is not room
            for both. A <strong>walk with bases loaded</strong> &quot;bumps&quot; the line: the runner on 3rd
            is <em>forced home</em> for a <strong>run</strong> when there is no extra base to take except
            home.
          </li>
        </ul>
        <p>
          <strong>Why 3rd often scores on a single in the toy model:</strong> a &quot;single&quot; here means
          everyone <strong>+1</strong> base. From 3rd, that last leg is <em>home</em>—a fair simplification
          to teach the <em>shape</em> of the diamond, not every fly-ball exception.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-single">
        <h2 className="teach__h2" id="t-single">
          Single
        </h2>
        <p>
          <strong>Real world:</strong> fair ball, batter safe at 1st; other runners <em>usually</em> try to
          take the next base.
        </p>
        <p>
          <strong>Why they move:</strong> they are trying to get <em>closer to home</em> without being out. In
          the clean single model, everyone <strong>+1</strong> in parallel: a runner on 3rd with only 90 feet
          to go often scores.
        </p>
        <p>
          <span className="teach__tag">In this app</span> The batter takes 1st, every other runner goes up one
          base, and any runner who reaches home is credited a run. Only one runner per base.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-double">
        <h2 className="teach__h2" id="t-double">
          Double
        </h2>
        <p>
          <strong>Real world:</strong> batter reaches 2nd (e.g. ball in the gap). Runners are more
          aggressive the farther the ball travels.
        </p>
        <p>
          <strong>Why they move:</strong> same idea with <strong>+2</strong> for everyone: two 90 ft chunks
          in one &quot;event.&quot; A runner on 1st may land on 3rd; someone scores only if two bases of
          advance is enough to cross home from where they started.
        </p>
        <p>
          <span className="teach__tag">In this app</span> The batter and every runner on base advance <strong>two
          </strong> bases for this play, using the same rules as a one-base hit but with two base lengths.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-triple">
        <h2 className="teach__h2" id="t-triple">
          Triple
        </h2>
        <p>
          <strong>Real world:</strong> batter reaches 3rd; it is a rare, often hard-hit play. Everyone on base
          in front of a triple often <em>scores</em> because three bases of advance is almost always home
          from any bag.
        </p>
        <p>
          <span className="teach__tag">In this app</span> <strong>All</strong> runners on 1st, 2nd, or 3rd{" "}
          <strong>score</strong>; the batter is placed on 3rd. That skips some odd real-life cases, but the
          teaching line is: <em>a triple often clears the bases, batter to 3rd</em>.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-hr">
        <h2 className="teach__h2" id="t-hr">
          Home run
        </h2>
        <p>
          <strong>Real world:</strong> a fair batted ball often leaves the yard, or a rare in-park cycle of
          the bases. In a classic <strong>four-base</strong> homer, <strong>everyone on base and the
          batter</strong> can score, each touching in order. We do not name fielders.
        </p>
        <p>
          <span className="teach__tag">In this app</span> Bases <strong>clear</strong>. Runs added ={" "}
          <strong>1 for the batter + 1 for each runner who was on</strong> (at most 4 in one swing when
          the bases are loaded).
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-walk">
        <h2 className="teach__h2" id="t-walk">
          Walk (4 balls) — read carefully
        </h2>
        <p>
          <strong>Real world:</strong> a <em>ball</em> is a pitch outside the strike zone that the batter
          does not offer at (simplified; there are check swings, HBP, etc.). After <strong>four
          balls</strong> the batter is awarded <strong>1st</strong> without a hit: <strong>base on balls
          (walk)</strong>—the pitcher <em>lost the at-bat</em> before a fair batted result.
        </p>
        <p>
          <strong>Why only some runners move:</strong> the batter <strong>must</strong> take 1st. If 1st is
          <strong>empty</strong>, only the batter is added. Runners on 2nd or 3rd with an empty 1st do
          <strong> not</strong> have to &quot;slide up&quot; just to make room—the walk only <em>stacks
          forces</em> when <strong>1st is full</strong>: 1st runner must go to 2nd to open 1st for the
          batter, and so on down the line.
        </p>
        <p>
          <strong>Bases loaded walk:</strong> 1st, 2nd, 3rd all occupied. The walk forces everyone
          <strong> one</strong> base, so the runner on 3rd is <strong>forced</strong> to the only base
          <em>after 3rd</em>: <strong>home</strong> → a <strong>run</strong> scores, then first is still
          re-filled by the new batter, leaving bases <em>full</em> in this compact model.
        </p>
        <p>
          <span className="teach__tag">In this app</span> A fixed set of who moves for each on-base
          pattern; a run can be added in the <strong>bases loaded</strong> case, matching the force line in
          plain terms.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-strikeout">
        <h2 className="teach__h2" id="t-strikeout">
          Strikeout
        </h2>
        <p>
          <strong>Real world:</strong> three <strong>strikes</strong> before a fair batted result (bundle of
          cases as &quot;K&quot; for teaching). No <em>hit in play</em> ends that PA as a hit.
        </p>
        <p>
          <strong>Not, in spirit:</strong> a strikeout is not a ground ball to short. The <em>story
          </em> is: the batter <strong>failed</strong> the PA without a fair batted <em>hit</em> we model.
        </p>
        <p>
          <span className="teach__tag">In this app</span> <strong>One out</strong> is recorded, same for inning
          math as the generic <strong>Out</strong> when it comes to the third out. No fielding path is
          animated.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-out">
        <h2 className="teach__h2" id="t-out">
          Out
        </h2>
        <p>
          <strong>Real world (how we use the button):</strong> a <strong>batted</strong> ball in play and the
          defense <strong>records an out</strong> (we do not simulate every fielding type).
        </p>
        <div className="teach__table-wrap">
          <table className="teach__table">
            <caption className="teach__table-caption">Strikeout vs. Out in this app</caption>
            <thead>
              <tr>
                <th scope="col">Idea</th>
                <th scope="col">Strikeout</th>
                <th scope="col">Out</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Story</th>
                <td>No fair <em>hit in play</em> as a hit; batter &quot;whiffed the PA&quot; for teaching</td>
                <td>Ball in play, defense <em>gets the out</em> (we do not name every type)</td>
              </tr>
              <tr>
                <th scope="row">Inning</th>
                <td>Adds one out, same 3rd-out and side change rules</td>
                <td>Same: adds one out</td>
              </tr>
              <tr>
                <th scope="row">Log</th>
                <td>Summary says &quot;Strikeout…&quot;</td>
                <td>Summary says &quot;Out…&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <span className="teach__tag">In this app</span> On the 3rd out of the <strong>half</strong>, bases
          clear, the next offensive turn starts, and the inning or side flips the same as for a strikeout.
          Only the play log <em>wording</em> is different.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-inning">
        <h2 className="teach__h2" id="t-inning">
          Why 3 outs and halves?
        </h2>
        <p>
          <strong>Real world:</strong> the rulebook (history + formal rules) gives each offense{" "}
          <strong>three</strong> <em>outs</em> per <em>half-inning</em> in modern play—not physics, a{" "}
          <strong>game rule</strong> so a side does not bat all day, and the <strong>other</strong> team
          defends, then the sides switch. A <strong>full</strong> inning: visitors in the <strong>top
          </strong>, home in the <strong>bottom</strong>—<em>two</em> half-innings.
        </p>
        <p>
          <span className="teach__tag">In this app</span> The screen never &quot;holds&quot; three outs as
          the ongoing number: the moment the 3rd out of the half happens, the out count resets, bases
          <strong> clear</strong> (a new turn for the other side), and top/bottom and inning advance as
          in ordinary baseball.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-score">
        <h2 className="teach__h2" id="t-score">
          Scoring
        </h2>
        <p>
          <strong>Real world:</strong> a <strong>run</strong> is a tick on the scoreboard when a runner
          <strong> touches the plate in order</strong> in a legal way, usually <em>before</em> the way the
          side &quot;ends&quot; in simple explanations (ignore rare appeals in round one).
        </p>
        <p>
          <span className="teach__tag">In this app</span> The sim uses <strong>discrete</strong> whole-base
          advances. If a hit advance or a walk’s bump carries someone across home, the batting team’s
          run total for that half goes up. At most one runner is shown on each base.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-pbp">
        <h2 className="teach__h2" id="t-pbp">
          Play-by-play
        </h2>
        <p>
          <strong>Real world:</strong> <strong>Announcers</strong> and text PBP exist so radio listeners and
          score readers can follow <em>time order</em> of events without only watching the field.
        </p>
        <p>
          <span className="teach__tag">In this app</span> Every play adds a short <strong>summary line
          </strong> that says in words what changed (so the log <strong>narrates</strong> the same result
          you see on the diamond). The <strong>Play</strong> tab <em>prepends</em> the newest line on
          top.
        </p>
      </section>

      <section className="teach__section" aria-labelledby="t-learn">
        <h2 className="teach__h2" id="t-learn">
          How to use this
        </h2>
        <ol className="teach__ol">
          <li>Read <em>Real world / Why</em> above, then the <em>In this app</em> line in each part.</li>
          <li>
            Switch to <strong>Play</strong> and try buttons while watching the diamond and score.
          </li>
        </ol>
        <p className="teach__more">
          A longer version of the same material is in the project <strong>README</strong> in the
          repository if you use this project from code.
        </p>
      </section>
    </div>
  )
}
