
import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ className }) => {
  const { volume, setVolume } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  
  // Ensure volume is properly initialized
  useEffect(() => {
    console.log('VolumeControl initialized with volume:', volume);
    // Store initial volume for mute toggle reference
    if (volume > 0) {
      setPrevVolume(volume);
    }
  }, []);
  
  // Update prevVolume when volume changes and it's not zero
  useEffect(() => {
    if (volume > 0) {
      setPrevVolume(volume);
    }
  }, [volume]);
  
  // Get appropriate volume icon based on level
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} className="text-player-foreground/80" />;
    if (volume < 0.3) return <Volume size={18} className="text-player-foreground/80" />;
    if (volume < 0.7) return <Volume1 size={18} className="text-player-foreground/80" />;
    return <Volume2 size={18} className="text-player-foreground/80" />;
  };
  
  const getVolumeColor = () => {
    if (volume === 0) return 'bg-muted-foreground/40';
    if (volume < 0.3) return 'bg-player-accent/70';
    if (volume < 0.7) return 'bg-player-accent/85';
    return 'bg-player-accent';
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    console.log('Volume changed via slider to:', newVolume);
    setVolume(newVolume);
  };
  
  const toggleMute = () => {
    if (volume > 0) {
      // Store current volume before muting
      console.log('Muting. Current volume:', volume);
      setPrevVolume(volume);
      setVolume(0);
    } else {
      // Restore previous volume or default to 0.7
      console.log('Unmuting to previous volume:', prevVolume);
      setVolume(prevVolume || 0.7);
    }
  };
  
  return (
    <div className={cn('flex items-center space-x-2 group', className)}>
      <button 
        onClick={toggleMute}
        className="text-player-foreground/80 hover:text-player-accent transition-colors p-1 rounded-full hover:bg-player-muted/30"
        aria-label={volume === 0 ? "Unmute" : "Mute"}
      >
        <VolumeIcon />
      </button>
      
      <div 
        className="relative h-8 w-20 sm:w-28 flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Custom Volume Slider */}
        <div className="w-full h-1.5 bg-player-muted/50 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all ease-out duration-200", getVolumeColor())}
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        
        {/* Draggable Thumb */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Volume"
        />
        
        {/* Custom Thumb */}
        <div 
          className={cn(
            "absolute h-3 w-3 rounded-full bg-white shadow-sm transform -translate-y-1/2 top-1/2 pointer-events-none transition-transform duration-150",
            isDragging ? "scale-125" : "scale-100",
            isDragging ? "shadow-lg" : "shadow"
          )}
          style={{ 
            left: `calc(${volume * 100}% - ${volume * 6}px)`,
            display: volume === 0 ? 'none' : 'block'
          }}
        />
        
        {/* Volume Tooltip */}
        {(showTooltip || isDragging) && (
          <div 
            className="absolute -top-7 px-1.5 py-0.5 rounded bg-player-background/90 shadow-sm border border-player-muted/20 text-xs font-medium animate-fade-in transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${volume * 100}%` }}
          >
            {Math.round(volume * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeControl;
