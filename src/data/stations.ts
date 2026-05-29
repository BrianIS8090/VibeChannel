import type { Station } from '../shared/types';

export const fallbackStations: Station[] = [
  {
    id: 'groove-salad',
    name: 'Groove Salad',
    title: 'Groove Salad',
    track: 'lofi / soft beats / night mode',
    frequency: '92',
    mood: 'night',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    homepage: 'https://somafm.com/groovesalad/',
    tags: ['lofi', 'downtempo', 'night']
  },
  {
    id: 'drone-zone',
    name: 'Drone Zone',
    title: 'Drone Zone',
    track: 'deep ambient / star room / slow',
    frequency: '73',
    mood: 'night',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3',
    homepage: 'https://somafm.com/dronezone/',
    tags: ['ambient', 'space', 'night']
  },
  {
    id: 'def-con',
    name: 'DEF CON Radio',
    title: 'DEF CON Radio',
    track: 'hacker radio / late terminal / focus',
    frequency: '404',
    mood: 'code',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/defcon-128-mp3',
    homepage: 'https://somafm.com/defcon/',
    tags: ['code', 'focus', 'electronic']
  },
  {
    id: 'beat-blender',
    name: 'Beat Blender',
    title: 'Beat Blender',
    track: 'beats / flow state / soft push',
    frequency: '101',
    mood: 'code',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/beatblender-128-mp3',
    homepage: 'https://somafm.com/beatblender/',
    tags: ['beats', 'coding', 'groove']
  },
  {
    id: 'rainwave-game',
    name: 'Rainwave Game',
    title: 'Rainwave Game',
    track: 'game music / pixel rain / cozy',
    frequency: '88',
    mood: 'rain',
    source: 'Radio Browser',
    streamUrl: 'https://relay.rainwave.cc/game.mp3',
    homepage: 'https://rainwave.cc/game/',
    tags: ['game', 'rain', 'pixel']
  },
  {
    id: 'secret-agent',
    name: 'Secret Agent',
    title: 'Secret Agent',
    track: 'spy jazz / warm lamps / slow walk',
    frequency: '107',
    mood: 'jazz',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/secretagent-128-mp3',
    homepage: 'https://somafm.com/secretagent/',
    tags: ['jazz', 'cinematic', 'night']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    title: 'Cyberpunk',
    track: 'neon drive / synth / chrome night',
    frequency: '2077',
    mood: 'cyberpunk',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/synphaera-128-mp3',
    homepage: 'https://somafm.com/synphaera/',
    tags: ['synth', 'cyberpunk', 'neon']
  },
  {
    id: 'indie-pop-rocks',
    name: 'Indie Pop Rocks',
    title: 'Indie Pop Rocks',
    track: 'calm indie / tiny speakers / daytime',
    frequency: '64',
    mood: 'calm',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3',
    homepage: 'https://somafm.com/indiepop/',
    tags: ['indie', 'calm', 'soft']
  }
];

export const moods = [
  { id: 'night', label: 'night' },
  { id: 'code', label: 'code' },
  { id: 'rain', label: 'rain' },
  { id: 'cyberpunk', label: 'cyber' },
  { id: 'calm', label: 'calm' },
  { id: 'jazz', label: 'jazz' }
] as const;

export function getStationsByMood(mood?: string): Station[] {
  if (!mood) return fallbackStations;
  const filtered = fallbackStations.filter((station) => station.mood === mood);
  return filtered.length > 0 ? filtered : fallbackStations;
}

export function getStationById(stationId: string): Station | undefined {
  return fallbackStations.find((station) => station.id === stationId);
}
