import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Playlist, Song } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlist, isLoading: playlistLoading } = useQuery<Playlist>({
    queryKey: [`/api/playlists/${id}`],
  });

  const { data: songs, isLoading: songsLoading } = useQuery<Song[]>({
    queryKey: [`/api/playlists/${id}/songs`],
  });

  const deleteSongMutation = useMutation({
    mutationFn: async (songId: number) => {
      await apiRequest(
        "DELETE",
        `/api/playlists/${id}/songs/${songId}`,
        undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/playlists/${id}/songs`],
      });
      toast({
        title: "Success",
        description: "Song removed from playlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlayPlaylist = () => {
    // TODO: Implement playlist playback
    console.log("Playing playlist:", playlist);
  };

  if (playlistLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-64 w-64" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Playlist not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-end gap-6">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="h-64 w-64 rounded-lg object-cover shadow-lg"
        />
        <div>
          <h1 className="text-5xl font-bold">{playlist.name}</h1>
          <p className="mt-4 text-muted-foreground">
            {songs?.length || 0} songs
          </p>
          <Button
            size="lg"
            className="mt-6"
            onClick={handlePlayPlaylist}
          >
            <Play className="mr-2 h-5 w-5" />
            Play
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {songsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-md p-2"
            >
              <Skeleton className="h-12 w-12" />
              <div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-4 w-32" />
              </div>
            </div>
          ))
        ) : (
          songs?.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {song.artist}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => deleteSongMutation.mutate(song.id)}
                  >
                    Remove from playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
