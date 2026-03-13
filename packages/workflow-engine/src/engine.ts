import { WorkflowNode } from "../../shared/src/types.js";

export interface ExecutionContext {
  executionId: string;
  input: Record<string, unknown>;
  memory: Map<string, unknown>;
}

export class WorkflowEngine {
  async run(nodes: WorkflowNode[], context: ExecutionContext): Promise<Record<string, unknown>> {
    let state: Record<string, unknown> = { ...context.input };

    for (const node of nodes) {
      state = await this.executeNode(node, state, context);
    }

    return state;
  }

  private async executeNode(
    node: WorkflowNode,
    state: Record<string, unknown>,
    context: ExecutionContext,
  ): Promise<Record<string, unknown>> {
    switch (node.type) {
      case "transform":
        return { ...state, ...node.config };
      case "condition":
        return state;
      case "loop":
        return state;
      default:
        context.memory.set(node.id, { status: "executed", at: new Date().toISOString() });
        return state;
    }
  }
}
