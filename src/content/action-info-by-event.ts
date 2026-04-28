import type { GameEventType } from "../game/game-event.type"

export type ActionInfoBlock = { heading: string; body: string }

export type ActionInfo = {
  title: string
  runButtonLabel: string
  blocks: ActionInfoBlock[]
}

/**
 * Teaching copy: real baseball first, then what this app does (no file or API names).
 */
export function getActionInfoForEventType(type: GameEventType): ActionInfo {
  switch (type) {
    case "SINGLE":
      return {
        title: "Single",
        runButtonLabel: "Run this play",
        blocks: [
          {
            heading: "Real baseball",
            body: "The batter puts the ball in fair play and reaches 1st base safely. Baserunners try to take the next base if they can do it safely.",
          },
          {
            heading: "Why runners move",
            body: "Everyone is trying to get closer to home. In this app’s clean “single” model, all offensive players advance one base: the batter becomes a runner to 1st, and a runner on 3rd is only 90 feet from scoring.",
          },
          {
            heading: "In this app",
            body: "Everyone (including the batter) moves up one base. If that movement carries a runner from 3rd across home, the batting team is credited a run. Only one runner per base in this model.",
          },
          {
            heading: "This play in the sim",
            body: "Before: runner on 2nd, 1 out. After: batter to 1st and runner to 3rd, +0 runs, still 1 out.",
          },
        ],
      }
    case "DOUBLE":
      return {
        title: "Double",
        runButtonLabel: "Run this play",
        blocks: [
          {
            heading: "Real baseball",
            body: "The batter reaches 2nd safely (e.g. ball in the gap). Baserunners are often more aggressive the farther the ball is hit.",
          },
          {
            heading: "Why runners move",
            body: "The play gives the offense more than one base. Here, every runner—including the batter from home—advances two bases in the same simple model.",
          },
          {
            heading: "In this app",
            body: "Same idea as a single, but every runner advances two bases. Someone scores only if that advance is enough to cross home from where they started (for example, from 2nd or 3rd with a two-base advance).",
          },
          {
            heading: "This play in the sim",
            body: "Before: runner on 1st, 0 outs. After: batter to 2nd and runner scores from 1st with the two-base advance rule, +1 run, still 0 outs.",
          },
        ],
      }
    case "TRIPLE":
      return {
        title: "Triple",
        runButtonLabel: "Run this play",
        blocks: [
          {
            heading: "Real baseball",
            body: "The batter reaches 3rd; it’s a rare, usually hard-hit play. Runners in front of the ball often score because three bases of running usually carries them to the plate before the play ends.",
          },
          {
            heading: "Why runners move",
            body: "There are many feet between bases, but 3+ bases of advance for everyone who was on base in front of a triple is almost always a score for them, while the batter is still going to 3rd.",
          },
          {
            heading: "In this app",
            body: "All runners on 1st, 2nd, and 3rd score, and the batter is placed on 3rd. That’s a deliberate simplification for learning.",
          },
          {
            heading: "This play in the sim",
            body: "Before: runners on 1st and 2nd, 1 out. After: both runners score, batter on 3rd, +2 runs, still 1 out.",
          },
        ],
      }
    case "HOME_RUN":
      return {
        title: "Home run",
        runButtonLabel: "Run this play",
        blocks: [
          {
            heading: "Real baseball",
            body: "A fair batted ball often leaves the field (“over the fence”) or, rarely, a batter circles all the bases. On a four-base home run, the batter and every baserunner can touch the plate to score, in order.",
          },
          {
            heading: "Why everyone can score",
            body: "Each has the right to run the full diamond when the play allows. This app doesn’t show relays or where the ball went—it just applies the result you pick.",
          },
          {
            heading: "In this app",
            body: "Bases clear. The score goes up by one for the batter and one for each runner who was on base (at most four in one play when the bags were full).",
          },
          {
            heading: "This play in the sim",
            body: "Before: runners on 1st and 3rd, 2 outs. After: everyone scores and bases clear, +3 runs total (two runners plus batter), still 2 outs.",
          },
        ],
      }
    case "WALK":
      return {
        title: "Walk (4 balls)",
        runButtonLabel: "Run this play",
        blocks: [
          {
            heading: "Real baseball",
            body: "A ball is a pitch the batter does not offer at (roughly) outside the strike zone. After four such balls, the result is a base on balls: the batter is awarded 1st without a putout—often described as the pitcher “losing” the at-bat before a fair batted result.",
          },
          {
            heading: "Why only some runners move",
            body: "The batter must take 1st. If 1st is empty, only the batter is added. If 1st is full, a chain of forces opens: the runner on 1st must go to 2nd to make room, and so on. With the bases loaded, the runner on 3rd is forced home, so a run can score on a walk—without a hit in play.",
          },
          {
            heading: "In this app",
            body: "A fixed set of “who moves where” on a walk, including a run on a bases-loaded walk. Other base situations follow the same force idea without naming every real-life edge case.",
          },
          {
            heading: "This play in the sim",
            body: "Before: bases loaded, 1 out. After: runner from 3rd is forced home, others advance one base, batter to 1st, +1 run, still 1 out.",
          },
        ],
      }
    case "STRIKEOUT":
      return {
        title: "Strikeout",
        runButtonLabel: "Record strikeout",
        blocks: [
          {
            heading: "Real baseball",
            body: "The batter accrues three strikes before a fair batted result (details like foul tips and dropped third strikes are simplified here). The story is: there is no fair hit in play that we use for this at-bat, in a “swing and miss” spirit.",
          },
          {
            heading: "Why it’s the batter’s out",
            body: "A strikeout retires the batter, which adds one to the out count for the half. We don’t show who caught what.",
          },
          {
            heading: "In this app",
            body: "Adds one out, same as the “Out” button for inning and side changes. The play log uses “Strikeout” wording so you can tell it apart from a batted-ball out.",
          },
          {
            heading: "This play in the sim",
            body: "Before: runner on 1st, 1 out. After: bases unchanged, outs increase to 2, +0 runs.",
          },
        ],
      }
    case "OUT":
      return {
        title: "Out (batted ball, etc.)",
        runButtonLabel: "Record out",
        blocks: [
          {
            heading: "Real baseball",
            body: "We use this for when the defense records an out on a batted ball in play (sacrifice flies, fielder’s choice, and so on are not split out). The ball was in play and someone was put out, not a strikeout in the whiffing sense.",
          },
          {
            heading: "Strikeout vs out in this app",
            body: "Both buttons add one out for inning purposes. The words in the play log are different so you can practice saying a K versus a batted out.",
          },
          {
            heading: "In this app",
            body: "Adds one out. On the 3rd out of the half, the bases clear and the game moves to the next part of the inning (or the next inning after the bottom of the previous one), like a new offensive turn.",
          },
          {
            heading: "This play in the sim",
            body: "Before: runners on 1st and 2nd, 2 outs. After: third out recorded, half-inning ends, bases clear for next side, +0 runs on the out itself.",
          },
        ],
      }
    case "RESET":
      return {
        title: "Reset game",
        runButtonLabel: "Yes, reset game",
        blocks: [
          {
            heading: "What it does",
            body: "Puts the simulator back to a fresh first-inning, top, no one on, no score, and clears the play log so you can start a new scenario.",
          },
          {
            heading: "In this app",
            body: "The whole board of inning, count of outs, bases, and both teams’ runs starts over.",
          },
          {
            heading: "This play in the sim",
            body: "Before: any bases/outs/score/inning. After: top 1st, bases empty, 0 outs, score reset to 0-0.",
          },
        ],
      }
  }
}
