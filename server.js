const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 6969 });

// Khởi tạo biến nhận data từ local
let dataLocal = "";
let dataRemote = "";

// Khi có một kết nối mới
server.on('connection', (socket) => {
  console.log('Client connected');

  // Gửi dữ liệu cho client sau mỗi giây
  const interval = setInterval(() => {
    if (dataLocal !== "") {
      socket.send(JSON.stringify(dataLocal));
    }

    if (dataRemote !== "") {
      socket.send(JSON.stringify(dataRemote));
    }
  }, 500);

  // Khi nhận được dữ liệu từ client
  socket.on('message', (data) => {

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

  const isJSONString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Khi client đóng kết nối
  socket.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

});
