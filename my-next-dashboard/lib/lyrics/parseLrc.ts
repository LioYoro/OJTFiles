export type LyricLine = {
  time: number;
  text: string;
};

export function parseLrc(lrc: string): LyricLine[] {
  return lrc
    .split("\n")
    .map(line => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (!match) return null;

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const text = match[3].trim();

      return {
        time: minutes * 60 + seconds,
        text,
      };
    })
    .filter((line): line is LyricLine => line !== null);
}
