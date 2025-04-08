import { useState } from "react";
import { useNews } from "@/context/NewsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const AddNewsForm = () => {
  const { categories, addNews } = useNews();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) return;
    
    addNews({
      title,
      content,
      category,
      date: format(new Date(), "dd/MM/yyyy"),
      imageUrl: imageUrl || undefined,
    });
    
    // Reset form
    setTitle("");
    setContent("");
    setCategory("");
    setImageUrl("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm tin tức mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tin tức"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Chuyên mục</Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung tin tức"
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Hình ảnh (tùy chọn)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập đường dẫn hình ảnh"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Thêm tin tức
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNewsForm; 