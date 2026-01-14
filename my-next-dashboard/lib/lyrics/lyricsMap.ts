import { parseLrc } from "./parseLrc";
import { rollinLrc } from "./rollin.lrc";
import { wagLrc } from "./wag.lrc";
import { housetourLrc } from "./housetour.lrc";
import { flambaeLrc } from "./flambae.lrc";
import { sumayawKaLrc } from "./sumayawKa.lrc";
import { aleLrc } from "./ale.lrc";

export type LyricLine = {
  time: number;
  text: string;
};

export type SongLyricsMap = Record<string, LyricLine[]>;

export const lyricsMap: SongLyricsMap = {
  rollin: parseLrc(rollinLrc),
  wag: parseLrc(wagLrc),
  housetour: parseLrc(housetourLrc),
  flambae: parseLrc(flambaeLrc),
  sumayawKa: parseLrc(sumayawKaLrc),
  ale: parseLrc(aleLrc),
};
