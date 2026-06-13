const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes (we will build next steps)
const ideaRoute = require("./api/ideaRoute");
app.use("/api", ideaRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`AI Workflow OS running on port ${PORT}`);
});