import app from './api/server.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";

import home from './routes/home.ts';

const env = config();

const host = env['HOST'] || 'http://127.0.0.1'
const port = parseInt(env['PORT']);

app.use(home.routes());

console.log(`app running -> ${host}:${port}`);
app.listen({ port });