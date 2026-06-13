const fs = require("fs");

const FILE = "./data/pipeline.json";

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ current: null, history: [] }, null, 2));
}

function loadState() {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveState(state) {
    fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
}

function setCurrentPipeline(pipeline) {
    const state = loadState();

    state.current = {
        id: Date.now(),
        status: "running",
        pipeline
    };

    state.history.push(state.current);

    saveState(state);
    return state.current;
}

function updatePipelineStatus(status) {
    const state = loadState();

    if (state.current) {
        state.current.status = status;
    }

    saveState(state);
    return state.current;
}

module.exports = {
    loadState,
    setCurrentPipeline,
    updatePipelineStatus
};