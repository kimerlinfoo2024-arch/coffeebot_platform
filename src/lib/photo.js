/** Session evidence photos live inline in the shared bookings row, so every browser that
    syncs downloads every photo. A phone photo is megabytes; this shrinks it to a small JPEG
    data URL and keeps shrinking until it is under MAX_PHOTO_BYTES (about 15-40 KB in
    practice, 60 KB at most). */
export const MAX_PHOTO_BYTES = 60 * 1024;

/* each pass is tried in order until the result fits: [longest side in px, JPEG quality] */
const PASSES = [[360, 0.6], [300, 0.5], [240, 0.45], [200, 0.4]];

/** decoded size of a base64 data URL in bytes */
export const photoBytes = (dataUrl) => {
  if (typeof dataUrl !== 'string') return Infinity;
  const i = dataUrl.indexOf(',');
  return i < 0 ? Infinity : Math.round(((dataUrl.length - i - 1) * 3) / 4);
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That image could not be read.')); };
    img.src = url;
  });
}

export async function shrinkPhoto(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Choose an image file.');
  const img = await loadImage(file);
  let out = '';
  for (const [maxSide, quality] of PASSES) {
    const k = Math.min(1, maxSide / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k);
    c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    out = c.toDataURL('image/jpeg', quality);
    if (photoBytes(out) <= MAX_PHOTO_BYTES) break;
  }
  if (photoBytes(out) > MAX_PHOTO_BYTES) throw new Error('That photo could not be made small enough. Try a different one.');
  return out;
}
