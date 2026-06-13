const { askAI } = require("../core/aiClient");

async function plannerAgent(idea, research) {
    console.log("\n🧠 AI Planner Agent Running...");

    const systemPrompt = `
You are a senior system architect.
Convert ideas into structured development plans with phases and tasks.
Return ONLY JSON.
`;

    const userPrompt = `
Idea: ${idea}

Research:
${JSON.stringify(research, null, 2)}

Return format:
{
  "phases": [
    {
      "name": "",
      "tasks": []
    }
  ],
  "required_agents": []
}
`;

    const result = await askAI(systemPrompt, userPrompt);

    return JSON.parse(result);
}

module.exports = { plannerAgent };