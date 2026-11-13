import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import { createApp } from "./app.js";

const port = 3000;
const app = createApp(() => env);

app.listen(port);

export default httpServerHandler({ port });
