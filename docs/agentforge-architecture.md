# AGENTFORGE Production Architecture

## 1. System architecture diagram (text)

```text
[ Next.js Frontend ]
        |
        v
[ API Gateway / BFF (Fastify) ] -- JWT/RBAC --> [Auth + User + Workspace Services]
        |
        +--> [Agent Service] -----> [LLM Orchestrator] -----> [Model Providers]
        |
        +--> [Workflow Service] --> [Execution Service] --> [BullMQ Queue] --> [Worker Service]
        |                                                        |
        |                                                        +--> [Plugin Connectors]
        |
        +--> [Marketplace Service] --> [Billing Service (Stripe)]
        |
        +--> [Realtime WS Service] --> [Execution Logs / Notifications]

[PostgreSQL + pgvector] [Redis] [Object Storage] [Weaviate/Pinecone optional]
```

## 2. Folder structure

```text
apps/
  api/                 # Fastify REST + WS API gateway and domain modules
  worker/              # BullMQ workers for asynchronous execution
  frontend/            # Next.js 14 app router UI
packages/
  shared/              # shared types/contracts
  workflow-engine/     # node-graph workflow runtime
  agent-runtime/       # agent orchestration/tool-calling runtime
infra/
  docker/              # service Dockerfiles
  k8s/                 # kubernetes manifests
.github/workflows/     # CI/CD pipeline
 db/migrations/        # PostgreSQL schema migrations
 docs/                 # architecture + operational docs
```

## 3. Database schema

Primary relational + vector schema is defined in `db/migrations/001_init.sql` and includes:
- tenancy: organizations, workspaces, users
- automation: agents, workflows, workflow_nodes, executions, tasks
- integrations: plugins, plugin_connections
- growth: marketplace_agents, subscriptions, usage_records
- security: api_keys, audit_logs
- memory: memories (pgvector embeddings)

## 4. Backend services

- **API service (`apps/api`)**: REST endpoints, websocket channel, auth boundary, RBAC enforcement hooks.
- **Worker service (`apps/worker`)**: BullMQ workers with retryable execution jobs.
- **Shared runtimes**:
  - `packages/workflow-engine`: graph execution runner and node dispatch logic.
  - `packages/agent-runtime`: LLM orchestration + tool resolution.

## 5. API routes

Implemented route surface in `apps/api/src/routes.ts`:
- Auth: `POST /auth/login`, `POST /auth/register`, `POST /auth/oauth`
- Agents: `GET /agents`, `POST /agents`, `PUT /agents/:id`, `DELETE /agents/:id`
- Workflows: `GET /workflows`, `POST /workflows`, `PUT /workflows/:id`
- Executions: `POST /workflows/:id/run`, `GET /executions`
- Marketplace: `GET /marketplace`, `POST /marketplace/publish`
- Billing: `GET /billing`, `POST /billing/subscribe`
- Realtime: `GET /ws/executions` websocket endpoint

## 6. Frontend pages and components

Next.js App Router pages implemented:
- `/dashboard`
- `/agents`
- `/workflows`
- `/workflows/editor` (React Flow workflow canvas)
- `/marketplace`
- `/integrations`
- `/analytics`
- `/settings`
- `/billing`

Core UI capability is scaffolded for:
- workflow builder canvas (`ReactFlow`)
- dashboard shell ready for analytics charts/realtime logs
- modular pages for marketplace/agents/integrations/billing

## 7. Workflow engine implementation

`packages/workflow-engine/src/engine.ts` provides:
- workflow node traversal
- execution context (input + memory map)
- dispatch by node type (transform/condition/loop + generic actions)
- extension point for trigger/action node handlers

Execution tasks are handed to BullMQ for async and distributed processing.

## 8. Agent system implementation

`packages/agent-runtime/src/agent-orchestrator.ts` provides:
- agent definition execution contract
- prompt assembly from goal + system prompt + input
- lightweight tool-call extraction and invocation contract
- provider abstraction (`LlmProvider`) for OpenAI/Anthropic/Azure/etc.

Memory and embeddings are persisted using the `memories` table with vector index support.

## 9. Docker configuration

- `infra/docker/Dockerfile.api`
- `infra/docker/Dockerfile.worker`
- `infra/docker/Dockerfile.frontend`
- `docker-compose.yml` for local stack (frontend, api, worker, redis, postgres, vector-db)

## 10. CI/CD pipeline

`.github/workflows/ci-cd.yml` pipeline stages:
1. install dependencies
2. test
3. lint
4. typecheck
5. build service containers
6. deploy job placeholder for cloud rollout

## 11. Deployment instructions

1. Copy `.env.example` values into service environment configuration (or Kubernetes secrets).
2. Start local dependencies:
   - `docker compose up --build`
3. Apply database migration `db/migrations/001_init.sql` to PostgreSQL.
4. For Kubernetes:
   - build/push images for `api`, `worker`, `frontend`
   - update image tags in `infra/k8s/agentforge.yaml`
   - `kubectl apply -f infra/k8s/agentforge.yaml`
5. Configure ingress, TLS, Stripe webhooks, OAuth callbacks, and external plugin credentials.
6. Scale workers horizontally based on queue depth and configure HPA policies.
