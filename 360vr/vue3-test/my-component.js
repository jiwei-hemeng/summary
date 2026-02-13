import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "MyComponent",
  setup() {
    const title = ref("Hello Vue 3 with defineComponent!");
    const message = ref("这是一个 Vue 3 defineComponent 示例");

    const changeTitleAndMessage = () => {
      title.value = "标题已修改 (defineComponent)";
      message.value = "消息已更新 (defineComponent)！";
    };

    return {
      title,
      message,
      changeTitleAndMessage,
    };
  },
  template: `
    <div>
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <button @click="changeTitleAndMessage">修改标题和消息</button>
    </div>
  `,
});
