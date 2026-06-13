const { researchAgent } = require("../agents/researchAgent");
const { plannerAgent } = require("../agents/plannerAgent");
const { questionEngine } = require("../engine/questionEngine");
const { planUpdateEngine } = require("../engine/planUpdateEngine");
const { executionEngine } = require("../engine/executionEngine");
const { addMemory } = require("./memory");
const { setCurrentPipeline } = require("./pipelineState");

async function runOrchestrator(idea) {
    console.log("\n🧠 Agentix-OS Started");
    console.log("📥 Idea Received:", idea);

    // STEP 1: Research Phase
    const research = await researchAgent(idea);
    console.log("\n🔍 Research Output:", research);

    addMemory({
        type: "research",
        data: research
    });

    // STEP 2: Planning Phase
    const plan = await plannerAgent(idea, research);
    console.log("\n🧠 Initial Plan:", plan);

    // STEP 3: Question Phase
    const questions = questionEngine(plan);
    console.log("\n❓ Questions for User:", questions);

    addMemory({
        type: "plan",
        data: plan
    });

    setCurrentPipeline(plan);

    // STEP 4: Approval / Update Phase
    console.log("\n✅ Approving Plan...");

    // In real app, ask user here
    const updatedPlan = planUpdateEngine(plan, {
        user_feedback: "Looks good, proceed with execution"
    });

    addMemory({
        type: "plan_update",
        data: updatedPlan
    });

    // STEP 5: Execution Phase
    const executionResult = await executionEngine(updatedPlan);

    addMemory({
        type: "execution",
        data: executionResult
    });

    return {
        status: "COMPLETE",
        plan,
        executionResult
    };
}

module.exports = { runOrchestrator };