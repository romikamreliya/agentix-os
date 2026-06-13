const { getAgentProfile } = require("../core/agentRegistry");

async function plannerAgent(idea, research) {

  const agents = [
    getAgentProfile("researchAgent"),
    getAgentProfile("plannerAgent"),
    getAgentProfile("executionAgent")
  ];

  return {
    goal: idea,
    agents_required: agents,
    phases: [
      {
        name: "Setup Phase",
        tasks: [
          "initialize system",
          "define architecture"
        ]
      },
      {
        name: "Execution Phase",
        tasks: [
          "run tasks",
          "validate output"
        ]
      }
    ]
  };
}

module.exports = { plannerAgent };