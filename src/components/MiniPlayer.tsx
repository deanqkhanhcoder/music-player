import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/audioUtils';
import TrackArtwork from './TrackArtwork';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface MiniPlayerProps {
  className?: string;
  onClose?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ className, onClose }) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    skipToNext, 
    skipToPrevious,
    currentTime,
    duration,
    volume,
    setVolume,
    seek
  } = useAudio();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're not on the music page
  const isNotOnMusicPage = location.pathname !== '/music';
  
  if (!currentTrack) return null;
  
  const handleExpandPlayer = () => {
    navigate('/music');
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t border-player-muted py-2 px-4 z-50 animate-slide-up shadow-lg",
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        {/* Track info + artwork */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-10 h-10 flex-shrink-0">
            <TrackArtwork track={currentTrack} size="xs" />
          </div>
          <div className="min-w-0 truncate">
            <p className="font-medium text-sm truncate">{currentTrack.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Progress and controls - hidden on smaller screens */}
        <div className="flex-1 hidden sm:flex flex-col gap-1 max-w-xs">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(values) => seek(values[0])}
            className="cursor-pointer"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={skipToPrevious}
          >
            <SkipBack size={16} />
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={skipToNext}
          >
            <SkipForward size={16} />
          </Button>
        </div>

        {/* Volume - only on larger screens */}
        <div className="hidden md:flex items-center gap-2 w-28">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(values) => setVolume(values[0] / 100)}
            className="cursor-pointer"
          />
        </div>
        
        {/* Expand button - only when not on music page */}
        {isNotOnMusicPage && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground"
            onClick={handleExpandPlayer}
            title="Mở trình phát nhạc đầy đủ"
          >
            <Maximize2 size={16} />
          </Button>
        )}

        {/* Close button - only shown when onClose provided */}
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MiniPlayer; 