import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { insertSongSchema, insertPlaylistSchema, insertPlaylistSongSchema } from "@shared/schema";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for different file types
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'audio' && !file.mimetype.startsWith('audio/')) {
      cb(new Error('Only audio files are allowed'));
      return;
    }
    if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  }
});

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

  app.post("/api/songs", upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.audio?.[0] || !files.cover?.[0]) {
        res.status(400).json({ message: "Both audio and cover files are required" });
        return;
      }

      const result = insertSongSchema.safeParse({
        ...req.body,
        audioUrl: files.audio[0].path,
        coverUrl: files.cover[0].path,
        userId: 1, // TODO: Get from session
        duration: 180, // TODO: Calculate actual duration
      });

      if (!result.success) {
        res.status(400).json({ message: "Invalid song data" });
        return;
      }

      const song = await storage.createSong(result.data);
      res.json(song);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Upload failed" });
    }
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