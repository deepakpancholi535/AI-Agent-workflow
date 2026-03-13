import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { registerRoutes } from "./routes.js";

export async function buildServer() {
  const app = Fastify({ logger: true });
  await app.register(websocket);

  app.get("/health", async () => ({ status: "ok", service: "api" }));
  await registerRoutes(app);
  return app;
}

if (process.env.NODE_ENV !== "test") {
  buildServer()
    .then((app) => app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" }))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
