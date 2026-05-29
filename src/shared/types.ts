export type Mood = 'night' | 'code' | 'rain' | 'cyberpunk' | 'calm' | 'jazz';

export type Station = {
  id: string;
  name: string;
  title: string;
  track: string;
  frequency: string;
  mood: Mood;
  source: 'SomaFM' | 'Radio Browser' | 'VibeChannel';
  streamUrl: string;
  homepage?: string;
  tags: string[];
};

export type HistoryItem = {
  id: number;
  stationId: string;
  stationName: string;
  playedAt: string;
};

export type VibeState = {
  favorites: string[];
  history: HistoryItem[];
  note: string;
};
