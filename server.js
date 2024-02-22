const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

// publicから読み込み
app.use(express.static(path.join(__dirname, 'public')));
// index.htmlを表示するように
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on("connection", (socket) => { //接続処理
    console.log("接続されました");

    socket.on("chat message", (data) => { //chat messageを受け取ったとき
        msg = data.message //dataはオブジェクト型で idとmessageが格納されている そこからmessege を取り出しmsgに代入
        console.log("textInput>> " + msg) //コンソールに出す
        io.emit("chat message", data); //全体に共有
    });

    socket.on("clear messages", () => {
        console.log("メッセージ全削除")
        io.emit("clear messages"); //全体に共有
    });

    socket.on("delete message", (msgID) => {
        console.log("ID = "+msgID+" のメッセージ削除");
        io.emit("delete message", msgID); //全体に送信
    })
});

// サーバー起動
server.listen(port, () => {
    console.log(`サーバーは http://localhost:${port} で起動しました。`);
});
