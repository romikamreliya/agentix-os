const WebSocket = require("ws");
const eventBus = require("./eventBus");

function createWSServer(server) {
    const wss = new WebSocket.Server({ server });

    const clients = new Set();

    wss.on("connection", (ws) => {
        console.log("🔌 VS Code Extension Connected");
        clients.add(ws);

        ws.on("close", () => {
            clients.delete(ws);
        });
    });

    // Broadcast function
    function broadcast(data) {
        const message = JSON.stringify(data);

        for (let client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    // Listen to internal AI OS events
    eventBus.onAny = function (event, payload) {
        broadcast({ event, payload });
    };

    // manual event forwarding
    eventBus.on("broadcast", (data) => {
        broadcast(data);
    });

    console.log("🚀 WebSocket Server Ready");

    return wss;
}

module.exports = { createWSServer };