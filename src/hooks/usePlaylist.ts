import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Track } from '@/types/audio';
import { parseTrackInfo, extractEmbeddedArtwork } from '@/utils/audioUtils';

export interface PlaylistState {
  tracks: Track[];
}

export interface PlaylistActions {
  addTrack: (file: File) => Promise<void>;
  removeTrack: (id: string) => void;
  reorderTracks: (startIndex: number, endIndex: number) => void;
  updateTrackMetadata: (id: string, metadata: Partial<Track>) => void;
}

export const usePlaylist = (
  onTrackRemoved?: (id: string, wasCurrentTrack: boolean) => void
): [PlaylistState, PlaylistActions] => {
  const [tracks, setTracks] = useState<Track[]>([]);
  
  // Hàm phát hiện thời lượng của file âm thanh
  const detectAudioDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      
      const handleDurationChange = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          console.log('Detected audio duration:', audio.duration);
          cleanup();
          resolve(audio.duration);
        }
      };
      
      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          console.log('Detected duration from metadata:', audio.duration);
          cleanup();
          resolve(audio.duration);
        }
      };
      
      const handleError = () => {
        console.log('Error detecting duration');
        cleanup();
        resolve(0); // Default to 0 if cannot detect
      };
      
      const cleanup = () => {
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
        audio.src = '';
      };
      
      // Thiết lập các listener events
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);
      
      // Thiết lập timeout để tránh treo
      const timeoutId = setTimeout(() => {
        console.log('Duration detection timed out');
        cleanup();
        resolve(0);
      }, 3000);
      
      // Bắt đầu tải file
      audio.src = url;
      audio.load();
    });
  };
  
  // Add a track to the playlist
  const addTrack = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an audio file",
        variant: "destructive",
      });
      return;
    }
    
    const { artist, title } = parseTrackInfo(file.name);
    
    // Check for duplicate tracks (by name and artist)
    const isDuplicate = tracks.some(track => 
      track.name.toLowerCase() === title.toLowerCase() && 
      track.artist.toLowerCase() === artist.toLowerCase()
    );
    
    if (isDuplicate) {
      toast({
        title: "Duplicate Track",
        description: `${title} by ${artist} is already in your playlist`,
        variant: "destructive",
      });
      return;
    }
    
    const url = URL.createObjectURL(file);
    
    // Extract artwork from the audio file
    console.log('Attempting to extract artwork from:', file.name);
    let artworkUrl: string | null = null;
    try {
      artworkUrl = await extractEmbeddedArtwork(file);
      console.log('Artwork extraction result:', artworkUrl ? 'Found' : 'Not found');
    } catch (error) {
      console.error('Error extracting artwork:', error);
    }
    
    // Phát hiện thời lượng từ file
    console.log('Detecting duration for:', file.name);
    const detectedDuration = await detectAudioDuration(url);
    
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: title,
      artist,
      duration: detectedDuration,
      file,
      url,
      artworkUrl
    };
    
    setTracks(prev => [...prev, newTrack]);
    
    toast({
      title: "Track Added",
      description: `${title} has been added to your playlist`,
    });
  };
  
  // Remove a track from the playlist
  const removeTrack = (id: string) => {
    const trackToRemove = tracks.find(track => track.id === id);
    
    if (!trackToRemove) return;
    
    // Clean up resources
    URL.revokeObjectURL(trackToRemove.url);
    
    if (trackToRemove.artworkUrl && trackToRemove.artworkUrl.startsWith('blob:')) {
      URL.revokeObjectURL(trackToRemove.artworkUrl);
    }
    
    // Find track index before removing
    const currentIndex = tracks.findIndex(track => track.id === id);
    const wasLastTrack = tracks.length === 1;
    
    // Update state
    setTracks(prev => prev.filter(track => track.id !== id));
    
    // Notify parent component
    if (onTrackRemoved) {
      onTrackRemoved(id, currentIndex !== -1);
    }
    
    toast({
      title: "Track Removed",
      description: `${trackToRemove.name} has been removed from your playlist`,
    });
  };
  
  // Reorder tracks in the playlist (for drag and drop functionality)
  const reorderTracks = (startIndex: number, endIndex: number) => {
    const result = Array.from(tracks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setTracks(result);
  };
  
  // Update track metadata (e.g. duration) after it's been loaded
  const updateTrackMetadata = (id: string, metadata: Partial<Track>) => {
    setTracks(prev => prev.map(track => 
      track.id === id ? { ...track, ...metadata } : track
    ));
  };
  
  return [
    { tracks },
    { addTrack, removeTrack, reorderTracks, updateTrackMetadata }
  ];
};
