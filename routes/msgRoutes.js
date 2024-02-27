const express = require("express");
const app = express();
const msgModel = require("../models/msg");


app.use(express.json()); //json使うよ

// データの取得 => /msgs
app.get("/msgs", async(req, res) => { //get
    // DBの中のデータをすべて返す
    const msgs = await msgModel.find({})

    try {
        res.send(msgs);
    } catch(err) {
        res.status(500).send(err);
    }
});

// データの作成 => /msg
app.post("/msg", async(req, res) => { // post
    const msg = new msgModel(req.body);

    try {
        await msg.save();
        res.send(msg);
    } catch(err) {
        res.status(500).send(err);
    }
});

// データの部分修正 => /msg/:id
app.patch("/msg/:id", async(req, res) => { // patch
    try {
        await msgModel.findByIdAndUpdate(req.params.id, req.body);
        await msgModel.save();
    } catch(err) {
        res.status(500).send(err);
    }
});

// データの削除 => /msg/:id
app.delete("/msg/:id", async(req, res) => { // delete
    try {
        await msgModel.findByIdAndDelete(req.params.id);
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = app;