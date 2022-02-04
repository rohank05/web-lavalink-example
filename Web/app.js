
const app = require('express')();
const {Manager} = require("erela.js");
const {io} = require("socket.io-client")
const botSocket = io(`ws://localhost:3001`);
const bodyParser = require('body-parser')
botSocket.on("connect",()=>{
    console.log("connected");
})



const manager = new Manager({
    nodes:[{
        host: "localhost",
        port: 8000,
        secure: false,
        password: "password"
    }],
    send(id, payload) {
        botSocket.emit("payload", JSON.stringify({id: id, payload: payload}));
    }
}).on("nodeConnect",()=>{
    console.log("connected to lava");
})

manager.init("939042485840248862");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.listen(3000);

app.post("/raw", (req, res)=>{

    manager.updateVoiceState(req.body)
});

app.post("/play", (req, res)=>{
    const player = manager.create({
        guild: req.body.guild,
        textChannel: req.body.textChannel,
        voiceChannel: req.body.voiceChannel,
        selfDeafen: true
    });

    player.connect();

    manager.search("human rag n bone").then(res=>{
        player.queue.add(res.tracks[0]);
        player.play();
    })
})