let socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const InputName = document.getElementById("InputName")
const messages = document.getElementById("messages");
const clearButton = document.getElementById("clear");


// --------msg全部読み込む--------
const getAllmsg = async() => {
  try {
    let Allmsg = await axios.get("/api/v1/msgs");
    let {data} = Allmsg;
    // console.log(data);

        //出力
    Allmsg = data.map((Allmsg) => {
      console.log(Allmsg._id);

      msg = Allmsg.msg;
      msgName = Allmsg.name;
      msgId = Allmsg._id;

      let item = document.createElement("li");
      item.id = msgId;
      item.textContent = msgName + ">> " + msg; //liに内容(msg)を書き込む
      messages.appendChild(item); //メッセージにliを追加
      window.scrollTo(0, document.body.scrollHeight); //画面をスクロール
    
    
      // 個々削除ボタン処理
      let DelButton = document.createElement("button"); // 削除ボタンを作成
      item.appendChild(DelButton); // liの子要素にdelボタンを追加
      DelButton.textContent = "消す"; // ボタンのテキストを"消す"に設定
      DelButton.className = "DelButton"; //作ったボタンにclass割当 ← CSSを使いたいから
      DelButton.id = msgId; //_idをIDにボタンのIDにする
        //クリックされたときの処理
        DelButton.addEventListener("click", () => { //delBtnクリックしたときそのIDをdeleteAPIの引数に指定して返す
          deleteAPI(DelButton.id);
          socket.emit("delete message", DelButton.id);
        });
      
    })
  } catch (error) {
    console.log(error);
  }
}

getAllmsg();

// ---------------------------------------------全消しボタン----------------------------------
clearButton.addEventListener("click", function (e) { 
    e.preventDefault(); //リロードなくす
    socket.emit("clear messages"); //サーバーに送信 
  while (messages.firstChild) {
    messages.removeChild(messages.firstChild);
  }
  });
// ------------------------------------------------------------------------------------------



// ---------------------------------------------文字を送信-----------------------------------
form.addEventListener("submit", async (e) => { 
  e.preventDefault(); 
  if(InputName.value) {
    // console.log(name)
    if (input.value) { // 空白でなければ
      let data = { // メッセージとnameをdataオブジェクトに格納 json形式
        msg: input.value,
        name: InputName.value,
      }; 

    try {                 // ここでapiを叩いてデータをdbにアップロード
      await axios.post(`/api/v1/msg`, data)
    } catch (error) {
      console.log(error);
    }

      socket.emit("chat message", data); 
      input.value = ""; //入力欄を空にする
    } else {
      console.log("メッセージを入力してください")
    }
  } else {
    console.log("名前を入力してください")
  }
});
// ------------------------------------------------------------------------------------------



// ------------------------------------------ サーバー受け取り処理 socket.on -----------------------------------------
socket.on("chat message", (data) => { //メッセージ受け取り
  console.log(data);
  msg = data.msg
  msgName = data.name
  msgId = data._id; 
  let item = document.createElement("li");
  item.id = msgId;
  item.textContent = msgName + ">> " + msg; //liに内容(msg)を書き込む
  messages.appendChild(item); //メッセージにliを追加
  window.scrollTo(0, document.body.scrollHeight); //画面をスクロール


  // 個々削除ボタン処理
  let DelButton = document.createElement("button"); // 削除ボタンを作成
  item.appendChild(DelButton); // liの子要素にdelボタンを追加
  DelButton.textContent = "消す"; // ボタンのテキストを"消す"に設定
  DelButton.className = "DelButton"; //作ったボタンにclass割当 ← CSSを使いたいから
  DelButton.addEventListener("click", () => { //delBtnクリックしたときサーバーに送信
    // socket.emit("delete message");
  })
})

socket.on("clear messages", () => { //clearBtn受け取り
    while (messages.firstChild) {
        messages.removeChild(messages.firstChild);
    }
})

socket.on("delete message", (msgId) => { //delete messageとid 受け取り
  // console.log(msgId)
  const item = document.getElementById(msgId); //idで指定された要素を検索
  if (item) { //itemが存在する場合
    messages.removeChild(item); //messagesからその要素を削除
  }
})

// ----------------------------------deleteAPIの処理-----------------------------
async function deleteAPI(msgId) {
  try {
    console.log("DeleteAPI送信!")
    console.log(`/api/v1/msg/${msgId}`)
    await axios.delete(`/api/v1/msg/${msgId}`);
  } catch (error) {
    console.log(error);
  }
}