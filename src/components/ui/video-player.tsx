import { Play, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  thumbnailUrl: string;
  videoUrl: string;
  title?: string;
  className?: string;
}

export const VideoPlayer = ({ thumbnailUrl, videoUrl, title, className = "" }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`relative rounded-sm overflow-hidden ${className}`}>
      {!isPlaying ? (
        <button
          onClick={() => setIsPlaying(true)}
          className="group relative w-full aspect-video"
          aria-label={title ? `Spill av video: ${title}` : "Spill av video"}
        >
          <img
            src={thumbnailUrl}
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-7 h-7 text-brand-dark ml-1" fill="currentColor" />
            </div>
          </div>
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-sm font-light">{title}</p>
            </div>
          )}
        </button>
      ) : (
        <div className="relative aspect-video bg-black">
          <video
            src={videoUrl}
            autoPlay
            controls
            className="w-full h-full"
            onEnded={() => setIsPlaying(false)}
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Lukk video"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

/** Lightweight embed for YouTube/Vimeo */
interface VideoEmbedProps {
  embedUrl: string;
  title?: string;
  className?: string;
}

export const VideoEmbed = ({ embedUrl, title, className = "" }: VideoEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative rounded-sm overflow-hidden aspect-video bg-secondary ${className}`}>
      {!isLoaded && (
        <button
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label={title ? `Spill av: ${title}` : "Spill av video"}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-7 h-7 text-brand-dark ml-1" fill="currentColor" />
          </div>
        </button>
      )}
      {isLoaded && (
        <iframe
          src={embedUrl}
          title={title || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
};
