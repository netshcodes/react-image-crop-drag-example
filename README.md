# react-image-crop-drag demo

A one-page example of [react-image-crop-drag](https://www.npmjs.com/package/react-image-crop-drag), installed from npm the way any consumer installs it. Set every prop from the panel, drag the frame, then copy the JSX for the state you ended up with.

## Run it

```bash
npm install
npm run dev
```

## Deploy it

```bash
npm run build
```

That writes a static site to `dist/`, which any static host can serve. Preview the built output with `npm run preview`.

If you serve the site from a subpath rather than a domain root, set
[`base`](https://vite.dev/config/shared-options.html#base) in `vite.config.ts` to that subpath so
the asset URLs resolve.

## What the page does

| Control | Prop it sets | What it shows |
| --- | --- | --- |
| The image row | `src`, `alt` | Three samples with different aspect ratios, plus any image you load from your own disk. |
| Panorama, Square, Portrait | `containerWidth`, `containerHeight` | The frame is fixed in pixels and the image is scaled to cover it. |
| Draggable | `isEditing` | Switched off, the frame keeps its crop, leaves the tab order, and ignores pointer and key input. |
| zoom | `zoom` | Below the fit the image stops covering the frame, so it centres and stops moving. |

The readout under the frame reports the source size, the size the component scaled it to, and which
axes you can still drag. An axis moves only while the scaled image is larger than the frame on that
axis, which is why a tall source drags vertically but not horizontally.

Images you load stay in the browser. The page reads them through `URL.createObjectURL` and uploads nothing.

The three samples are SVGs carrying a percent ruler and a focal point marker, so you can tell which part of the source the frame is sitting on while you drag.

## How it is put together

- `src/catalog.ts` holds the sample images, the frame sizes, and `fit`, which repeats the
  component's cover-and-clamp arithmetic for the readout.
- `src/App.tsx` holds the selected image, the uploaded image, the frame, `isEditing`, and `zoom`.
  The code block is derived from that state, so it cannot disagree with the frame above it.
- `public/samples/` holds the three SVG samples.
