import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildServer } from './app';

let dir: string;
let dbPath: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'vibechannel-'));
  dbPath = join(dir, 'test.sqlite');
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('VibeChannel API', () => {
  it('serves seeded SomaFM and Radio Browser stations filtered by mood', async () => {
    const app = await buildServer({ dbPath, logger: false });

    const response = await app.inject({ method: 'GET', url: '/api/stations?mood=night' });
    const payload = response.json();

    expect(response.statusCode).toBe(200);
    expect(payload.stations.length).toBeGreaterThanOrEqual(2);
    expect(payload.stations.every((station: { mood: string }) => station.mood === 'night')).toBe(true);
    expect(payload.stations.map((station: { source: string }) => station.source)).toContain('SomaFM');
    expect(payload.stations[0]).toHaveProperty('streamUrl');

    await app.close();
  });

  it('persists favorites, play history, and the evening note in SQLite', async () => {
    const app = await buildServer({ dbPath, logger: false });

    const favorite = await app.inject({ method: 'PUT', url: '/api/favorites/groove-salad' });
    expect(favorite.statusCode).toBe(200);
    expect(favorite.json()).toEqual({ favorites: ['groove-salad'] });

    const history = await app.inject({
      method: 'POST',
      url: '/api/history',
      payload: { stationId: 'groove-salad' }
    });
    expect(history.statusCode).toBe(201);
    expect(history.json().history[0].stationName).toBe('Groove Salad');

    const note = await app.inject({
      method: 'PUT',
      url: '/api/note',
      payload: { text: 'Слушать ночью, пока код компилится' }
    });
    expect(note.statusCode).toBe(200);
    expect(note.json()).toEqual({ note: 'Слушать ночью, пока код компилится' });

    const state = await app.inject({ method: 'GET', url: '/api/state' });
    expect(state.json()).toMatchObject({
      favorites: ['groove-salad'],
      note: 'Слушать ночью, пока код компилится'
    });
    expect(state.json().history).toHaveLength(1);

    await app.close();
  });

  it('removes a favorite without deleting history', async () => {
    const app = await buildServer({ dbPath, logger: false });

    await app.inject({ method: 'PUT', url: '/api/favorites/groove-salad' });
    await app.inject({ method: 'DELETE', url: '/api/favorites/groove-salad' });
    await app.inject({ method: 'POST', url: '/api/history', payload: { stationId: 'groove-salad' } });

    const state = await app.inject({ method: 'GET', url: '/api/state' });
    expect(state.json().favorites).toEqual([]);
    expect(state.json().history).toHaveLength(1);

    await app.close();
  });
});
