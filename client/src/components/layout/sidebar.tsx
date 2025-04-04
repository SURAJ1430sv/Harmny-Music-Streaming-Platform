import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Search, Library, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import type { Playlist } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const { data: playlists } = useQuery<Playlist[]>({ 
    queryKey: ["/api/playlists"]
  });

  return (
    <div className="flex h-full w-[300px] flex-col gap-y-2 bg-card p-2">
      <div className="mb-4 flex items-center px-4 py-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
          Harmny
        </h1>
      </div>
      
      <div className="space-y-2">
        <Link href="/">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "w-full justify-start gap-x-2",
              location === "/" && "bg-accent"
            )}
          >
            <Home className="h-5 w-5" />
            Home
          </Button>
        </Link>
        <Link href="/search">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "w-full justify-start gap-x-2",
              location === "/search" && "bg-accent"
            )}
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </Link>
        <Link href="/library">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "w-full justify-start gap-x-2",
              location === "/library" && "bg-accent"
            )}
          >
            <Library className="h-5 w-5" />
            Your Library
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-x-2 px-4 py-2">
          <Button size="icon" variant="secondary">
            <PlusCircle className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Create Playlist</span>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-1 p-2">
            {playlists?.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start truncate",
                    location === `/playlist/${playlist.id}` && "bg-accent"
                  )}
                >
                  {playlist.name}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
