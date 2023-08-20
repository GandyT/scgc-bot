const { ACTIVITY } = require("../config.js")

module.exports = {
    event: "ready",
    async execute() {
        const client = this;
        console.log("Bot is on!");
        client.user.setActivity(ACTIVITY);
    }
}