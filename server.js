const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Khởi tạo biến nhận data từ local
let dataLocal = "";
let dataRemote = "";

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Hàm gửi tin nhắn liên tục từ server đến client
  const sendMessagesToClient = () => {
    if (dataLocal !== "") {
      ws.send(JSON.stringify(dataLocal));
    }

    if (dataRemote !== "") {
      ws.send(JSON.stringify(dataRemote));
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
      } else {
        dataLocal = JSON.parse(data);
      }
    }

  });

  ws.on('close', () => {
    console.log('Client disconnected');
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
