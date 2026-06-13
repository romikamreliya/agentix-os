const tools = {
    read: (input) => {
        return `Reading data: ${input}`;
    },

    write: (input) => {
        return `Writing output: ${input}`;
    },

    simulate_execution: (task) => {
        return `Executed task: ${task}`;
    },

    design: (input) => {
        return `System design created for: ${input}`;
    }
};

function useTool(toolName, input) {
    if (tools[toolName]) {
        return tools[toolName](input);
    }
    return "Tool not found";
}

module.exports = { useTool };