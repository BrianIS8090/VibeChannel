import { useEffect, useMemo, useRef, useState } from 'react';
import { fallbackStations, moods } from './data/stations';
import type { HistoryItem, Mood, Station } from './shared/types';
import './App.css';

type Tab = 'эфир' | 'станции' | 'любимое' | 'лог';

type Notice = 'idle' | 'playing' | 'favorite' | 'note';

const apiPath = (path: string) => {
  const prefix = globalThis.location?.pathname?.startsWith('/vibechannel') ? '/vibechannel/api' : '/api';
  return `${prefix}${path}`;
};

async function readJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiPath(path), {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json() as Promise<T>;
}

export function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stations, setStations] = useState<Station[]>(fallbackStations);
  const [currentStation, setCurrentStation] = useState<Station>(fallbackStations[0]);
  const [currentMood, setCurrentMood] = useState<Mood>('night');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [note, setNote] = useState('');
  const [tab, setTab] = useState<Tab>('эфир');
  const [notice, setNotice] = useState<Notice>('idle');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      readJson<{ stations: Station[] }>('/stations'),
      readJson<{ favorites: string[]; history: HistoryItem[]; note: string }>('/state')
    ])
      .then(([stationPayload, statePayload]) => {
        if (cancelled) return;
        const loadedStations = stationPayload.stations.length > 0 ? stationPayload.stations : fallbackStations;
        setStations(loadedStations);
        setCurrentStation(loadedStations[0]);
        setCurrentMood(loadedStations[0].mood);
        setFavorites(statePayload.favorites);
        setHistory(statePayload.history);
        setNote(statePayload.note);
      })
      .catch(() => {
        if (!cancelled) setStations(fallbackStations);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleStations = useMemo(() => {
    if (tab === 'любимое') return stations.filter((station) => favorites.includes(station.id));
    return stations;
  }, [favorites, stations, tab]);

  const favoriteStations = useMemo(
    () => stations.filter((station) => favorites.includes(station.id)),
    [favorites, stations]
  );

  const chooseStation = (station: Station) => {
    setCurrentStation(station);
    setCurrentMood(station.mood);
  };

  const playCurrent = async () => {
    await audioRef.current?.play();
    const payload = await readJson<{ history: HistoryItem[] }>('/history', {
      method: 'POST',
      body: JSON.stringify({ stationId: currentStation.id })
    });
    setHistory(payload.history);
    setNotice('playing');
  };

  const scanNext = () => {
    const index = stations.findIndex((station) => station.id === currentStation.id);
    const next = stations[(index + 1) % stations.length];
    chooseStation(next);
  };

  const saveFavorite = async () => {
    const payload = await readJson<{ favorites: string[] }>(`/favorites/${currentStation.id}`, { method: 'PUT' });
    setFavorites(payload.favorites);
    setNotice('favorite');
  };

  const saveNote = async () => {
    const payload = await readJson<{ note: string }>('/note', {
      method: 'PUT',
      body: JSON.stringify({ text: note })
    });
    setNote(payload.note);
    setNotice('note');
  };

  const selectMood = (mood: Mood) => {
    setCurrentMood(mood);
    const station = stations.find((candidate) => candidate.mood === mood);
    if (station) setCurrentStation(station);
    setTab('станции');
  };

  return (
    <main className="wrap">
      <header className="brand">
        <h1>VibeChannel</h1>
        <span>PIXEL POCKET</span>
      </header>

      <section className="pixel handheld" aria-label="Пиксельное радио">
        <div className="radio-panel">
          <div className="screen soft">
            <div className="sky" aria-hidden="true">
              <div className="stars">✦ ✦ ✦</div>
              <div className="moon" />
            </div>

            <div className="radio-face" aria-hidden="true">
              <div className="speaker" />
              <div className="dial">{currentStation.frequency}</div>
            </div>

            <p className="source">{currentStation.source}</p>
            <h2 className="station-title">{currentStation.title}</h2>
            <p className="track">{currentStation.track}</p>
            {notice === 'playing' && <p className="notice">{currentStation.name} слушается</p>}
            {notice === 'favorite' && <p className="notice">сохранено в любимое</p>}
            {notice === 'note' && <p className="notice">заметка сохранена</p>}
          </div>

          <audio ref={audioRef} src={currentStation.streamUrl} preload="none" />

          <div className="controls" aria-label="Управление эфиром">
            <button className="btn active" type="button" onClick={playCurrent}>play</button>
            <button className="btn" type="button" onClick={scanNext}>scan</button>
            <button className="btn" type="button" onClick={saveFavorite}>save</button>
          </div>

          <div className="moods" aria-label="Настроение">
            {moods.map((mood) => (
              <button
                className={mood.id === currentMood ? 'chip active' : 'chip'}
                type="button"
                key={mood.id}
                onClick={() => selectMood(mood.id)}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="stations-panel">
          {tab === 'лог' ? (
            <section className="side-card" aria-label="Лог эфира">
              <label className="tiny" htmlFor="evening-note">Заметка вечера</label>
              <textarea
                id="evening-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={280}
                placeholder="что слушаем сегодня?"
              />
              <button className="mini-btn" type="button" onClick={saveNote}>save note</button>
              <p className="tiny">history</p>
              <ul className="compact-list" aria-label="История">
                {history.length === 0 ? <li>пока пусто</li> : history.map((item) => <li key={item.id}>{item.stationName}</li>)}
              </ul>
            </section>
          ) : (
            <section role="region" aria-label={tab === 'любимое' ? 'Любимые станции' : 'Каталог станций'}>
              <p className="tiny">{tab === 'любимое' ? 'favorites' : 'stations'}</p>
              <ul className="station-list" aria-label="Станции">
                {(tab === 'любимое' ? favoriteStations : visibleStations).map((station) => {
                  const active = station.id === currentStation.id;
                  return (
                    <li key={station.id}>
                      <button
                        className={active ? 'row active' : 'row'}
                        type="button"
                        onClick={() => chooseStation(station)}
                      >
                        <span aria-hidden="true">{active ? '▶' : '·'}</span>
                        <b>{station.name}</b>
                        <span>{station.frequency}</span>
                      </button>
                    </li>
                  );
                })}
                {tab === 'любимое' && favoriteStations.length === 0 && <li className="empty">нет сохранённых</li>}
              </ul>
            </section>
          )}
        </aside>
      </section>

      <nav className="nav" aria-label="Основная навигация">
        {(['эфир', 'станции', 'любимое', 'лог'] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-current={tab === item ? 'page' : undefined}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </main>
  );
}
