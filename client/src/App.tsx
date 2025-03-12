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

function Router() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/library" component={Library} />
          <Route path="/playlist/:id" component={Playlist} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Player />
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
