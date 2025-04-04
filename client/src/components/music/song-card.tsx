import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Song } from "@shared/schema";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

export default function SongCard({ song, onPlay }: SongCardProps) {
  const handlePlayClick = () => {
    console.log('Playing song:', song);
    onPlay(song);
  };

  return (
    <Card className="group relative overflow-hidden transition-colors hover:bg-accent">
      <CardContent className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
            onClick={handlePlayClick}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-4">
          <div className="font-semibold">{song.title}</div>
          <div className="text-sm text-muted-foreground">{song.artist}</div>
        </div>
      </CardContent>
    </Card>
  );
}
