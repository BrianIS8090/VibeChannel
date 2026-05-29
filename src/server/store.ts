import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { HistoryItem, VibeState } from '../shared/types';
import { getStationById } from '../data/stations';

export type VibeStore = {
  db: DatabaseType;
  getState(): VibeState;
  addFavorite(stationId: string): string[];
  removeFavorite(stationId: string): string[];
  addHistory(stationId: string): HistoryItem[];
  saveNote(text: string): string;
  close(): void;
};

export function createStore(dbPath: string): VibeStore {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      station_id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_id TEXT NOT NULL,
      station_name TEXT NOT NULL,
      played_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      text TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const readFavorites = () =>
    db.prepare('SELECT station_id FROM favorites ORDER BY created_at ASC').all().map((row) => (row as { station_id: string }).station_id);

  const readHistory = (): HistoryItem[] =>
    db.prepare('SELECT id, station_id as stationId, station_name as stationName, played_at as playedAt FROM history ORDER BY id DESC LIMIT 12').all() as HistoryItem[];

  const readNote = () => (db.prepare('SELECT text FROM notes WHERE id = 1').get() as { text: string } | undefined)?.text ?? '';

  return {
    db,
    getState() {
      return { favorites: readFavorites(), history: readHistory(), note: readNote() };
    },
    addFavorite(stationId: string) {
      db.prepare('INSERT OR IGNORE INTO favorites (station_id) VALUES (?)').run(stationId);
      return readFavorites();
    },
    removeFavorite(stationId: string) {
      db.prepare('DELETE FROM favorites WHERE station_id = ?').run(stationId);
      return readFavorites();
    },
    addHistory(stationId: string) {
      const station = getStationById(stationId);
      if (!station) throw new Error(`Unknown station: ${stationId}`);
      db.prepare('INSERT INTO history (station_id, station_name) VALUES (?, ?)').run(station.id, station.name);
      return readHistory();
    },
    saveNote(text: string) {
      const trimmed = text.slice(0, 280);
      db.prepare(`
        INSERT INTO notes (id, text, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET text = excluded.text, updated_at = CURRENT_TIMESTAMP
      `).run(trimmed);
      return trimmed;
    },
    close() {
      db.close();
    }
  };
}
