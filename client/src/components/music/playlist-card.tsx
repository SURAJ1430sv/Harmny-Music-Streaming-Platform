import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Playlist } from "@shared/schema";
import { Link } from "wouter";

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: (playlist: Playlist) => void;
}

export default function PlaylistCard({ playlist, onPlay }: PlaylistCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-colors hover:bg-accent">
      <Link href={`/playlist/${playlist.id}`}>
        <CardContent className="p-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="object-cover transition-transform group-hover:scale-105"
            />
            {onPlay && (
              <Button
                size="icon"
                className="absolute bottom-2 right-2 translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  onPlay(playlist);
                }}
              >
                <Play className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="mt-4">
            <div className="font-semibold">{playlist.name}</div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
