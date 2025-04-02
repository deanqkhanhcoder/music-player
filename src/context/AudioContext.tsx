import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import type { Track, AudioContextType } from '@/types/audio';
import { toast } from '@/components/ui/use-toast';

export type { Track };

// Create the AudioContext
const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [
    { tracks }, 
    { addTrack, removeTrack, reorderTracks, updateTrackMetadata }
  ] = usePlaylist(handleTrackRemoved);
  
  // Create a stable audio element reference that will be accessible across renders
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element only once when component mounts
  useEffect(() => {
    // Create the audio element if it doesn't exist yet
    if (!audioRef.current) {
      const audio = new Audio();
      
      // Set initial properties
      audio.volume = 0.7;
      audio.autoplay = false;
      audio.preload = "auto";
      
      // Add console logs for debugging
      console.log('Creating new Audio element with volume:', audio.volume);
      console.log('Browser supports HTMLAudioElement:', !!window.HTMLAudioElement);
      console.log('Audio element created correctly:', !!audio);
      
      // Store the element in ref
      audioRef.current = audio;
    }
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        console.log('Audio element cleanup in AudioContext');
      }
    };
  }, []);
  
  function handleTrackRemoved(id: string, wasCurrentTrack: boolean) {
    console.log('Track removed:', id, 'Was current track:', wasCurrentTrack);
    if (wasCurrentTrack) {
      const currentIndex = tracks.findIndex(track => track.id === id);
      
      if (tracks.length > 1) {
        const nextIndex = (currentIndex + 1) % tracks.length;
        const nextTrack = tracks.filter(track => track.id !== id)[
          Math.min(nextIndex, tracks.length - 2)
        ];
        
        console.log('Setting next track after removal:', nextTrack?.name);
        setCurrentTrackOverride(nextTrack);
      } else {
        console.log('No more tracks in playlist, clearing current track');
        setCurrentTrackOverride(null);
      }
    }
  }
  
  const [currentTrackOverride, setCurrentTrackOverride] = useState<Track | null>(null);
  
  // Set first track as default if no track is selected
  useEffect(() => {
    if (tracks.length > 0 && !currentTrackOverride) {
      console.log('Setting initial track to first in playlist:', tracks[0].name);
      setCurrentTrackOverride(tracks[0]);
    }
  }, [tracks, currentTrackOverride]);
  
  // Tạo một hàm riêng biệt để xử lý cập nhật metadata của track
  // mà không gây xung đột với audio playback
  const handleMetadataUpdate = (track: Track, newDuration: number) => {
    if (track && track.id && newDuration > 0 && track.duration !== newDuration) {
      console.log('Updating track duration:', track.id, newDuration);
      // Dùng setTimeout để đảm bảo không block main thread 
      // và tránh xung đột với audio processing
      setTimeout(() => {
        updateTrackMetadata(track.id, { duration: newDuration });
      }, 0);
    }
  };
  
  const handleTrackChange = (track: Track | null) => {
    // Chỉ cập nhật metadata khi track có ID và audio element đã load xong
    if (track && track.id && audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      handleMetadataUpdate(track, audioRef.current.duration);
    }
  };
  
  const [
    { currentTrack: internalCurrentTrack, isPlaying, duration, currentTime, volume },
    { playTrack: internalPlayTrack, togglePlayPause, skipToNext, skipToPrevious, seek, setVolume }
  ] = useAudioPlayback(tracks, audioRef.current, handleTrackChange);
  
  // Use the override track or fallback to internal track
  const currentTrack = currentTrackOverride || internalCurrentTrack;
  
  // Khi duration thay đổi, cập nhật metadata của currentTrack
  // Sử dụng dependency array hợp lý để tránh vòng lặp vô hạn
  useEffect(() => {
    if (currentTrack && !isNaN(duration) && duration > 0) {
      handleMetadataUpdate(currentTrack, duration);
    }
  }, [duration]); // Chỉ phụ thuộc vào duration để tránh side effects
  
  const playTrack = (track: Track) => {
    console.log('AudioContext: Playing track:', track.name);
    setCurrentTrackOverride(track);
    internalPlayTrack(track);
  };
  
  // Create context value
  const contextValue: AudioContextType = {
    tracks,
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    addTrack,
    removeTrack,
    playTrack,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    seek,
    setVolume,
    reorderTracks,
    updateTrackMetadata,
  };
  
  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
