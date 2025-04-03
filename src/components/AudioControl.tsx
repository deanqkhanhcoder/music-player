import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioControlProps {
  className?: string;
}

const AudioControl: React.FC<AudioControlProps> = ({ className = '' }) => {
  const { 
    isPlaying, 
    togglePlayPause, 
    skipToNext, 
    skipToPrevious,
    currentTrack,
    tracks
  } = useAudio();
  
  // Determine if controls should be disabled
  const noTracks = tracks.length === 0;
  const noCurrentTrack = currentTrack === null;
  const disableControls = noTracks || noCurrentTrack;
  
  // Xử lý việc play/pause với priority cao hơn
  const handlePlayPause = (e: React.MouseEvent) => {
    // Ngăn bubbling để tránh các xử lý không mong muốn
    e.stopPropagation();
    e.preventDefault();
    
    if (!disableControls) {
      // Gọi hàm togglePlayPause từ context
      togglePlayPause();
      
      // Nếu là nút play và có track, focus vào nút để xem có phản hồi tốt hơn không
      if (!isPlaying && currentTrack) {
        (e.currentTarget as HTMLButtonElement).focus();
      }
    }
  };
  
  return (
    <div className={`player-controls flex items-center justify-center gap-2 ${className}`}>
      <button 
        onClick={skipToPrevious}
        disabled={disableControls}
        className={`p-2 rounded-full hover:bg-player-muted/30 transition-colors ${disableControls ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Previous track"
      >
        <SkipBack size={20} />
      </button>
      
      <button 
        onClick={handlePlayPause}
        disabled={disableControls}
        className={`p-2.5 rounded-full bg-player-accent text-white hover:bg-player-accent/90 transition-colors ${disableControls ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
      </button>
      
      <button 
        onClick={skipToNext}
        disabled={disableControls}
        className={`p-2 rounded-full hover:bg-player-muted/30 transition-colors ${disableControls ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Next track"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
};

export default AudioControl;
