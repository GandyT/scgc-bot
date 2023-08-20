const { 
    PREFIX, 
    MEMBER_ROLE_ID, 
    GUEST_ROLE_ID,
    RETIRED_ROLE_ID,
    ADMIN_ROLE_ID 
} = require("../config.js")

const generateMention = member => {
    let hasRetired = member.roles.cache.find(r => r.id == RETIRED_ROLE_ID)
    let hasAdmin = member.roles.cache.find(r => r.id == ADMIN_ROLE_ID)

    if (hasRetired || hasAdmin) {
        return `**Admin ${member.user.username}**`
    } else {
        return `<@${member.id}>`
    }
}

module.exports = {
    names: ["makeguest"],
    description: ["Makes users of a certain role a guest."],
    usage: `${PREFIX}makeguest <roleid>`,
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) {
            message.channel.send("Missing Arg: <roleid>")
            return;
        }

        let role = message.guild.roles.cache.find(r => r.id == args[1]);
        if (!role) {
            message.channel.send(`Invalid role id: ${args[1]}`);
            return;
        }

        let pingStr = "__**Made Guests:**__\n"
        let alreadyStr = "__**Already Guest:**__\n"

        message.guild.members.fetch()
            .then(members => {
                members.map(member => {
                    if (member.user.bot) return;
                    
                    let specifiedRole = member.roles.cache.find(r => r.id == args[1])
                    if (!specifiedRole) return;
                    
                    let memberRole = member.roles.cache.find(r => r.id == MEMBER_ROLE_ID)
                    if (memberRole) {
                        member.roles.remove(memberRole)
                    }

                    let alreadyGuest = member.roles.cache.find(r => r.id == GUEST_ROLE_ID);
                    if (alreadyGuest) {
                        alreadyStr += `${generateMention(member)}\n`
                        return;
                    }
        
                    let guestRole = message.guild.roles.cache.find(r => r.id == GUEST_ROLE_ID)
                    member.roles.add(guestRole);
        
                    pingStr += `${generateMention(member)}\n`
                })

                message.channel.send(pingStr + alreadyStr)
            })
            .catch(console.error)

        
    }
}