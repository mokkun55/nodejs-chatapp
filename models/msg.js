const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    msg: { //メッセージ本文
        type: String,
        required: true,
    },
    name: { //名前
        type: String,
    },
});

// モデルを生成
const msg = mongoose.model("msg", msgSchema);

module.exports = msg;