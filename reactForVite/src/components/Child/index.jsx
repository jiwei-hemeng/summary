import React, { useState, useImperativeHandle, forwardRef } from "react";
function Child(props, ref) {
  const [num, setNum] = useState(0);
  function addNum() {
    setNum((num) => {
      return num + 1;
    });
  }
  useImperativeHandle(ref, () => {
    return {
      // 此处给父组件暴露方法
      addOne: addNum,
    };
  });

  return <div>{num}</div>;
}
export default forwardRef(Child);
