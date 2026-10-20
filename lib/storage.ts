const TYPE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
};

export function buildImageFileName(file: { name: string; type?: string }): string {
  const dot = file.name.lastIndexOf('.');
  const rawExt = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : '';
  const ext =
    /^[a-z0-9]{1,5}$/.test(rawExt)
      ? rawExt
      : TYPE_EXTENSIONS[(file.type ?? '').toLowerCase()] ?? 'jpg';

  return `${crypto.randomUUID()}.${ext}`;
}
