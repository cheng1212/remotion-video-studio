# Remotion Video Studio

A small Remotion 4 project that renders MP4 videos on GitHub Actions hosted runners.

## Render on GitHub

1. Open the **Actions** tab and select **Render Remotion video**.
2. Click **Run workflow**.
3. Choose 1080p or 4K, select 24/30/60 fps, and set a duration from 1 to 60 seconds.
4. When the workflow finishes, download `video.mp4` from the run's **Artifacts** section.

The workflow uses GitHub's `ubuntu-latest` hosted runner. It does not require a self-hosted machine or repository secrets. Rendering at 4K or with a longer duration takes more runner time.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run start
```

Render the default 5-second 1080p example:

```bash
npx remotion render src/index.ts MainComposition out/video.mp4
```

The example composition is in `src/MainComposition.tsx`; `src/Root.tsx` defines its output metadata.
