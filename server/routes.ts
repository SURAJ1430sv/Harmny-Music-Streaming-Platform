import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { insertSongSchema, insertPlaylistSchema, insertPlaylistSongSchema } from "@shared/schema";
import express from 'express';
import { setupAuth } from "./auth";

// Multer types for file upload
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for different file types
const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
      cb(null, uploadsDir);
    },
    filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: function (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
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
  // Set up authentication
  setupAuth(app);
  
  // Serve uploaded files with proper MIME types
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadsDir, path.basename(req.path));
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next();
    }
    
    const ext = path.extname(filePath).toLowerCase();
    
    // Set specific content types for audio files to ensure proper playback
    if (ext === '.mp3') {
      res.setHeader('Content-Type', 'audio/mpeg');
    } else if (ext === '.wav') {
      res.setHeader('Content-Type', 'audio/wav');
    } else if (ext === '.ogg') {
      res.setHeader('Content-Type', 'audio/ogg');
    } else if (ext === '.m4a') {
      res.setHeader('Content-Type', 'audio/mp4');
    }
    
    // Serve the file
    res.sendFile(filePath);
  });
  
  // Serve static assets from client/public directory
  const publicDir = path.join(process.cwd(), "client", "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  // Songs
  app.get("/api/songs", async (_req, res) => {
    const songs = await storage.getSongs();
    console.log('Fetched songs:', songs); // Add logging
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
      console.log('Received files:', req.files);
      console.log('Received body:', req.body);

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.audio?.[0] || !files.cover?.[0]) {
        console.error('Missing required files:', { 
          audio: !!files.audio, 
          cover: !!files.cover 
        });
        res.status(400).json({ message: "Both audio and cover files are required" });
        return;
      }

      // Make sure the URLs are correct absolute paths from server root
      const audioUrl = '/uploads/' + path.basename(files.audio[0].path);
      const coverUrl = '/uploads/' + path.basename(files.cover[0].path);
      
      console.log('Audio URL:', audioUrl);
      console.log('Cover URL:', coverUrl);
      
      const result = insertSongSchema.safeParse({
        ...req.body,
        audioUrl,
        coverUrl,
        userId: req.user?.id || 1, // Get user from session or use default
        duration: 180, // TODO: Calculate actual duration
      });

      if (!result.success) {
        console.error('Validation error:', result.error);
        res.status(400).json({ message: "Invalid song data", errors: result.error.errors });
        return;
      }

      const song = await storage.createSong(result.data);
      console.log('Created song:', song); // Add logging
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
      userId: req.user?.id || 1, // Get user from session or use default
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