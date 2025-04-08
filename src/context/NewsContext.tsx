import React, { createContext, useContext, useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
}

interface NewsContextType {
  news: NewsItem[];
  categories: string[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  deleteNews: (id: string) => void;
  getNewsByCategory: (category: string) => NewsItem[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>(() => {
    const savedNews = localStorage.getItem('offline-news');
    return savedNews ? JSON.parse(savedNews) : [];
  });

  const [categories, setCategories] = useState<string[]>([
    'Thời sự', 'Thế giới', 'Kinh tế', 'Giải trí', 'Thể thao', 'Công nghệ', 'Sức khỏe', 'Giáo dục'
  ]);

  useEffect(() => {
    localStorage.setItem('offline-news', JSON.stringify(news));
  }, [news]);

  const addNews = (newsItem: Omit<NewsItem, 'id'>) => {
    const newItem = {
      ...newsItem,
      id: Date.now().toString(),
    };
    setNews(prevNews => [newItem, ...prevNews]);
  };

  const deleteNews = (id: string) => {
    setNews(prevNews => prevNews.filter(item => item.id !== id));
  };

  const getNewsByCategory = (category: string) => {
    return news.filter(item => item.category === category);
  };

  return (
    <NewsContext.Provider value={{ news, categories, addNews, deleteNews, getNewsByCategory }}>
      {children}
    </NewsContext.Provider>
  );
}; 