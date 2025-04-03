import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import NewsList from '@/components/NewsList';
import AddNewsForm from '@/components/AddNewsForm';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudio } from '@/context/AudioContext';
import { NewsProvider } from '@/context/NewsContext';

const NewsPageContent = () => {
  const { showMiniPlayer } = useAudio();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <header className="border-b border-player-muted py-6 mt-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center">
            <span className="text-player-accent">Harmony</span> News
          </h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="news">Đọc tin tức</TabsTrigger>
            <TabsTrigger value="add">Thêm tin tức</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-4">
            <NewsList />
          </TabsContent>
          
          <TabsContent value="add">
            <AddNewsForm />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t border-player-muted py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Cập nhật tin tức offline - Không cần kết nối internet</p>
          <p className="mt-1">
            Credit: <a href="https://www.tiktok.com/@deanqkhanh" className="text-player-accent hover:underline">@deanqkhanh</a> | 
            Source code: <a href="https://github.com/deanqkhanhcoder/music-player" className="text-player-accent hover:underline">@GitHub</a>
          </p>
        </div>
      </footer>
      
      {/* Add padding at the bottom when mini player is visible */}
      {showMiniPlayer && <div className="h-16"></div>}
    </div>
  );
};

const NewsPage = () => {
  return (
    <NewsProvider>
      <NewsPageContent />
    </NewsProvider>
  );
};

export default NewsPage; 