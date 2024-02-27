const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose"); //mongoDB使うやつ
const msgRouter = require("./routes/msgRoutes");
const msg = require("./models/msg");
const axios = require("axios");
app.use(msgRouter); //使います

// データベースと接続
mongoose.connect(
    "mongodb+srv://mokkunpc:KgnJJD3JX1tOVrcW@cluster0.j0ztzea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log("データベースと接続されました"))
    .catch((err) => console.log(err));

// publicから読み込み
app.use(express.static(path.join(__dirname, 'public')));
// index.htmlを表示するように
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/api/v1/msgs", async(req, res) => { //get api
    try {
        const allmsg = await msg.find({}); //find => すべて取ってくる
        res.status(200).json(allmsg);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/v1/msg', async(req, res) => { //post api
    try {
        const createmsg = await msg.create(req.body);
        res.status(200).json(createmsg);
    } catch (error) {
        console.log(error);
    }
});

app.delete("/api/v1/msg/:id", async(req, res) => {
    try {
        const delmsg = await msg.findByIdAndDelete(req.params.id);
        res.status(200).json(delmsg);
    } catch (error) {
        console.log(error);
    }
})


io.on("connection", (socket) => { //接続処理
    console.log("接続されました");

    socket.on("chat message", (data) => { //chat messageを受け取ったとき
        messages = data.msg //dataはオブジェクト型で idとmessageが格納されている そこからmessege を取り出しmsgに代入
        msgName = data.name
        console.log(msgName +">> " + messages) //コンソールに出す
        io.emit("chat message", data); //全体に共有
    });

    socket.on("clear messages", () => {
        console.log("メッセージ全削除")
        io.emit("clear messages"); //全体に共有
    });

    socket.on("delete message", (msgID) => {
        console.log("ID = "+msgID+" のメッセージ削除");
        io.emit("delete message", msgID); //全体に送信
    });
});

// サーバー起動
server.listen(port, () => {
    console.log(`サーバーは http://localhost:${port} で起動しました。`);
});

