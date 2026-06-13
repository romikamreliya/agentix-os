const { researchAgent } = require("../agents/researchAgent");
const { plannerAgent } = require("../agents/plannerAgent");

async function executionEngine(plan) {
    console.log("\n🚀 Execution Engine Started");

    const results = [];

    for (let phase of plan.phases) {
        console.log(`\n📦 Running: ${phase.name}`);

        for (let task of phase.tasks) {

            console.log(`🤖 Executing task: ${task}`);

            // SIMPLE AGENT ROUTING (MVP)
            let result;

            if (task.toLowerCase().includes("research")) {
                result = await researchAgent(task);
            } else {
                result = {
                    task,
                    status: "done",
                    output: `Executed: ${task}`
                };
            }

            results.push({
                task,
                result
            });
        }
    }

    return {
        status: "EXECUTION_COMPLETE",
        results
    };
}

module.exports = { executionEngine };