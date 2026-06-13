const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function askAI(systemPrompt, userPrompt, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ]
            });

            return response.choices[0].message.content;

        } catch (err) {
            console.log("⚠️ AI error, retrying...", i + 1);
        }
    }

    throw new Error("AI failed after retries");
}

module.exports = { askAI };