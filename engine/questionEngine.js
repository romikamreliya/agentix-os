function questionEngine(plan) {
    console.log("\n❓ Question Engine Running...");

    const questions = [
        "Do you want VS Code extension as primary interface?",
        "Should we use OpenAI API or keep local MVP first?",
        "Do you want fully autonomous agents or approval-based system?"
    ];

    return {
        total: questions.length,
        questions
    };
}

module.exports = { questionEngine };