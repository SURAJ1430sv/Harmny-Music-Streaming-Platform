import { useQuery } from "@tanstack/react-query";
import type { Song, Playlist } from "@shared/schema";
import SongCard from "@/components/music/song-card";
import PlaylistCard from "@/components/music/playlist-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: songs, isLoading: songsLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  const { data: playlists, isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const handlePlaySong = (song: Song) => {
    // TODO: Implement song playback
    console.log("Playing song:", song);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    // TODO: Implement playlist playback
    console.log("Playing playlist:", playlist);
  };

  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="mb-4 text-2xl font-bold">Featured Songs</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {songsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : songs?.slice(0, 5).map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Featured Playlists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {playlistsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            : playlists?.slice(0, 5).map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={handlePlayPlaylist}
                />
              ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recently Added</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {songsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : songs?.slice(-5).map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
        </div>
      </section>
    </div>
  );
}
