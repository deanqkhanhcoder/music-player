import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import Navigation from '@/components/Navigation';
import { Music, Newspaper } from "lucide-react";
import { useAudio } from '@/context/AudioContext';

const Index = () => {
  const { showMiniPlayer } = useAudio();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <header className="border-b border-player-muted py-6 mt-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center">
            <span className="text-player-accent">Harmony</span> App
          </h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Card className="hover:border-player-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-6 w-6 text-player-accent" />
                Trình phát nhạc
              </CardTitle>
              <CardDescription>Nghe nhạc từ thư viện nhạc của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Trình phát nhạc hiện đại với giao diện tối giản, hỗ trợ tải lên và nghe nhạc yêu thích mà không cần kết nối internet.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/music">Truy cập ngay</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:border-player-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-player-accent" />
                Tin tức
              </CardTitle>
              <CardDescription>Cập nhật tin tức mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Theo dõi tin tức mới nhất về các chủ đề yêu thích của bạn, lưu trữ offline để đọc mọi lúc mọi nơi không cần internet.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/news">Truy cập ngay</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="border-t border-player-muted py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Beautiful Minimalist App, Open Source And Much More</p>
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

export default Index;
