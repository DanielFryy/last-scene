# last-scene

Automate ending your Twitch stream when the current Spotify song finishes after switching to your OBS "ending" scene.

## Features
- Detects OBS scene changes
- Tracks Spotify playback
- Ends stream at the right moment
- Configurable via environment variables

## Structure
```
last-scene/
├─ src/
│  ├─ app/
│  │  ├─ main.ts              # entry point
│  │  ├─ config.ts            # env + config loading
│  │  └─ logger.ts            # structured logging
│  ├─ obs/
│  │  ├─ client.ts            # OBS WebSocket wrapper
│  │  ├─ events.ts            # scene change handling
│  │  └─ control.ts           # stop/start stream
│  ├─ spotify/
│  │  ├─ client.ts            # Spotify API wrapper
│  │  ├─ poller.ts            # polling loop
│  │  └─ types.ts             # normalized playback types
│  ├─ state/
│  │  ├─ machine.ts           # state machine
│  │  ├─ transitions.ts       # rules
│  │  └─ types.ts             # State union types
│  ├─ utils/
│  │  ├─ time.ts              # ms → seconds, remaining time
│  │  └─ abort.ts             # abort helpers
│  └─ index.ts                # thin bootstrapper
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Usage
1. Copy `.env.example` to `.env` and fill in your credentials.
2. Install dependencies: `npm install`
3. Run: `npm start`
