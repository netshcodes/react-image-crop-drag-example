// A picture is a source image the frame can crop, whether it shipped with the
// page or came off the viewer's disk. The label is its name, its alt text, and
// the alt in the generated snippet, so those three can never disagree.
export type Picture = {
  id: string;
  label: string;
  src: string;
  width: number;
  height: number;
};

// A frame is the fixed box the image is cropped into. Its shape names the box,
// never the source image, so the two rows of controls share no vocabulary.
type Frame = {
  id: string;
  shape: string;
  width: number;
  height: number;
};

export const PICTURES: Picture[] = [
  { id: 'poster', label: 'Poster', src: '/samples/poster-portrait.svg', width: 900, height: 1350 },
  { id: 'coast', label: 'Coast', src: '/samples/coast-panorama.svg', width: 1800, height: 600 },
  { id: 'studio', label: 'Studio', src: '/samples/studio-square.svg', width: 1200, height: 1200 }
];

export const UPLOADED_ID = 'uploaded';

export const FRAMES: Frame[] = [
  { id: 'panorama', shape: 'Panorama', width: 720, height: 320 },
  { id: 'square', shape: 'Square', width: 360, height: 360 },
  { id: 'portrait', shape: 'Portrait', width: 320, height: 460 }
];

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 3;
export const ZOOM_STEP = 0.05;

type Fit = {
  width: number;
  height: number;
  dragX: boolean;
  dragY: boolean;
};

// Mirrors coverSize and clampAxis from the package, so the readout below the
// frame states the same rule the component enforces.
export function fit(picture: Picture, frame: Frame, zoom: number): Fit {
  const pictureRatio = picture.width / picture.height;
  const frameRatio = frame.width / frame.height;
  const cover =
    pictureRatio > frameRatio
      ? { width: frame.height * pictureRatio, height: frame.height }
      : { width: frame.width, height: frame.width / pictureRatio };

  const width = cover.width * zoom;
  const height = cover.height * zoom;

  return { width, height, dragX: width > frame.width, dragY: height > frame.height };
}
