import { useRef, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { PlayCircle, PauseCircle } from "lucide-react";

export interface AudioPlayerProps {
  audio: string;
  autoPlay?: boolean;
}
/**
 * AudioPlayer component for playing audio with playback controls and a slider for tracking progress.
 * @param {Object} props - Component props.
 * @param {string} props.audio - The URL of the audio file to be played.
 * @param {boolean} [props.autoPlay] - Indicates whether the audio should automatically start playing when loaded. Default is false.
 * @returns {JSX.Element} The rendered AudioPlayer component.
 */
const AudioPlayer = ({ audio, autoPlay }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    /**
     * Updates the playback state based on the audio element's play/pause events.
     */
    const updateIsPlaying = () => {
      if (audioRef.current) {
        setIsPlaying(!audioRef.current.paused);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("play", updateIsPlaying);
      audioRef.current.addEventListener("pause", updateIsPlaying);
    }

    /**
     * Updates the current time and duration of the audio.
     */
    const updateSlider = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
      }
    };

    /**
     * Updates the duration of the audio when loaded.
     */
    const updateDuration = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", updateDuration);
      audioRef.current.addEventListener("timeupdate", updateSlider);
    }

    /**
     * Cleanup function to remove event listeners.
     */
    const cleanup = () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", updateDuration);
        audioRef.current.removeEventListener("timeupdate", updateSlider);
      }
    };

    return cleanup;
  }, []);

  /**
   * Toggles between play and pause states of the audio.
   */
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

  /**
   * Handles the change in slider value to seek the audio.
   * @param {number[]} value - The value of the slider (current time).
   */
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  /**
   * Formats the time in seconds to display as MM:SS.
   * @param {number} time - Time in seconds.
   * @returns {string} Formatted time string in MM:SS format.
   */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="grid place-items-center gap-2">
      <button onClick={togglePlay}>
        {isPlaying && (
          <PauseCircle className="sm:h-[4rem] h-[2.5rem] sm:w-[4rem] w-[2.5rem] text-primary" />
        )}
        {!isPlaying && (
          <PlayCircle className="sm:h-[4rem] h-[2.5rem] sm:w-[4rem] w-[2.5rem] text-primary" />
        )}
      </button>
      <div className="flex gap-2 items-center w-full">
        <div className="w-10">
          <span className="text-sm font-semibold">
            {formatTime(currentTime)}
          </span>
        </div>
        <Slider
          className="w-full cursor-pointer"
          defaultValue={[0]}
          max={duration}
          min={0}
          step={0.01}
          value={[currentTime] as [number]}
          onValueChange={handleSliderChange}
        />
        <div className="w-10">
          <span className="text-sm font-semibold">{formatTime(duration)}</span>
        </div>
        <audio ref={audioRef} className="hidden" controls autoPlay={autoPlay}>
          <source src={audio} type="audio/mpeg" />
          <track kind="captions" srcLang="en" label="English" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

export { AudioPlayer };
