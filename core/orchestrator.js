const { researchAgent } = require("../agents/researchAgent");
const { plannerAgent } = require("../agents/plannerAgent");
const { questionEngine } = require("../engine/questionEngine");
const { planUpdateEngine } = require("../engine/planUpdateEngine");
const { executionEngine } = require("../engine/executionEngine");

async function runOrchestrator(idea) {
    console.log("\n🧠 Agentix-OS Started");
    console.log("📥 Idea Received:", idea);

    // STEP 1: Research Phase
    const research = await researchAgent(idea);
    console.log("\n🔍 Research Output:", research);

    // STEP 2: Planning Phase
    const plan = await plannerAgent(idea, research);
    console.log("\n🧠 Initial Plan:", plan);

    // STEP 3: Question Phase
    const questions = questionEngine(plan);
    console.log("\n❓ Questions for User:", questions);

    // STEP 7: Execution Phase (NEW)
    const executionResult = await executionEngine(plan);

    return {
        status: "COMPLETE",
        plan,
        executionResult
    };

    return {
        idea,
        research,
        plan,
        questions,
        status: "WAITING_FOR_USER_INPUT"
    };
}

module.exports = { runOrchestrator };