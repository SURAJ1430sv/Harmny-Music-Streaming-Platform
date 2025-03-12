import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Song } from "@shared/schema";
import { Input } from "@/components/ui/input";
import SongCard from "@/components/music/song-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: songs, isLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  const filteredSongs = songs?.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePlaySong = (song: Song) => {
    // TODO: Implement song playback
    console.log("Playing song:", song);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-4 text-3xl font-bold">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search for songs or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : filteredSongs?.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
      </div>

      {filteredSongs?.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          No songs found matching your search.
        </div>
      )}
    </div>
  );
}
