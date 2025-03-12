import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Song, Playlist } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongCard from "@/components/music/song-card";
import PlaylistCard from "@/components/music/playlist-card";
import UploadDialog from "@/components/music/upload-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Library() {
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: songs, isLoading: songsLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  const { data: playlists, isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/playlists", {
        name,
        coverUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      setIsCreatePlaylistOpen(false);
      setNewPlaylistName("");
      toast({
        title: "Success",
        description: "Playlist created successfully",
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

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylistMutation.mutate(newPlaylistName);
    }
  };

  const handlePlaySong = (song: Song) => {
    // TODO: Implement song playback
    console.log("Playing song:", song);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex gap-2">
          <UploadDialog />
          <Dialog
            open={isCreatePlaylistOpen}
            onOpenChange={setIsCreatePlaylistOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={createPlaylistMutation.isPending}
                >
                  {createPlaylistMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="songs">
        <TabsList>
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {songsLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : songs?.map((song) => (
                  <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
                ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlistsLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))
              : playlists?.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
