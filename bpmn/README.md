## 启动流程实例（Camunda）

```js
// 启动流程实例
const variables = {
  customer: "user_123",
  warehouse: "warehouse_01",
  orderId: "ORD-2025-001",
  totalAmount: 299.0,
};

const result = await fetch("/api/process/start", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    processKey: "ShoppingConfirmationProcess",
    variables,
  }),
});
```

## 完成任务

```js
// 提交订单
await completeTask(taskId, {
  inventoryAvailable: true,
});

// 确认支付
await completeTask(paymentTaskId, {
  paymentSuccess: true,
});
```
