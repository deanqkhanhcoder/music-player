import React from 'react';
import { useAudio, Track } from '@/context/AudioContext';
import { Music, X, MoreHorizontal } from 'lucide-react';
import { formatTime } from '@/utils/audioUtils';
import TrackArtwork from './TrackArtwork';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface PlaylistProps {
  className?: string;
}

const Playlist: React.FC<PlaylistProps> = ({ className = '' }) => {
  const { 
    tracks, 
    currentTrack, 
    playTrack, 
    removeTrack,
    reorderTracks,
    currentTime
  } = useAudio();
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('opacity-50');
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-player-muted/30');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-player-muted/30');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-player-muted/30');
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex === dropIndex) return;
    
    reorderTracks(dragIndex, dropIndex);
  };
  
  if (tracks.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground animate-fade-in">
          Your playlist is empty. Upload some music to get started.
        </p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Playlist ({tracks.length})</h3>
      </div>
      
      <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2">
        {tracks.map((track, index) => (
          <div 
            key={track.id}
            className={`playlist-item group ${track.id === currentTrack?.id ? 'active' : ''}`}
            onClick={() => playTrack(track)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="mr-3">
              <TrackArtwork track={track} size="sm" />
            </div>
            
            <div className="flex-1 overflow-hidden mr-2">
              <p className="font-medium truncate">{track.name}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {track.id === currentTrack?.id 
                ? `${formatTime(currentTime)} / ${formatTime(track.duration)}` 
                : formatTime(track.duration)}
            </div>
            
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-1 hover:bg-player-muted rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(track.id);
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
