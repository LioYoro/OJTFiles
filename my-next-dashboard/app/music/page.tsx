"use client";

import { useEffect, useRef, useState } from "react";
import { songs } from "@/lib/lyrics";

export default function MusicPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastActiveIndexRef = useRef<number | null>(null);

  const currentSong = songs[currentIndex];

  // Update currentTime from audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);

    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [currentIndex]);

  // Auto-scroll lyrics (ONLY when active line changes)
  useEffect(() => {
    const lyrics = currentSong.lyrics;
    if (!lyrics || lyrics.length === 0) return;

    const activeIndex = lyrics.findIndex(
      (line, i) =>
        currentTime >= line.time &&
        (i === lyrics.length - 1 ||
          currentTime < lyrics[i + 1].time)
    );

    if (
      activeIndex === -1 ||
      activeIndex === lastActiveIndexRef.current
    ) {
      return;
    }

    lastActiveIndexRef.current = activeIndex;

    lineRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentTime, currentSong.lyrics]);

  return (
    <main className="py-8">
      <div className="site-container max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Music Player 🎧</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Local music from <code>/public/music</code>
        </p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SONG LIST */}
          <div className="card md:col-span-1">
            <h2 className="font-bold mb-3">Songs</h2>
            <ul className="space-y-2 text-sm">
              {songs.map((song, index) => (
                <li
                  key={song.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setCurrentTime(0);
                    lastActiveIndexRef.current = null;
                    audioRef.current?.pause();
                    audioRef.current?.load();
                  }}
                  className={`cursor-pointer p-2 rounded-md transition ${
                    index === currentIndex
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-xs opacity-80">{song.artist}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* PLAYER + LYRICS */}
          <div className="card md:col-span-2">
            <h2 className="font-bold text-lg">{currentSong.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {currentSong.artist}
            </p>

            <audio
              ref={audioRef}
              src={currentSong.file}
              controls
              autoPlay
              className="w-full mb-4"
            />

            {/* SYNCED LYRICS */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-72 overflow-y-auto text-sm">
              {currentSong.lyrics ? (
                currentSong.lyrics.map((line, index) => {
                  const isActive =
                    currentTime >= line.time &&
                    (index === currentSong.lyrics!.length - 1 ||
                      currentTime <
                        currentSong.lyrics![index + 1].time);

                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        lineRefs.current[index] = el;
                      }}
                      className={`transition-all duration-200 rounded px-1 py-1 ${
                        isActive
                          ? "text-indigo-600 font-semibold bg-white/10 scale-[1.03]"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {line.text || "\u00A0"}
                    </div>
                  );
                })
              ) : (
                <div>No lyrics available.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
