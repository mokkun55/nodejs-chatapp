let socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const InputName = document.getElementById("InputName")
const messages = document.getElementById("messages");
const clearButton = document.getElementById("clear");


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
form.addEventListener("submit", function (e) { 
  e.preventDefault(); 
  if(InputName.value) {
    let name = InputName.value; // nameを定義
    // console.log(name)
    if (input.value) { // 空白でなければ
      id = uuid.v4() //ID = uuidで唯一無二のIDを付加
      // console.log(id);
      let data = { message: input.value, id: id, name: name}; // メッセージと一意のIDとnameをdataオブジェクトに格納
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
  msg = data.message
  msgId = data.id //dataはオブジェクト型なので 使える形に
  msgName = data.name
  let item = document.createElement("li");
  item.textContent = msgName + ">> " + msg; //liに内容(msg)を書き込む
  item.id = data.id; //ここでliのIDにUUIDを追加して 判別できるようにしている
  messages.appendChild(item); //メッセージにliを追加
  window.scrollTo(0, document.body.scrollHeight); //画面をスクロール


  // 個々削除ボタン処理
  let DelButton = document.createElement("button"); // 削除ボタンを作成
  item.appendChild(DelButton); // liの子要素にdelボタンを追加
  DelButton.textContent = "消す"; // ボタンのテキストを"消す"に設定
  DelButton.className = "DelButton"; //作ったボタンにclass割当 ← CSSを使いたいから
  DelButton.id = msgId; //作ったボタンにid(uuid)割当 これで個々を判別
  DelButton.addEventListener("click", () => { //delBtnクリックしたときそのIDをサーバーに送信
    let ID = DelButton.id;  //ID は 押したボタンのID
    socket.emit("delete message", ID);
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

