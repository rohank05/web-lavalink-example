const {Client} = require('discord.js');
const botServer = require("socket.io")(3001);
const fetch = require("node-fetch");


const client = new Client({
    intents: ["GUILD_VOICE_STATES","GUILDS","GUILD_MESSAGES"]
});

client.login("OTM5MDQyNDg1ODQwMjQ4ODYy.YfzFdw.sqbT9BVb-nvLdqHcPoPPb2E0SS8");

client.on("ready", ()=>{
    console.log("Bot Ready");
    botServer.on("connection",(socket)=>{
        socket.on("payload", (...args)=>{
            const data = JSON.parse(args);
            const guild = client.guilds.cache.get(data.id);
            if(guild) guild.shard.send(data.payload);
        })
    })
})

client.on("message", (message)=>{
    if(message.content.startsWith("-play")){
        fetch("http://localhost:3000/play",{
            method: "POST",
            body: JSON.stringify({
                guild: message.guild.id,
                textChannel: message.channelId,
                voiceChannel: message.member.voice.channelId,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).catch(console.error)
    }
})
client.on("raw", (raw)=>{
    fetch("http://localhost:3000/raw",{
        method: "POST",
        body: JSON.stringify(raw),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(console.error)
})
