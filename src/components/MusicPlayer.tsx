
import React, { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import AudioControl from './AudioControl';
import Playlist from './Playlist';
import TrackUpload from './TrackUpload';
import TrackArtwork from './TrackArtwork';
import { Music } from 'lucide-react';
import { generateRandomBars } from '@/utils/audioUtils';
import { useTheme } from '@/context/ThemeContext';

const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying } = useAudio();
  const { theme } = useTheme();
  const [visualizerBars, setVisualizerBars] = useState<number[]>([]);
  
  // Generate random visualizer heights for animation effect when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVisualizerBars(generateRandomBars(9));
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setVisualizerBars(Array(9).fill(0.1));
    }
  }, [isPlaying]);
  
  return (
    <div className="music-player-container">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Main player section */}
        <div className="md:col-span-3 space-y-6">
          {/* Album art / track info */}
          <div className="text-center">
            {currentTrack ? (
              <>
                <div className="mb-4 relative w-48 h-48 mx-auto">
                  <TrackArtwork 
                    track={currentTrack} 
                    size="lg" 
                    className="mx-auto"
                    showDownloadButton={true}
                  />
                  
                  {isPlaying && (
                    <div className="absolute bottom-4 left-0 right-0">
                      <div className="visualizer-container">
                        {visualizerBars.map((height, i) => (
                          <div 
                            key={i}
                            className="visualizer-bar"
                            style={{ 
                              height: `${Math.max(5, height * 20)}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="track-info animate-slide-up">
                  <h2 className="track-title">{currentTrack.name}</h2>
                  <p className="track-artist">{currentTrack.artist}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-32 h-32 rounded-full bg-player-muted/40 flex items-center justify-center mb-4">
                  <Music size={48} className="text-player-muted animate-pulse-slow" />
                </div>
                <p className="text-lg font-medium">No track selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload some music to get started
                </p>
              </div>
            )}
          </div>
          
          {/* Controls and progress */}
          <div className="space-y-4">
            <ProgressBar />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <AudioControl />
              <VolumeControl />
            </div>
          </div>
          
          {/* Upload button (only visible on mobile) */}
          <div className="block md:hidden">
            <TrackUpload variant="button" className="w-full" />
          </div>
        </div>
        
        {/* Playlist section */}
        <div className="md:col-span-2 space-y-4">
          <Playlist />
          
          {/* Upload section - hidden on mobile, shown at bottom */}
          <div className="hidden md:block pt-4">
            <TrackUpload variant="drop-zone" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
