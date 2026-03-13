export type Role = "owner" | "admin" | "developer" | "viewer";

export interface AuthContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  goal: string;
  systemPrompt: string;
  tools: string[];
  memoryEnabled: boolean;
  workflowTriggers: string[];
}

export interface WorkflowNode {
  id: string;
  type:
    | "webhook_trigger"
    | "cron_trigger"
    | "api_trigger"
    | "event_trigger"
    | "agent"
    | "condition"
    | "transform"
    | "loop"
    | "http_request"
    | "send_email"
    | "database_write"
    | "slack_message"
    | "external_api";
  config: Record<string, unknown>;
}
