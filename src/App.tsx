import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import ImageCropView from 'react-image-crop-drag';

import {
  FRAMES,
  PICTURES,
  UPLOADED_ID,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  fit,
  type Picture
} from './catalog';

export default function App() {
  const [selectedId, setSelectedId] = useState(PICTURES[0].id);
  const [uploaded, setUploaded] = useState<Picture | null>(null);
  const [frame, setFrame] = useState(FRAMES[0]);
  const [isEditing, setIsEditing] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const uploadedUrl = useRef<string | null>(null);

  // An uploaded image joins the samples rather than replacing one, so changing
  // the frame or picking a sample never costs you the image you loaded.
  const gallery = uploaded ? [...PICTURES, uploaded] : PICTURES;
  const picture = gallery.find((item) => item.id === selectedId) ?? PICTURES[0];
  const geometry = fit(picture, frame, zoom);

  const snippet = [
    "import ImageCropView from 'react-image-crop-drag';",
    '',
    '<ImageCropView',
    `  src="${picture.src}"`,
    `  alt="${picture.label}"`,
    `  containerWidth={${frame.width}}`,
    `  containerHeight={${frame.height}}`,
    `  isEditing={${isEditing}}`,
    `  zoom={${zoom}}`,
    '/>'
  ].join('\n');

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const url = URL.createObjectURL(file);
    const probe = new Image();

    // The component needs the natural size to scale the image, so the file is
    // decoded here first. That also catches a file the browser cannot read,
    // which accept="image/*" still lets through.
    probe.onload = () => {
      if (uploadedUrl.current) URL.revokeObjectURL(uploadedUrl.current);
      uploadedUrl.current = url;
      setUploadFailed(false);
      setUploaded({
        id: UPLOADED_ID,
        label: file.name,
        src: url,
        width: probe.naturalWidth,
        height: probe.naturalHeight
      });
      setSelectedId(UPLOADED_ID);
    };

    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setUploadFailed(true);
    };

    probe.src = url;
  }

  function copySnippet() {
    navigator.clipboard.writeText(snippet).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => setCopied(false)
    );
  }

  return (
    <div className="page">
      <header className="masthead">
        <p className="kicker">React component</p>
        <h1>react-image-crop-drag</h1>
        <p className="lede">
          An image scaled to cover a fixed frame, and a drag that moves the crop. Set the props
          below, then copy the JSX.
        </p>
        <code className="install">npm i react-image-crop-drag</code>
      </header>

      <main className="layout">
        <section className="stage" aria-label="Live crop frame">
          <div className="stage-inner">
            <ImageCropView
              src={picture.src}
              alt={picture.label}
              containerWidth={frame.width}
              containerHeight={frame.height}
              isEditing={isEditing}
              zoom={zoom}
            />
          </div>

          <dl className="readout">
            <div>
              <dt>Source image</dt>
              <dd>
                {picture.width} × {picture.height}
              </dd>
            </div>
            <div>
              <dt>Scaled to cover</dt>
              <dd>
                {Math.round(geometry.width)} × {Math.round(geometry.height)}
              </dd>
            </div>
            <div>
              <dt>Frame</dt>
              <dd>
                {frame.width} × {frame.height}
              </dd>
            </div>
            <div>
              <dt>Drag axis</dt>
              <dd>{dragAxis(geometry.dragX, geometry.dragY)}</dd>
            </div>
          </dl>

          <p className="hint">{hint(geometry.dragX || geometry.dragY, isEditing)}</p>
        </section>

        <section className="panel" aria-label="Component props">
          <fieldset>
            <legend>src</legend>
            <div className="gallery">
              {gallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === selectedId}
                  aria-label={`${item.label}, ${item.width} by ${item.height}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <img src={item.src} alt="" />
                </button>
              ))}
            </div>
            <label className="upload">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <span>{uploaded ? 'Replace your image' : 'Load your own image'}</span>
            </label>
            {uploadFailed ? (
              <p className="upload-failed" role="status">
                That file could not be read as an image.
              </p>
            ) : (
              uploaded && <p className="filename">{uploaded.label}</p>
            )}
          </fieldset>

          <fieldset>
            <legend>containerWidth, containerHeight</legend>
            <div className="frames">
              {FRAMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={frame.id === item.id}
                  onClick={() => setFrame(item)}
                >
                  <strong>{item.shape}</strong>
                  <span>
                    {item.width} × {item.height}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>isEditing</legend>
            <label className="toggle">
              <input
                type="checkbox"
                checked={isEditing}
                onChange={(event) => setIsEditing(event.target.checked)}
              />
              <span>{isEditing ? 'Draggable' : 'Locked'}</span>
            </label>
          </fieldset>

          <fieldset>
            <legend>
              zoom <span className="value">{zoom.toFixed(2)}×</span>
            </legend>
            <input
              className="slider"
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={ZOOM_STEP}
              value={zoom}
              aria-label="Zoom"
              onChange={(event) => setZoom(round(event.target.valueAsNumber))}
            />
            <div className="zoom-row">
              <span>{ZOOM_MIN}×</span>
              <button type="button" className="reset" onClick={() => setZoom(1)}>
                Reset to 1×
              </button>
              <span>{ZOOM_MAX}×</span>
            </div>
          </fieldset>
        </section>
      </main>

      <section className="code" aria-label="Generated code">
        <div className="code-head">
          <h2>The props you just set</h2>
          <button type="button" onClick={copySnippet}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre>
          <code>{snippet}</code>
        </pre>
      </section>
    </div>
  );
}

function dragAxis(dragX: boolean, dragY: boolean) {
  if (dragX && dragY) return 'Both';
  if (dragX) return 'Horizontal';
  if (dragY) return 'Vertical';
  return 'Locked';
}

function hint(draggable: boolean, isEditing: boolean) {
  if (!draggable) {
    return 'The image fits inside the frame at this zoom, so it stays centred and cannot be dragged.';
  }

  if (!isEditing) {
    return 'Edit mode is off. The frame keeps its crop, leaves the tab order, and ignores pointer and key input.';
  }

  return 'Edit mode is on. Drag the frame, or click it and use the arrow keys for 20px steps.';
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
