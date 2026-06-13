const { useTool } = require("../core/toolbox");

async function executionEngine(plan) {
    console.log("\n🚀 Agentix Execution Engine (Smart Mode)");

    const results = [];

    for (let phase of plan.phases) {

        console.log(`\n📦 Phase: ${phase.name}`);

        for (let task of phase.tasks) {

            console.log(`🤖 Task: ${task}`);

            let output;

            // TOOL-BASED EXECUTION
            if (task.includes("initialize")) {
                output = useTool("design", task);
            }
            else if (task.includes("run")) {
                output = useTool("simulate_execution", task);
            }
            else {
                output = useTool("write", task);
            }

            results.push({
                task,
                output
            });
        }
    }

    return {
        status: "DONE",
        results
    };
}

module.exports = { executionEngine };