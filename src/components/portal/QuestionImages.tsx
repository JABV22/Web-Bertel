type Asset = { id: string; asset_url: string; alt_text: string };

export function QuestionImages({ assets }: { assets: Asset[] }) {
  const images = assets.filter(({ asset_url }) => {
    return URL.canParse(asset_url) && new URL(asset_url).protocol === "https:";
  });

  if (assets.length === 0) return null;

  return (
    <div className="my-4 grid gap-4">
      {images.length < assets.length && (
        <p role="status" className="text-sm text-gris-texto">Hay imágenes que no están disponibles.</p>
      )}
      {images.map(({ id, asset_url, alt_text }) => (
        // eslint-disable-next-line @next/next/no-img-element -- Render Storage images at their original aspect ratio.
        <img
          key={id}
          src={asset_url}
          alt={alt_text}
          className="mx-auto h-auto max-w-full"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ))}
    </div>
  );
}
