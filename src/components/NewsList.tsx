import { useState } from "react";
import { useNews } from "@/context/NewsContext";
import NewsItem from "./NewsItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewsList = () => {
  const { news, categories, getNewsByCategory } = useNews();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredNews = selectedCategory 
    ? getNewsByCategory(selectedCategory)
    : news;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tin tức mới nhất</h2>
        <Select
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          defaultValue="all"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn chuyên mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredNews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Chưa có tin tức nào</p>
        </div>
      ) : (
        filteredNews.map((item) => (
          <NewsItem
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            date={item.date}
            category={item.category}
            imageUrl={item.imageUrl}
          />
        ))
      )}
    </div>
  );
};

export default NewsList; 