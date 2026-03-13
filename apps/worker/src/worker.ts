import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

new Worker(
  "workflow-executions",
  async (job) => {
    return {
      executionId: job.id,
      status: "completed",
      processedAt: new Date().toISOString(),
    };
  },
  { connection },
);

console.log("Worker started: workflow-executions");
