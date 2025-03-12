import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  audioUrl: text("audio_url").notNull(),
  coverUrl: text("cover_url").notNull(),
  duration: integer("duration").notNull(),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  coverUrl: text("cover_url").notNull(),
});

export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id).notNull(),
  songId: integer("song_id").references(() => songs.id).notNull(),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertSongSchema = createInsertSchema(songs);
export const insertPlaylistSchema = createInsertSchema(playlists);
export const insertPlaylistSongSchema = createInsertSchema(playlistSongs);

export type User = typeof users.$inferSelect;
export type Song = typeof songs.$inferSelect;
export type Playlist = typeof playlists.$inferSelect;
export type PlaylistSong = typeof playlistSongs.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSong = z.infer<typeof insertSongSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;
