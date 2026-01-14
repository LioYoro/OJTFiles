"use client";

import { songs } from "@/lib/lyrics";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const song = songs[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // conditional rendering AFTER hooks
  if (pathname === "/music") return null;
  if (!isPlaying) return null;

  return (
    <>
      {/* hidden audio */}
      <audio ref={audioRef} src={song.file} />

      <div
        onClick={() => router.push("/music")}
        className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 shadow-xl rounded-lg px-4 py-3 flex items-center gap-4 cursor-pointer"
      >
        <div>
          <div className="font-semibold text-sm">{song.title}</div>
          <div className="text-xs opacity-70">{song.artist}</div>
        </div>
      </div>
    </>
  );
}
