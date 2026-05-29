import { useState } from 'react';
import './App.css';

type Station = {
  id: string;
  name: string;
  title: string;
  track: string;
  frequency: string;
};

const stations: Station[] = [
  {
    id: 'groove-salad',
    name: 'Groove Salad',
    title: 'Groove Salad',
    track: 'lofi / soft beats / night mode',
    frequency: '92'
  },
  {
    id: 'rain-bits',
    name: 'Rain Bits',
    title: 'Rain Bits',
    track: 'rain tape / tiny room / calm',
    frequency: '88'
  },
  {
    id: 'moon-jazz',
    name: 'Moon Jazz',
    title: 'Moon Jazz',
    track: 'pixel jazz / warm night / slow',
    frequency: '107'
  }
];

const moods = ['night', 'code', 'rain', 'jazz'];

export function App() {
  const [currentStation, setCurrentStation] = useState(stations[0]);

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
              <div className="dial">92.4</div>
            </div>

            <h2 className="station-title">{currentStation.title}</h2>
            <p className="track">{currentStation.track}</p>
          </div>

          <div className="controls" aria-label="Управление эфиром">
            <button className="btn active" type="button">play</button>
            <button className="btn" type="button">scan</button>
            <button className="btn" type="button">save</button>
          </div>

          <div className="moods" aria-label="Настроение">
            {moods.map((mood, index) => (
              <button className={index === 0 ? 'chip active' : 'chip'} type="button" key={mood}>
                {mood}
              </button>
            ))}
          </div>
        </div>

        <aside className="stations-panel">
          <p className="tiny">stations</p>
          <ul className="station-list" aria-label="Станции">
            {stations.map((station) => {
              const active = station.id === currentStation.id;
              return (
                <li key={station.id}>
                  <button
                    className={active ? 'row active' : 'row'}
                    type="button"
                    onClick={() => setCurrentStation(station)}
                  >
                    <span aria-hidden="true">{active ? '▶' : '·'}</span>
                    <b>{station.name}</b>
                    <span>{station.frequency}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </section>

      <nav className="nav" aria-label="Основная навигация">
        <button type="button" aria-current="page">эфир</button>
        <button type="button">станции</button>
        <button type="button">любимое</button>
        <button type="button">лог</button>
      </nav>
    </main>
  );
}
