const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Khởi tạo biến nhận data từ local
let dataLocal = "";
let dataRemote = "";
let numberLocal = 1;
let numberRemote = 2;

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Hàm gửi tin nhắn liên tục từ server đến client
  const sendMessagesToClient = () => {

    // console.log("numberLocal: ", +numberLocal);
    // console.log("numberRemote: ", +numberRemote);
    // console.log(+numberLocal === +numberRemote);

    if(+numberLocal === +numberRemote) {
      if (dataLocal !== "") {
        ws.send(JSON.stringify(dataLocal));
      }
  
      if (dataRemote !== "") {
        ws.send(JSON.stringify(dataRemote));
      }
    }

    // Thiết lập một khoảng thời gian (ví dụ: 1000ms) trước khi gửi tin nhắn tiếp theo
    setTimeout(sendMessagesToClient, 1000);
  };

  // Bắt đầu gửi tin nhắn liên tục
  sendMessagesToClient();

  ws.on('message', (data) => {

    // Kiểm tra data có phải là object hay không
    console.log(`Received data from client: ${data}`);

    if (isJSONString(data)) {
      
      if (JSON.parse(data).type === "offer") {
        dataRemote = JSON.parse(data);
      } else if (JSON.parse(data).type === "answer") {
        dataLocal = JSON.parse(data);
      }

      if(JSON.parse(data).verify === "XTLocal") {
        numberLocal = JSON.parse(data).numberLocal;
      } else if(JSON.parse(data).verify === "XTRemote") {
        numberRemote = JSON.parse(data).numberRemote;
      }

    }

  });

  ws.on('close', () => {
    console.log('Client disconnected');
    dataLocal = "";
    dataRemote = "";
    numberLocal = 1;
    numberRemote = 2;
  });

  const isJSONString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
});
