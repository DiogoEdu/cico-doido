export function blackTransparent(pixels: Uint8ClampedArray, width: number, height: number, threshold: number) {
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const luminance = .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
    const alpha = luminance < threshold ? pixels[i + 3] : 0;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = 0; pixels[i + 3] = alpha;
    if (alpha > 0) {left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);}
  }
  return right < 0 ? null : {left, top, width: right - left + 1, height: bottom - top + 1};
}
