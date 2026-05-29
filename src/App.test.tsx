import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import type { Station, VibeState } from './shared/types';

const stations: Station[] = [
  {
    id: 'groove-salad',
    name: 'Groove Salad',
    title: 'Groove Salad',
    track: 'lofi / soft beats / night mode',
    frequency: '92',
    mood: 'night',
    source: 'SomaFM',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    tags: ['night']
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
    tags: ['rain']
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
    tags: ['jazz']
  }
];

const state: VibeState = { favorites: [], history: [], note: '' };

function jsonResponse(payload: unknown, status = 200) {
  return Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(payload) } as Response);
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith('/api/stations')) return jsonResponse({ stations });
    if (url === '/api/state') return jsonResponse(state);
    if (url === '/api/favorites/groove-salad' && init?.method === 'PUT') return jsonResponse({ favorites: ['groove-salad'] });
    if (url === '/api/history' && init?.method === 'POST') return jsonResponse({ history: [{ id: 1, stationId: 'groove-salad', stationName: 'Groove Salad', playedAt: '2026-05-29 22:00' }] }, 201);
    if (url === '/api/note' && init?.method === 'PUT') return jsonResponse({ note: JSON.parse(String(init.body)).text });
    return jsonResponse({}, 404);
  }));
});

describe('VibeChannel pocket radio app', () => {
  it('renders the selected Pixel Pocket Radio direction without TUI clutter', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'VibeChannel' })).toBeInTheDocument();
    expect(screen.getByText('PIXEL POCKET')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Пиксельное радио' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Groove Salad/i })).toBeInTheDocument();
    expect(screen.getByText('lofi / soft beats / night mode')).toBeInTheDocument();

    expect(screen.queryByText(/terminal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/command/i)).not.toBeInTheDocument();
  });

  it('loads stations from the API and changes the current station', async () => {
    const user = userEvent.setup();
    render(<App />);

    const stationList = await screen.findByRole('list', { name: 'Станции' });
    expect(within(stationList).getAllByRole('listitem')).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: /Rainwave Game/i }));

    expect(screen.getByRole('heading', { name: /Rainwave Game/i })).toBeInTheDocument();
    expect(screen.getByText('game music / pixel rain / cozy')).toBeInTheDocument();
  });

  it('plays the current stream and writes listening history', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole('heading', { name: /Groove Salad/i });
    await user.click(screen.getByRole('button', { name: 'play' }));

    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('/api/history', expect.objectContaining({ method: 'POST' }));
    expect(await screen.findByText(/Groove Salad слушается/i)).toBeInTheDocument();
  });

  it('saves a favorite station and shows it on the favorites tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole('heading', { name: /Groove Salad/i });
    await user.click(screen.getByRole('button', { name: 'save' }));
    await user.click(screen.getByRole('button', { name: 'любимое' }));

    const favoritesPanel = await screen.findByRole('region', { name: 'Любимые станции' });
    expect(within(favoritesPanel).getByText('Groove Salad')).toBeInTheDocument();
    expect(screen.getByText('сохранено в любимое')).toBeInTheDocument();
  });

  it('saves the evening note without cluttering the main radio screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'лог' }));
    await user.type(screen.getByLabelText('Заметка вечера'), 'Слушать ночью');
    await user.click(screen.getByRole('button', { name: 'save note' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/note', expect.objectContaining({ method: 'PUT' })));
    expect(screen.getByText('заметка сохранена')).toBeInTheDocument();
  });

  it('keeps the mobile-first bottom navigation small and focused', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: /Groove Salad/i });
    const navigation = screen.getByRole('navigation', { name: 'Основная навигация' });
    expect(within(navigation).getAllByRole('button')).toHaveLength(4);
    expect(within(navigation).getByRole('button', { name: 'эфир' })).toHaveAttribute('aria-current', 'page');
  });
});
