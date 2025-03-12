import {
  type User,
  type InsertUser,
  type Song,
  type InsertSong,
  type Playlist,
  type InsertPlaylist,
  type PlaylistSong,
  type InsertPlaylistSong,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Songs
  getSong(id: number): Promise<Song | undefined>;
  getSongs(): Promise<Song[]>;
  getSongsByUser(userId: number): Promise<Song[]>;
  createSong(song: InsertSong): Promise<Song>;
  deleteSong(id: number): Promise<void>;

  // Playlists
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylists(): Promise<Playlist[]>;
  getPlaylistsByUser(userId: number): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  deletePlaylist(id: number): Promise<void>;

  // Playlist Songs
  getPlaylistSongs(playlistId: number): Promise<Song[]>;
  addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong>;
  removeSongFromPlaylist(playlistId: number, songId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  private playlists: Map<number, Playlist>;
  private playlistSongs: Map<number, PlaylistSong>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.songs = new Map();
    this.playlists = new Map();
    this.playlistSongs = new Map();
    this.currentId = {
      users: 1,
      songs: 1,
      playlists: 1,
      playlistSongs: 1,
    };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Songs
  async getSong(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async getSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async getSongsByUser(userId: number): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(
      (song) => song.userId === userId,
    );
  }

  async createSong(song: InsertSong): Promise<Song> {
    const id = this.currentId.songs++;
    const newSong = { ...song, id };
    this.songs.set(id, newSong);
    return newSong;
  }

  async deleteSong(id: number): Promise<void> {
    this.songs.delete(id);
  }

  // Playlists
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async getPlaylistsByUser(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId,
    );
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentId.playlists++;
    const newPlaylist = { ...playlist, id };
    this.playlists.set(id, newPlaylist);
    return newPlaylist;
  }

  async deletePlaylist(id: number): Promise<void> {
    this.playlists.delete(id);
  }

  // Playlist Songs
  async getPlaylistSongs(playlistId: number): Promise<Song[]> {
    const playlistSongEntries = Array.from(this.playlistSongs.values()).filter(
      (ps) => ps.playlistId === playlistId,
    );
    return playlistSongEntries.map((ps) => this.songs.get(ps.songId)!);
  }

  async addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong> {
    const id = this.currentId.playlistSongs++;
    const newPlaylistSong = { ...playlistSong, id };
    this.playlistSongs.set(id, newPlaylistSong);
    return newPlaylistSong;
  }

  async removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
    const playlistSongEntry = Array.from(this.playlistSongs.values()).find(
      (ps) => ps.playlistId === playlistId && ps.songId === songId,
    );
    if (playlistSongEntry) {
      this.playlistSongs.delete(playlistSongEntry.id);
    }
  }
}

export const storage = new MemStorage();
