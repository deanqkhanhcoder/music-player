import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Music, Newspaper } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="bg-background border border-player-muted rounded-full shadow-lg p-1 flex gap-1 mt-2">
        <Button
          variant={location.pathname === '/' ? 'default' : 'ghost'}
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link to="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Trang chủ</span>
          </Link>
        </Button>
        
        <Button
          variant={location.pathname === '/music' ? 'default' : 'ghost'}
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link to="/music">
            <Music className="h-5 w-5" />
            <span className="sr-only">Nghe nhạc</span>
          </Link>
        </Button>
        
        <Button
          variant={location.pathname === '/news' ? 'default' : 'ghost'}
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link to="/news">
            <Newspaper className="h-5 w-5" />
            <span className="sr-only">Tin tức</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Navigation; 