# Baseball Score Simulator

Small React + TypeScript app for simulating baseball outcomes (single, double, walk, strikeout, etc.) and seeing inning, bases, outs, and score update live.

This app focuses on results of plays, not how they physically happen.

## Mental model

Think of the simulator as updating one core game state after each play: who is on base, how many outs there are, what the score is, and which inning half is active.

## Requirements

- Node.js 20+ (or latest LTS)
- npm 10+

## Run the App

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Useful Scripts

- `npm run dev` - start development server
- `npm run build` - type-check and create production build
- `npm run preview` - preview the production build locally

## Troubleshooting

- If dependencies fail to install, delete `node_modules` and `package-lock.json`, then run `npm install` again.
- If port `5173` is busy, Vite will automatically suggest another port in terminal output.

## Quick example

One short sequence could look like this: start with bases empty and 0 outs, then run a **Walk** (runner to 1st), then a **Single** (runners advance, now on 1st and 2nd), then a **Double** (both runners can score depending on starting spots in this sim model), then an **Out** (outs increase by one). This is the core loop: each selected play transforms bases, outs, and score, then the next play starts from that new state.

