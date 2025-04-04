import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Sidebar from "@/components/layout/sidebar";
import Player from "@/components/layout/player";
import Home from "@/pages/home";
import Library from "@/pages/library";
import Search from "@/pages/search";
import Playlist from "@/pages/playlist";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import type { Song } from "@shared/schema";

function Router() {
  const [currentSong, setCurrentSong] = useState<Song>();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-24">
        <Switch>
          <ProtectedRoute 
            path="/" 
            component={() => <Home onPlay={setCurrentSong} />} 
          />
          <ProtectedRoute 
            path="/search" 
            component={() => <Search onPlay={setCurrentSong} />} 
          />
          <ProtectedRoute 
            path="/library" 
            component={() => <Library onPlay={setCurrentSong} />} 
          />
          <ProtectedRoute 
            path="/playlist/:id" 
            component={() => {
              // Use this wrapper to get params
              const path = window.location.pathname;
              const id = path.split('/').pop() || '';
              return <Playlist id={id} onPlay={setCurrentSong} />;
            }} 
          />
          <Route path="/auth" component={AuthPage} />
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
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;