const agentRegistry = {
    researchAgent: {
        role: "Research Analyst",
        skills: ["analysis", "information gathering", "risk detection"],
        tools: ["read", "web_simulation"],
    },

    plannerAgent: {
        role: "System Architect",
        skills: ["system design", "workflow planning", "task breakdown"],
        tools: ["design", "structure"],
    },

    executionAgent: {
        role: "Worker Agent",
        skills: ["task execution", "code generation"],
        tools: ["write", "simulate_execution"],
    }
};

function getAgentProfile(name) {
    return agentRegistry[name];
}

module.exports = { agentRegistry, getAgentProfile };