function safeJSONParse(data) {
    try {
        return {
            success: true,
            data: JSON.parse(data)
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            raw: data
        };
    }
}

module.exports = { safeJSONParse };