"use client";

import { createContext, useContext, useRef, useState } from "react";

type MusicContextType = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  play: (src?: string) => void;
  pause: () => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (src?: string) => {
    if (!audioRef.current) return;

    if (src) {
      audioRef.current.src = src;
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider
      value={{ audioRef, isPlaying, play, pause }}
    >
      {/* persistent audio */}
      <audio ref={audioRef} />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used inside MusicProvider");
  }
  return context;
}
