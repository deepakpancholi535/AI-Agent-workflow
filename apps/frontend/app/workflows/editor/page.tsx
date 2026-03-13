"use client";

import ReactFlow from "reactflow";

const nodes = [{ id: "1", data: { label: "Webhook Trigger" }, position: { x: 0, y: 0 } }];

export default function WorkflowEditorPage() {
  return (
    <main className="h-screen p-4">
      <h1 className="mb-4 text-xl font-semibold">Workflow Editor</h1>
      <div className="h-[80vh] rounded border border-slate-700">
        <ReactFlow nodes={nodes} fitView />
      </div>
    </main>
  );
}
