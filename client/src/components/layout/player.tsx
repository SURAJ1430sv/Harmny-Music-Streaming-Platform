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
import type { Song } from "@shared/schema";

interface PlayerProps {
  currentSong?: Song;
}

export default function Player({ currentSong }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
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
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={handleProgressChange}
            disabled={!currentSong}
          />
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
      />
    </div>
  );
}