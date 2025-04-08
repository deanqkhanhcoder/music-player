import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNews } from "@/context/NewsContext";

interface NewsItemProps {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
}

const NewsItem = ({ id, title, content, date, category, imageUrl }: NewsItemProps) => {
  const { deleteNews } = useNews();

  return (
    <Card className="mb-4 overflow-hidden">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="flex gap-2 mt-1">
              <span className="bg-player-accent/20 text-player-accent text-xs px-2 py-1 rounded-full">
                {category}
              </span>
              <span className="text-muted-foreground text-xs">{date}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm whitespace-pre-line">{content}</div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => deleteNews(id)}
        >
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsItem; 