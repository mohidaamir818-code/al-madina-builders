"use client";

type PropertyVideosProps = {
  videos: string[];
  title: string;
};

export function PropertyVideos({ videos, title }: PropertyVideosProps) {
  if (!videos.length) return null;

  return (
    <section className="overflow-hidden rounded border border-line bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-ink">Property Videos</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {videos.map((src, index) => (
          <video
            key={`${src.slice(-40)}-${index}`}
            src={src}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full rounded bg-black object-contain"
            aria-label={`${title} video ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
