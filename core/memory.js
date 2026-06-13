const fs = require("fs");

const FILE = "./data/memory.json";

// Ensure file exists
if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([]));
}

function loadMemory() {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveMemory(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function addMemory(entry) {
    const memory = loadMemory();
    memory.push({
        timestamp: new Date().toISOString(),
        ...entry
    });
    saveMemory(memory);
}

module.exports = {
    loadMemory,
    addMemory
};