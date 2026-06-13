function planUpdateEngine(plan, answers) {
    console.log("\n🔁 Updating Plan Based on User Input...");

    const updatedPlan = {
        ...plan,
        version: (plan.version || 1) + 1,
        user_decisions: answers,
        status: "UPDATED"
    };

    return updatedPlan;
}

module.exports = { planUpdateEngine };