import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface GalleryPhoto {
  alt: string;
  caption: string;
  thumb: { src: string; width: number; height: number };
  full: { src: string; width: number; height: number };
}

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
}

const SWIPE_THRESHOLD = 50;

const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const [current, setCurrent] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = photos.length;
  const isOpen = current !== null;

  const goTo = useCallback(
    (index: number) => {
      setLoaded(false);
      setCurrent(((index % total) + total) % total);
    },
    [total]
  );

  const open = (index: number) => {
    trackEvent("gallery_open", { photo: index + 1 });
    goTo(index);
  };

  // Arrow-key navigation while the popup is open (Escape is handled by the dialog).
  useEffect(() => {
    if (current === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(current + 1);
      else if (event.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, goTo]);

  // Warm the cache for the neighbours so next/previous feel instant.
  useEffect(() => {
    if (current === null) return;
    [current + 1, current - 1].forEach((i) => {
      const img = new Image();
      img.src = photos[((i % total) + total) % total].full.src;
    });
  }, [current, photos, total]);

  const photo = current !== null ? photos[current] : null;

  return (
    <>
      <ul className="columns-2 sm:columns-3 lg:columns-4 gap-3 [&>li]:mb-3">
        {photos.map((p, i) => (
          <li key={p.thumb.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open photo ${i + 1} of ${total}: ${p.alt}`}
              className="group block w-full overflow-hidden rounded-md bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <img
                src={p.thumb.src}
                alt={p.alt}
                width={p.thumb.width}
                height={p.thumb.height}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && setCurrent(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-[60] flex flex-col focus:outline-none"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null || current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) > SWIPE_THRESHOLD) goTo(current + (delta < 0 ? 1 : -1));
            }}
          >
            <Dialog.Title className="sr-only">Photo gallery</Dialog.Title>

            <div className="flex items-center justify-between px-4 py-3 text-white/90">
              <p className="font-body text-sm tabular-nums" aria-live="polite">
                {current !== null ? current + 1 : 0}/{total}
              </p>
              <Dialog.Close
                aria-label="Close gallery"
                className="rounded-full p-2 text-white/90 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-6 w-6" />
              </Dialog.Close>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
              <button
                type="button"
                onClick={() => current !== null && goTo(current - 1)}
                aria-label="Previous photo"
                className="absolute left-1 sm:left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>

              {photo && (
                <img
                  key={photo.full.src}
                  src={photo.full.src}
                  alt={photo.alt}
                  width={photo.full.width}
                  height={photo.full.height}
                  onLoad={() => setLoaded(true)}
                  className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}

              <button
                type="button"
                onClick={() => current !== null && goTo(current + 1)}
                aria-label="Next photo"
                className="absolute right-1 sm:right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            </div>

            <p className="min-h-[4.5rem] px-6 py-4 text-center font-body text-sm sm:text-base leading-relaxed text-white/90 max-w-3xl mx-auto">
              {photo?.caption}
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default PhotoGallery;
