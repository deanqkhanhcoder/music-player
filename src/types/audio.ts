export interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  duration: number;
  file: File;
  url: string;
  artworkUrl?: string | null;
}

export interface AudioContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  addTrack: (file: File) => void;
  removeTrack: (id: string) => void;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  reorderTracks: (startIndex: number, endIndex: number) => void;
  updateTrackMetadata: (id: string, metadata: Partial<Track>) => void;
}
