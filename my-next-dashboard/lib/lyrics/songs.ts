import type { LyricLine } from "./lyricsMap";
import { lyricsMap } from "./lyricsMap";

export type Song = {
  id: string;
  title: string;
  artist: string;
  file: string;
  lyrics?: LyricLine[];
};

export const songs: Song[] = [
  {
    id: "rollin",
    title: "Rollin'",
    artist: "Limp Bizkit",
    file: "/music/Limp Bizkit - Rollin.mp3",
    lyrics: lyricsMap.rollin,
  },
  {
    id: "wag",
    title: "Huwag Na Huwag Mong Sasabihin",
    artist: "Kitchie Nadal",
    file: "/music/Huwag Na Huwag Mong Sasabihin.mp3",
    lyrics: lyricsMap.wag,
  },
  {
    id: "housetour",
    title: "House Tour",
    artist: "Sabrina Carpenter",
    file: "/music/House Tour.mp3",
    lyrics: lyricsMap.housetour,
  },
  {
    id: "flambae",
    title: "Bitch Flambae",
    artist: "Flambae",
    file: "/music/BitchFlambae.mp3",
    lyrics: lyricsMap.flambae,
  },
  {
    id: "sumayawKa",
    title: "Sumayaw Ka",
    artist: "Gloc 9",
    file: "/music/Sumayaw Ka.mp3",
    lyrics: lyricsMap.sumayawKa,
  },
  {
    id: "ale",
    title: "Ale",
    artist: "The Bloomfields",
    file: "/music/Ale.mp3",
    lyrics: lyricsMap.ale,
  },
];
