import { AgentDefinition } from "../../shared/src/types.js";

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface LlmProvider {
  complete(prompt: string, tools?: ToolCall[]): Promise<string>;
}

export class AgentOrchestrator {
  constructor(private readonly llm: LlmProvider) {}

  async execute(agent: AgentDefinition, input: string): Promise<{ output: string; toolCalls: ToolCall[] }> {
    const toolCalls = this.resolveTools(agent.tools, input);
    const prompt = `${agent.systemPrompt}\nGoal: ${agent.goal}\nInput: ${input}`;
    const output = await this.llm.complete(prompt, toolCalls);
    return { output, toolCalls };
  }

  private resolveTools(tools: string[], input: string): ToolCall[] {
    return tools
      .filter((name) => input.toLowerCase().includes(name.toLowerCase()))
      .map((name) => ({ name, arguments: { query: input } }));
  }
}
