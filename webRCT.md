# webRTC

## 创建信令交换过程

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
// peerA 端C自nS
let offer = await peerA.createOffer();
// 向 peerB 传输 offer
socketA.send({ type: "offer", data: offer });
socketA.onmessage = async (evt) => {
  let { type, data } = evt.data;
  if (type == "answer") {
    // 接收 peerB 传来的 answer
    await peerA.setLocalDescription(offer);
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

