import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Track } from '@/types/audio';

export interface AudioPlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
}

export interface AudioPlaybackActions {
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

export const useAudioPlayback = (
  tracks: Track[],
  audioElement: HTMLAudioElement | null,
  onTrackChange?: (track: Track | null) => void
): [AudioPlaybackState, AudioPlaybackActions] => {
  // State management
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  
  // Tránh race condition với hành động play
  const isPlayRequestPending = useRef(false);
  
  // Local audio reference in case an external one isn't provided
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Helper function to get the audio element (either passed in or local)
  const getAudio = (): HTMLAudioElement => {
    if (audioElement) return audioElement;
    
    if (!localAudioRef.current) {
      console.log('Creating local audio element in useAudioPlayback');
      localAudioRef.current = new Audio();
      localAudioRef.current.volume = volume;
    }
    
    return localAudioRef.current;
  };
  
  // Helper function to attempt playback with retry mechanism
  const tryPlayWithRetry = (attempts = 3, delay = 200) => {
    if (!currentTrack) return;
    
    // Nếu đã có yêu cầu phát đang chờ, không cần tạo thêm
    if (isPlayRequestPending.current) {
      console.log('Play request already pending, skipping duplicate request');
      return;
    }
    
    // Đánh dấu là đang có yêu cầu phát
    isPlayRequestPending.current = true;
    
    const audio = getAudio();
    setIsLoading(true);
    
    // Thêm kiểm tra để đảm bảo audio có URL
    if (!audio.src || audio.src !== currentTrack.url) {
      console.log('Audio src missing or mismatch, setting to current track URL', currentTrack.url);
      audio.src = currentTrack.url;
      audio.load();
    }
    
    const tryPlay = async (remainingAttempts: number) => {
      try {
        console.log(`Play attempt ${4 - remainingAttempts} for track: ${currentTrack.name}`);
        
        audio.muted = false;
        audio.volume = volume > 0 ? volume : 0.7;
        
        // Cố gắng phát ngay lập tức
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setIsLoading(false);
          isPlayRequestPending.current = false;
          console.log('Successfully playing track:', currentTrack.name);
        } else {
          console.log('Play did not return a promise, assuming success');
          setIsLoading(false);
          isPlayRequestPending.current = false;
        }
      } catch (err) {
        console.error('Error playing track:', err);
        
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.log('Play was aborted, likely due to another track being selected');
          isPlayRequestPending.current = false;
          return;
        }
        
        if (remainingAttempts > 1) {
          console.log(`Retrying playback in ${delay}ms, ${remainingAttempts-1} attempts left`);
          
          // Neu audio chưa sẵn sàng, thử load lại và đợi một chút
          if (audio.readyState < 2) {
            console.log('Audio not ready yet, reloading...');
            audio.load();
            
            // Đặt sự kiện canplay để tự động phát khi đã sẵn sàng
            const canPlayHandler = () => {
              audio.removeEventListener('canplay', canPlayHandler);
              if (isPlaying) {
                audio.play().catch(() => {
                  console.log('Still failed to play after canplay event');
                  setTimeout(() => {
                    tryPlay(remainingAttempts - 1);
                  }, delay);
                });
              }
            };
            
            audio.addEventListener('canplay', canPlayHandler);
          } else {
            // Nếu audio đã sẵn sàng, thử lại sau delay
            setTimeout(() => {
              if (isPlaying) {
                tryPlay(remainingAttempts - 1);
              } else {
                isPlayRequestPending.current = false;
              }
            }, delay);
          }
        } else {
          setIsPlaying(false);
          setIsLoading(false);
          isPlayRequestPending.current = false;
          
          toast({
            title: "Playback Error",
            description: "Unable to play this track. Please try another track or check your browser settings.",
            variant: "destructive",
          });
        }
      }
    };
    
