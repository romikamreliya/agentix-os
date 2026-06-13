const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function askAI(systemPrompt, userPrompt) {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    });

    return response.choices[0].message.content;
}

module.exports = { askAI };