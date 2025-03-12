import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/layout/sidebar";
import Player from "@/components/layout/player";
import Home from "@/pages/home";
import Library from "@/pages/library";
import Search from "@/pages/search";
import Playlist from "@/pages/playlist";
import NotFound from "@/pages/not-found";
import type { Song } from "@shared/schema";

function Router() {
  const [currentSong, setCurrentSong] = useState<Song>();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-24">
        <Switch>
          <Route path="/">
            <Home onPlay={setCurrentSong} />
          </Route>
          <Route path="/search">
            <Search onPlay={setCurrentSong} />
          </Route>
          <Route path="/library">
            <Library onPlay={setCurrentSong} />
          </Route>
          <Route path="/playlist/:id">
            {(params) => <Playlist id={params.id} onPlay={setCurrentSong} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Player currentSong={currentSong} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;