import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Song } from "@shared/schema";

interface PlayerProps {
  currentSong?: Song;
}

export default function Player({ currentSong }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Update audio source when song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log('Setting audio source:', currentSong.audioUrl);
      audioRef.current.src = currentSong.audioUrl;
      
      // Reset progress
      setProgress(0);
      
      // Auto-play new song if isPlaying is true
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Audio playback error:', error);
          toast({
            title: "Playback Error",
            description: "Failed to play the audio file",
            variant: "destructive",
          });
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);
  
  // Handle isPlaying state changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('Audio playback error:', error);
        toast({
          title: "Playback Error",
          description: "Failed to play the audio file",
          variant: "destructive",
        });
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume === 0) {
        setVolume(100);
        audioRef.current.volume = 1;
      } else {
        setVolume(0);
        audioRef.current.volume = 0;
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    if (audioRef.current) {
      const time = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
    }
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Current time and total duration
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Update time on timeupdate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex w-1/3 items-center gap-x-4">
          {currentSong && (
            <>
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="h-14 w-14 rounded-md object-cover"
              />
              <div>
                <div className="font-semibold">{currentSong.title}</div>
                <div className="text-sm text-muted-foreground">{currentSong.artist}</div>
              </div>
            </>
          )}
        </div>

        <div className="flex w-1/3 flex-col items-center gap-y-2">
          <div className="flex items-center gap-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!currentSong}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!currentSong}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex w-full items-center gap-x-2">
            <div className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[progress]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={handleProgressChange}
              disabled={!currentSong}
            />
            <div className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </div>
          </div>
        </div>

        <div className="flex w-1/3 items-center justify-end gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
            disabled={!currentSong}
          >
            {volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-24"
            onValueChange={handleVolumeChange}
            disabled={!currentSong}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          toast({
            title: "Playback Error",
            description: "Failed to play the audio file",
            variant: "destructive",
          });
        }}
      />
    </div>
  );
}