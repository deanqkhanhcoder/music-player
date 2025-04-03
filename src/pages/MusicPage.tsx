import React from 'react';
import MusicPlayer from '@/components/MusicPlayer';
import ThemeToggle from '@/components/ThemeToggle';
import Navigation from '@/components/Navigation';

const MusicPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <header className="border-b border-player-muted py-6 mt-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center">
            <span className="text-player-accent">Harmony</span> Player
          </h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <MusicPlayer />
      </main>
      
      <footer className="border-t border-player-muted py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Trình phát nhạc tối giản nhưng đẹp!</p>
          <p className="mt-1">
            Credit: <a href="https://www.tiktok.com/@deanqkhanh" className="text-player-accent hover:underline">@deanqkhanh</a> | 
            Source code: <a href="https://github.com/deanqkhanhcoder/music-player" className="text-player-accent hover:underline">@GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MusicPage; 