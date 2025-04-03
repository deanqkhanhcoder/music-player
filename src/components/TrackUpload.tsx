
import React, { useRef, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Upload, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TrackUploadProps {
  className?: string;
  variant?: 'button' | 'drop-zone';
}

const TrackUpload: React.FC<TrackUploadProps> = ({ 
  className = '',
  variant = 'button'
}) => {
  const { addTrack } = useAudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each selected file
    Array.from(files).forEach(file => {
      addTrack(file);
    });
    
    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    let validFiles = 0;
    
    // Process each dropped file
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        addTrack(file);
        validFiles++;
      }
    });
    
    if (validFiles === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload audio files only",
        variant: "destructive",
      });
    }
  };
  
  // Hidden file input
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="audio/*"
      multiple
      onChange={handleFileSelect}
      className="hidden"
    />
  );
  
  // Button variant
  if (variant === 'button') {
    return (
      <div className={className}>
        {fileInput}
        <button
          onClick={handleButtonClick}
          className="flex items-center space-x-2 px-4 py-2 bg-player-accent text-white rounded-md hover:bg-player-accent/90 transition-all animate-fade-in"
          aria-label="Upload music"
        >
          <Upload size={16} />
          <span>Upload Music</span>
        </button>
      </div>
    );
  }
  
  // Drop zone variant
  return (
    <div className={className}>
      {fileInput}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging 
            ? 'border-player-accent bg-player-accent/5' 
            : 'border-player-muted hover:border-player-accent/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-player-muted flex items-center justify-center text-muted-foreground">
            <Plus size={24} />
          </div>
          <div>
            <p className="font-medium">Drop audio files here</p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse your files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackUpload;
