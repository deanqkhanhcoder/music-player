
import React, { useState, useEffect } from 'react';
import { Music, Download, Image } from 'lucide-react';
import { Track } from '@/context/AudioContext';
import { downloadArtwork } from '@/utils/audioUtils';

interface TrackArtworkProps {
  track: Track;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDownloadButton?: boolean;
}

const TrackArtwork: React.FC<TrackArtworkProps> = ({ 
  track, 
  size = 'md', 
  className = '',
  showDownloadButton = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Reset state when track changes
  useEffect(() => {
    setImageError(false);
    setIsImageLoaded(false);
  }, [track.id, track.artworkUrl]);
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.artworkUrl && !imageError) {
      downloadArtwork(track.artworkUrl, track.name);
    }
  };
  
  const handleImageError = () => {
    console.error(`Failed to load artwork image for: ${track.name}`);
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48'
  };
  
  if (!track.artworkUrl || imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl bg-player-muted/40 flex items-center justify-center ${className}`}>
        <Music size={size === 'lg' ? 64 : size === 'md' ? 32 : 16} className="text-player-muted" />
      </div>
    );
  }
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-player-muted/40 relative group ${className}`}
    >
      <img 
        src={track.artworkUrl} 
        alt={`Artwork for ${track.name}`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="animate-pulse text-player-muted" size={size === 'lg' ? 32 : size === 'md' ? 24 : 16} />
        </div>
      )}
      
      {showDownloadButton && track.artworkUrl && !imageError && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button 
            onClick={handleDownload}
            className="bg-player-accent/80 text-white p-2 rounded-full hover:bg-player-accent transition-colors"
            aria-label="Download artwork"
          >
            <Download size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackArtwork;
