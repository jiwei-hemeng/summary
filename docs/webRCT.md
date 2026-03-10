# webRTC

## 创建webRTC 实例

```js
const PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const peer = new PeerConnection();
```

## 创建信令交换过程

> 模拟A--B 端通信

```js
// 1. 创建 offer
let offer = await peerA.createOffer()
await peerB.setRemoteDescription(offer)
// 2. 创建B端创建 answer
let answer = await peerB.createAnswer()
await peerB.setLocalDescription(answer)
// 3. 发送端设置 sdp
await peerA.setLocalDescription(offer)
await peerA.setRemoteDescription(answer)
```

## 具体代码实现

### A 端 (发起端)

```js
// peerA 端
let peerA = new RTCPeerConnection(configuration);

// 创建 offer
let offer = await peerA.createOffer();

// ✅ 立即设置本地描述
await peerA.setLocalDescription(offer);

// 发送 offer 给 peerB
socketA.send({ type: "offer", data: offer });

// 监听 answer
socketA.onmessage = async (evt) => {
  let { type, data } = evt.data;
  if (type == "answer") {
    // 收到 answer，设置为远程描述
    await peerA.setRemoteDescription(data);
  }
};
```

### B端(接受端)

```js
// peerB 端，接收 peerA 传来的 offer
socketB.onmessage = async (evt) => {
  let { type, data } = evt.data;
  if (type == "offer") {
    // 此时必须先设置远端描述
    await peerB.setRemoteDescription(data);
    let answer = await peerB.createAnswer();
    await peerB.setLocalDescription(answer);
    socketB.send({ type: "answer", data: answer });
  }
};
```

## 事件

### 接受来自对方的视频流

```js
peer.ontrack = (e) => {
  if (e && e.streams) {
    remoteVideo.srcObject = e.streams[0];
  }
};
```

### 怎么把这个流发给对方的浏览器

```js
// 创建一个P2P连接对象
const pc = new RTCPeerConnection();
const localStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
// 把本地媒体流的每一条轨道(音频、视频)都添加到连接中
localStream.getTracks().forEach(track => {
  pc.addTrack(track, localStream);
});
```

### 收集候选人

```js
// target 的可选值 offer、answer
peer.onicecandidate = (e) => {
  if (e.candidate) {
    message.log("搜集并发送候选人");
    socket.send(
      JSON.stringify({ type: `${target}_ice`, iceCandidate: e.candidate })
    );
  } else {
    message.log("候选人收集完成！");
  }
};
```

### 添加候选人

```js
socket.onmessage = (e) => {
  const { type, sdp, iceCandidate } = JSON.parse(e.data);
  if (type === "answer_ice") {
    peer.addIceCandidate(iceCandidate);
  } else if (type === "offer_ice") {
    peer.addIceCandidate(iceCandidate);
  } else if (type === "answer") {
    peer.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
  } else if (type === "offer") {
    peer.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
  }
};
```

## WebRTC createDataChannel 使用总结

创建 DataChannel（发起端）

```js
// 创建 RTCPeerConnection 实例
const peerConnection = new RTCPeerConnection(configuration);

// 创建 DataChannel（必须在发起 offer 前创建）
const dataChannel = peerConnection.createDataChannel("myChannel", {
    ordered: true,           // 是否保证有序到达
    maxPacketLifeTime: 3000, // 最大传输时间（毫秒）
    maxRetransmits: 5,       // 最大重传次数
    protocol: "my-protocol",  // 自定义协议
    negotiated: false,       // 是否使用预先协商的ID
    id: 0                    // 当 negotiated:true 时指定的ID
});

// 设置 DataChannel 事件监听
dataChannel.onopen = () => {
    console.log("DataChannel 已打开");
    sendData(); // 可以发送数据了
};

dataChannel.onclose = () => {
    console.log("DataChannel 已关闭");
};

dataChannel.onerror = (error) => {
    console.error("DataChannel 错误:", error);
};

dataChannel.onmessage = (event) => {
    console.log("收到消息:", event.data);
};

// 然后创建并发送 offer
const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
```

接收端处理（响应端）

```js
// 响应端监听 datachannel 事件
peerConnection.ondatachannel = (event) => {
    const receiveChannel = event.channel;
    
    receiveChannel.onopen = () => {
        console.log("接收通道已打开");
    };
    
    receiveChannel.onclose = () => {
        console.log("接收通道已关闭");
    };
    
    receiveChannel.onerror = (error) => {
        console.error("接收通道错误:", error);
    };
    
    receiveChannel.onmessage = (event) => {
        console.log("收到消息:", event.data);
        // 可以回复消息
        receiveChannel.send("收到！");
    };
};
```