    tryPlay(attempts);
  };
  
  // Define all functions upfront before they're used
  
  // Function to play a specific track
  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(true);
      return;
    }
    
    console.log('Playing new track:', track.name);
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Function to toggle play/pause
  const togglePlayPause = () => {
    const audio = getAudio();
    
    if (currentTrack) {
      console.log('Toggling play/pause, current state:', isPlaying);
      
      if (!isPlaying) {
        // Khi chuyển từ pause sang play
        setIsPlaying(true);
        
        // Nếu đã pause và vẫn ở giây 0, thử phát ngay lập tức
        if (audio.paused && audio.currentTime === 0) {
          // Đặt timeout để đảm bảo state isPlaying đã được cập nhật
          setTimeout(() => {
            tryPlayWithRetry();
          }, 10);
        }
      } else {
        // Khi chuyển từ play sang pause
        setIsPlaying(false);
        if (!audio.paused) {
          audio.pause();
        }
      }
    } else if (tracks.length > 0) {
      console.log('No current track, starting with first track');
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };
  
  // Function to skip to the next track
  const skipToNext = () => {
    if (tracks.length <= 1 || !currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    console.log(`Skipping to next track (${nextIndex}): ${tracks[nextIndex].name}`);
    setCurrentTrack(tracks[nextIndex]);
  };
  
  // Function to skip to the previous track or restart current track
  const skipToPrevious = () => {
    if (tracks.length <= 1 || !currentTrack) return;
    
    const audio = getAudio();
    if (audio.currentTime > 3) {
      console.log('Restarting current track');
      audio.currentTime = 0;
      return;
    }
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    console.log(`Skipping to previous track (${prevIndex}): ${tracks[prevIndex].name}`);
    setCurrentTrack(tracks[prevIndex]);
  };
  
  // Function to seek to a specific time
  const seek = (time: number) => {
    const audio = getAudio();
    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0));
    console.log('Seeking to time:', clampedTime);
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };
  
  // Function to set the volume
  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    console.log('Setting volume to:', clampedVolume);
    setVolumeState(clampedVolume);
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current.src = '';
      }
    };
  }, []);
  
  // Audio event listeners setup
  useEffect(() => {
    const audio = getAudio();
    
    audio.volume = volume;
    audio.muted = false;
    
    console.log('Setting up audio element with volume:', volume);
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      const newDuration = audio.duration || 0;
      if (!isNaN(newDuration) && newDuration > 0) {
        console.log('Duration changed:', newDuration);
        setDuration(newDuration);
        
        // Nếu có track hiện tại và callback, thông báo thay đổi
        if (currentTrack && onTrackChange) {
          onTrackChange(currentTrack);
        }
      }
    };
    
    const handleEnded = () => {
      console.log('Audio ended, skipping to next track');
      skipToNext();
    };
    
    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        
        // Nếu có track hiện tại và callback, thông báo thay đổi
        if (currentTrack && onTrackChange) {
          onTrackChange(currentTrack);
        }
      }
      
      // Nếu đang ở trạng thái play nhưng audio vẫn paused, thử phát lại
      if (isPlaying && audio.paused && currentTrack) {
        console.log('Loaded metadata but still paused, attempting to play');
        tryPlayWithRetry();
      }
    };
    
    const handleCanPlay = () => {
      console.log('Audio can play now');
      setIsLoading(false);
      
      // Cập nhật duration nếu có thể
      if (!isNaN(audio.duration) && audio.duration > 0 && audio.duration !== duration) {
        setDuration(audio.duration);
        // Nếu có track hiện tại và callback, thông báo thay đổi
        if (currentTrack && onTrackChange) {
          onTrackChange(currentTrack);
        }
      }
      
      if (isPlaying && audio.paused) {
        console.log('Auto-playing after canplay event');
        tryPlayWithRetry();
      }
    };
    
    const handlePlay = () => {
      console.log('Audio started playing');
      isPlayRequestPending.current = false;
    };
    
    const handlePause = () => {
      console.log('Audio paused');
      isPlayRequestPending.current = false;
    };
    
    const handleError = (e: Event) => {
      console.error('Audio element error:', e);
      isPlayRequestPending.current = false;
      toast({
        title: "Playback Error",
        description: "There was an error with audio playback. Please try again.",
        variant: "destructive",
      });
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    
    console.log('Audio element setup complete', 
      'Can play:', !audio.paused, 
      'Muted:', audio.muted, 
      'Volume:', audio.volume,
      'Current time:', audio.currentTime,
      'Duration:', audio.duration
    );
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [audioElement, volume, skipToNext, currentTrack, onTrackChange, duration, isPlaying]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (currentTrack) {
      const audio = getAudio();
      
      if (isPlaying && audio.paused) {
        console.log('Effect: Attempting to play track:', currentTrack.name);
        // Nếu audio đã loaded (readyState >= 2) thì phát ngay
        if (audio.readyState >= 2) {
          tryPlayWithRetry();
        } else {
          // Nếu chưa thì load trước
          audio.load();
          // Listener này sẽ tự động xóa sau khi gọi một lần
          const onCanPlayHandler = () => {
            audio.removeEventListener('canplay', onCanPlayHandler);
            if (isPlaying) {
              tryPlayWithRetry();
            }
          };
          audio.addEventListener('canplay', onCanPlayHandler);
        }
      } else if (!isPlaying && !audio.paused) {
        console.log('Effect: Pausing audio');
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack]);
  
  // Handle track changes
  useEffect(() => {
    if (!currentTrack) return;
    
    const audio = getAudio();
    setIsLoading(true);
    
    console.log('Loading track:', currentTrack.name);
    
    // Reset pending play request flag when changing tracks
    isPlayRequestPending.current = false;
    
    // Đảm bảo audio đã dừng trước khi thay đổi source
    audio.pause();
    setCurrentTime(0);
    
    // Đặt src và load ngay lập tức
    audio.src = currentTrack.url;
    audio.muted = false; 
    audio.volume = volume;
    console.log('Loading audio from URL:', currentTrack.url);
    
    // Thêm kiểm tra xem URL có hợp lệ không
    if (!audio.src || audio.src === '') {
      console.error('Invalid audio URL for track:', currentTrack.name);
      setIsLoading(false);
      setIsPlaying(false);
      return;
    }
    
    // Kích hoạt quá trình load
    try {
      audio.load();
      
      // Thông báo track đã thay đổi
      if (onTrackChange) onTrackChange(currentTrack);
      
      // Nếu đang ở trạng thái play, phát bài hát sau khi load
      if (isPlaying) {
        // Thay vì dùng setTimeout, hãy dùng sự kiện canplaythrough để phát khi đã có đủ dữ liệu
        const onCanPlayThroughHandler = () => {
          audio.removeEventListener('canplaythrough', onCanPlayThroughHandler);
          if (isPlaying) {
            tryPlayWithRetry();
          }
        };
        
        // Nếu audio đã sẵn sàng, phát ngay
        if (audio.readyState >= 3) {
          tryPlayWithRetry();
        } else {
          // Nếu chưa, đợi sự kiện canplaythrough
          audio.addEventListener('canplaythrough', onCanPlayThroughHandler);
          
          // Đặt timeout phòng trường hợp sự kiện không được kích hoạt
          setTimeout(() => {
            if (isPlaying && audio.paused) {
              tryPlayWithRetry();
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      setIsPlaying(false);
      isPlayRequestPending.current = false;
    }
  }, [currentTrack]);
  
  // Handle volume changes
  useEffect(() => {
    const audio = getAudio();
    console.log('Setting volume to:', volume);
    audio.volume = volume;
    audio.muted = volume === 0;
  }, [volume]);
  
  return [
    { currentTrack, isPlaying, duration, currentTime, volume },
    { playTrack, togglePlayPause, skipToNext, skipToPrevious, seek, setVolume }
  ];
};
