import fastify, { type FastifyBaseLogger, type FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fallbackStations, getStationsByMood } from '../data/stations';
import { createStore } from './store';

export type BuildServerOptions = {
  dbPath?: string;
  logger?: boolean | FastifyBaseLogger;
  staticDir?: string;
};

function registerApi(app: FastifyInstance, prefix = '') {
  app.get(`${prefix}/api/health`, async () => ({ ok: true, name: 'VibeChannel' }));

  app.get(`${prefix}/api/stations`, async (request) => {
    const query = request.query as { mood?: string };
    return { stations: getStationsByMood(query.mood) };
  });

  app.get(`${prefix}/api/state`, async (request) => {
    return request.server.vibeStore.getState();
  });

  app.put(`${prefix}/api/favorites/:stationId`, async (request) => {
    const { stationId } = request.params as { stationId: string };
    return { favorites: request.server.vibeStore.addFavorite(stationId) };
  });

  app.delete(`${prefix}/api/favorites/:stationId`, async (request) => {
    const { stationId } = request.params as { stationId: string };
    return { favorites: request.server.vibeStore.removeFavorite(stationId) };
  });

  app.post(`${prefix}/api/history`, async (request, reply) => {
    const body = request.body as { stationId?: string };
    if (!body.stationId || !fallbackStations.some((station) => station.id === body.stationId)) {
      return reply.code(400).send({ error: 'Unknown station' });
    }
    return reply.code(201).send({ history: request.server.vibeStore.addHistory(body.stationId) });
  });

  app.put(`${prefix}/api/note`, async (request) => {
    const body = request.body as { text?: string };
    return { note: request.server.vibeStore.saveNote(body.text ?? '') };
  });
}

export async function buildServer(options: BuildServerOptions = {}) {
  const app = fastify({ logger: options.logger ?? true });
  const dbPath = options.dbPath ?? process.env.VIBECHANNEL_DB ?? '/var/lib/vibechannel/vibechannel.sqlite';
  const store = createStore(dbPath);
  app.decorate('vibeStore', store);
  app.addHook('onClose', async () => store.close());

  registerApi(app);
  registerApi(app, '/vibechannel');

  const staticDir = options.staticDir ?? resolve(process.cwd(), 'dist');
  if (existsSync(staticDir)) {
    await app.register(fastifyStatic, {
      root: staticDir,
      prefix: '/vibechannel/',
      decorateReply: false
    });

    app.get('/vibechannel', async (_request, reply) => reply.redirect('/vibechannel/'));
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/vibechannel/') && !request.url.startsWith('/vibechannel/api/')) {
        return reply.sendFile('index.html');
      }
      return reply.code(404).send({ error: 'Not found' });
    });
  }

  return app;
}

declare module 'fastify' {
  interface FastifyInstance {
    vibeStore: ReturnType<typeof createStore>;
  }
}
