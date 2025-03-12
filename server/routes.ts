import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertSongSchema, insertPlaylistSchema, insertPlaylistSongSchema } from "@shared/schema";

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Songs
  app.get("/api/songs", async (_req, res) => {
    const songs = await storage.getSongs();
    res.json(songs);
  });

  app.get("/api/songs/:id", async (req, res) => {
    const song = await storage.getSong(parseInt(req.params.id));
    if (!song) {
      res.status(404).json({ message: "Song not found" });
      return;
    }
    res.json(song);
  });

  app.post("/api/songs", upload.single("audio"), async (req, res) => {
    const result = insertSongSchema.safeParse({
      ...req.body,
      audioUrl: req.file?.path,
      userId: 1, // TODO: Get from session
    });

    if (!result.success) {
      res.status(400).json({ message: "Invalid song data" });
      return;
    }

    const song = await storage.createSong(result.data);
    res.json(song);
  });

  // Playlists
  app.get("/api/playlists", async (_req, res) => {
    const playlists = await storage.getPlaylists();
    res.json(playlists);
  });

  app.get("/api/playlists/:id", async (req, res) => {
    const playlist = await storage.getPlaylist(parseInt(req.params.id));
    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }
    res.json(playlist);
  });

  app.post("/api/playlists", async (req, res) => {
    const result = insertPlaylistSchema.safeParse({
      ...req.body,
      userId: 1, // TODO: Get from session
    });

    if (!result.success) {
      res.status(400).json({ message: "Invalid playlist data" });
      return;
    }

    const playlist = await storage.createPlaylist(result.data);
    res.json(playlist);
  });

  // Playlist Songs
  app.get("/api/playlists/:id/songs", async (req, res) => {
    const songs = await storage.getPlaylistSongs(parseInt(req.params.id));
    res.json(songs);
  });

  app.post("/api/playlists/:id/songs", async (req, res) => {
    const result = insertPlaylistSongSchema.safeParse({
      playlistId: parseInt(req.params.id),
      songId: req.body.songId,
    });

    if (!result.success) {
      res.status(400).json({ message: "Invalid playlist song data" });
      return;
    }

    const playlistSong = await storage.addSongToPlaylist(result.data);
    res.json(playlistSong);
  });

  app.delete("/api/playlists/:playlistId/songs/:songId", async (req, res) => {
    await storage.removeSongFromPlaylist(
      parseInt(req.params.playlistId),
      parseInt(req.params.songId),
    );
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
