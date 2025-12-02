export function computeUVScaleForCover(
  imgW: number,
  imgH: number,
  viewW: number,
  viewH: number
): { x: number; y: number } {
  const sX = viewW / imgW;
  const sY = viewH / imgH;
  const cover = Math.max(sX, sY); // scale factor to make image cover viewport
  return { x: sX / cover, y: sY / cover }; // values in (0,1] (1 means full)
}
