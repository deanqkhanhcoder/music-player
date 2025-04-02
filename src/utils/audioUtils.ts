
/**
 * Format seconds to mm:ss format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get a color based on audio frequency (for visualizations)
 */
export const getFrequencyColor = (frequency: number): string => {
  // Map frequency to hue (0-240 range for blue to red)
  const hue = 240 - Math.min(240, Math.max(0, frequency * 240));
  return `hsl(${hue}, 80%, 60%)`;
};

/**
 * Generate random visualizer heights for simulated visualization
 */
export const generateRandomBars = (count: number): number[] => {
  return Array.from({ length: count }, () => Math.random());
};

/**
 * Ensure a filename is safe for display
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove file extension
  let name = filename.split('.').slice(0, -1).join('.');
  
  // Remove special characters
  name = name.replace(/[^\w\s-]/g, '');
  
  // Trim whitespace
  return name.trim();
};

/**
 * Extract artist and title from filename (if in Artist - Title format)
 */
export const parseTrackInfo = (filename: string): { artist: string; title: string } => {
  // Remove extension first
  const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
  
  // Try to split by " - " (common format for music files)
  const parts = nameWithoutExt.split(' - ');
  
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim()
    };
  }
  
  // If no clear artist-title separator found
  return {
    artist: 'Unknown Artist',
    title: nameWithoutExt.trim() || 'Untitled'
  };
};

/**
 * Extract embedded artwork from audio file
 * @returns Promise that resolves to URL of extracted artwork or null if none found
 */
export const extractEmbeddedArtwork = async (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      console.log('Not an audio file, cannot extract artwork');
      resolve(null);
      return;
    }
    
    // Create an audio element to load the file
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    audio.src = url;
    
    // Try alternative method with jsmediatags for MP3 files
    if (file.type === 'audio/mp3' || file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')) {
      tryExtractWithFileReader(file)
        .then(artworkUrl => {
          if (artworkUrl) {
            console.log('Artwork extracted with FileReader method');
            URL.revokeObjectURL(url);
            resolve(artworkUrl);
          } else {
            // Continue with MediaSession method as fallback
            tryMediaSessionMethod();
          }
        })
        .catch(() => {
          // Continue with MediaSession method as fallback
          tryMediaSessionMethod();
        });
    } else {
      // For other audio formats, go directly to MediaSession method
      tryMediaSessionMethod();
    }
    
    function tryMediaSessionMethod() {
      // Try to extract metadata when loaded
      audio.onloadedmetadata = async () => {
        try {
          // Using MediaSession API to get artwork
          if ('mediaSession' in navigator) {
            audio.play().catch(() => {
              console.log('Failed to play audio temporarily for artwork extraction');
            });
            
            // Small timeout to allow media session to initialize
            setTimeout(() => {
              audio.pause();
              
              // Check if artwork is available
              if (navigator.mediaSession.metadata?.artwork?.length) {
                const artwork = navigator.mediaSession.metadata.artwork[0];
                console.log('Artwork extracted successfully with MediaSession:', artwork.src);
                resolve(artwork.src);
                URL.revokeObjectURL(url);
                return;
              }
              
              console.log('No artwork found in media session metadata');
              URL.revokeObjectURL(url);
              resolve(null);
            }, 500); // Increased timeout for metadata extraction
          } else {
            console.log('MediaSession API not available');
            URL.revokeObjectURL(url);
            resolve(null);
          }
        } catch (error) {
          console.error('Error extracting artwork:', error);
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };
      
      audio.onerror = (e) => {
        console.error('Error loading audio for artwork extraction:', e);
        URL.revokeObjectURL(url);
        resolve(null);
      };
      
      // Set a timeout to prevent hanging
      setTimeout(() => {
        console.log('Artwork extraction timed out');
        URL.revokeObjectURL(url);
        resolve(null);
      }, 5000); // Increased timeout
    }
  });
};

/**
 * Attempt to extract artwork using FileReader for MP3 files
 */
const tryExtractWithFileReader = (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    // Only process a small part of the file to get the metadata
    const fileSlice = file.slice(0, 300000); // First 300KB should contain headers with artwork
    const reader = new FileReader();
    
    reader.onload = function(e) {
      if (!e.target || !e.target.result) {
        reject(new Error("FileReader failed to read file"));
        return;
      }
      
      try {
        // Look for common JPEG/PNG headers in the file data
        const buffer = e.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(buffer);
        
        // Check for JPEG header (FF D8 FF)
        let jpegStart = findPattern(uint8Array, [0xFF, 0xD8, 0xFF]);
        if (jpegStart >= 0) {
          // Find JPEG end marker (FF D9)
          let jpegEnd = findPattern(uint8Array, [0xFF, 0xD9], jpegStart);
          if (jpegEnd >= 0) {
            const imageData = uint8Array.slice(jpegStart, jpegEnd + 2);
            const blob = new Blob([imageData], { type: 'image/jpeg' });
            resolve(URL.createObjectURL(blob));
            return;
          }
        }
        
        // Check for PNG header (89 50 4E 47 0D 0A 1A 0A)
        const pngStart = findPattern(uint8Array, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        if (pngStart >= 0) {
          // PNG processing logic (simplified - in a real app would need to find IEND chunk)
          // For simplicity, we'll just take a reasonable chunk of data after the header
          const imageData = uint8Array.slice(pngStart, pngStart + 100000); // Assuming 100KB is enough
          const blob = new Blob([imageData], { type: 'image/png' });
          resolve(URL.createObjectURL(blob));
          return;
        }
        
        // No image found
        resolve(null);
      } catch (error) {
        console.error('Error processing file data:', error);
        reject(error);
      }
    };
    
    reader.onerror = function() {
      reject(new Error("FileReader error"));
    };
    
    reader.readAsArrayBuffer(fileSlice);
  });
};

/**
 * Find a pattern of bytes in a Uint8Array
 */
const findPattern = (data: Uint8Array, pattern: number[], startOffset = 0): number => {
  outer: for (let i = startOffset; i <= data.length - pattern.length; i++) {
    for (let j = 0; j < pattern.length; j++) {
      if (data[i + j] !== pattern[j]) {
        continue outer;
      }
    }
    return i;
  }
  return -1;
};

/**
 * Download an image from a URL
 */
export const downloadArtwork = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(filename)}_artwork.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
