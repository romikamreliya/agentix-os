const { askAI } = require("../core/aiClient");

async function researchAgent(idea) {
    console.log("\n🔍 AI Research Agent Running...");

    const systemPrompt = `
You are a senior system analyst.
Break down ideas into insights, risks, and missing requirements.
Return structured JSON only.
`;

    const userPrompt = `
Idea: ${idea}

Return format:
{
  "insights": [],
  "risks": [],
  "missing_info": []
}
`;

    const result = await askAI(systemPrompt, userPrompt);

    return JSON.parse(result);
}

module.exports = { researchAgent };