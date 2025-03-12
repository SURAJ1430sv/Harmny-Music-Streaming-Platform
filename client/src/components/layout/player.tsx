import { useState, useRef } from "react";
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

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
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

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex w-1/3 items-center gap-x-4">
          <img
            src="https://images.unsplash.com/photo-1494894194458-0174142560c0"
            alt="Album cover"
            className="h-14 w-14 rounded-md"
          />
          <div>
            <div className="font-semibold">Song Title</div>
            <div className="text-sm text-muted-foreground">Artist Name</div>
          </div>
        </div>

        <div className="flex w-1/3 flex-col items-center gap-y-2">
          <div className="flex items-center gap-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={togglePlay}
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
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={(value) => setProgress(value[0])}
          />
        </div>

        <div className="flex w-1/3 items-center justify-end gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
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
            onValueChange={(value) => {
              setVolume(value[0]);
              if (audioRef.current) {
                audioRef.current.volume = value[0] / 100;
              }
            }}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          setProgress((audio.currentTime / audio.duration) * 100);
        }}
      />
    </div>
  );
}
