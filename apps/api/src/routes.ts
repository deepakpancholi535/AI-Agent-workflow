import { FastifyInstance } from "fastify";

export async function registerRoutes(app: FastifyInstance) {
  app.post("/auth/login", async () => ({ accessToken: "jwt", refreshToken: "refresh" }));
  app.post("/auth/register", async () => ({ status: "registered" }));
  app.post("/auth/oauth", async () => ({ status: "oauth_linked" }));

  app.get("/agents", async () => ({ data: [] }));
  app.post("/agents", async () => ({ status: "created" }));
  app.put("/agents/:id", async () => ({ status: "updated" }));
  app.delete("/agents/:id", async () => ({ status: "deleted" }));

  app.get("/workflows", async () => ({ data: [] }));
  app.post("/workflows", async () => ({ status: "created" }));
  app.put("/workflows/:id", async () => ({ status: "updated" }));

  app.post("/workflows/:id/run", async () => ({ status: "queued" }));
  app.get("/executions", async () => ({ data: [] }));

  app.get("/marketplace", async () => ({ data: [] }));
  app.post("/marketplace/publish", async () => ({ status: "published" }));

  app.get("/billing", async () => ({ plan: "pro" }));
  app.post("/billing/subscribe", async () => ({ status: "subscribed" }));

  app.get("/ws/executions", { websocket: true }, (socket) => {
    socket.send(JSON.stringify({ type: "connected", channel: "executions" }));
  });
}
