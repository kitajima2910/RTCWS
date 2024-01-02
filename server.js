const HTTPS_PORT = 6969;


const fs = require('fs');
const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;




const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const app = express();
app.use(express.static('client-datachannel'));

const httpsServer = https.createServer(serverConfig, app);
httpsServer.listen(HTTPS_PORT, () => console.log(`Https running on port ${HTTPS_PORT}`));




const wss = new WebSocketServer({ server: httpsServer });

// Khởi tạo biến nhận data từ local
let dataLocal = "";
let dataRemote = "";

// Khi có một kết nối mới
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Gửi dữ liệu cho client sau mỗi giây
  const interval = setInterval(() => {
    if (dataLocal !== "") {
      ws.send(JSON.stringify(dataLocal));
    }

    if (dataRemote !== "") {
      ws.send(JSON.stringify(dataRemote));
    }
  }, 500);

  // Khi nhận được dữ liệu từ client
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

  const isJSONString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Khi client đóng kết nối
  console.log('Server running. Visit https://localhost:' + HTTPS_PORT + ' in Firefox/Chrome.\n\n\
  Some important notes:\n\
    * Note the HTTPS; there is no HTTP -> HTTPS redirect.\n\
    * You\'ll also need to accept the invalid TLS certificate.\n\
    * Some browsers or OSs may not allow the webcam to be used by multiple pages at once. You may need to use two different browsers or machines.\n'
  );

});
