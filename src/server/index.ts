import { buildServer } from './app';

const port = Number(process.env.PORT ?? 4174);
const host = process.env.HOST ?? '127.0.0.1';

const app = await buildServer();
await app.listen({ port, host });
