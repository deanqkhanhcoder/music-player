
import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { formatTime } from '@/utils/audioUtils';
import { Slider } from '@/components/ui/slider';

interface ProgressBarProps {
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className }) => {
  const { currentTime, duration, seek } = useAudio();
  const [internalValue, setInternalValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate progress percentage for slider
  const progressPercentage = duration > 0 
    ? (currentTime / duration) * 100 
    : 0;
  
  // Update internal value when not dragging
  useEffect(() => {
    if (!isDragging) {
      setInternalValue(progressPercentage);
    }
  }, [progressPercentage, isDragging]);
  
  const handleSeek = (value: number[]) => {
    setInternalValue(value[0]);
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="relative">
        <Slider
          value={[internalValue]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          onValueCommit={handleDragEnd}
          onPointerDown={handleDragStart}
          className="cursor-pointer"
          aria-label="Seek"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
