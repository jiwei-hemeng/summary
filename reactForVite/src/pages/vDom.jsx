// @ts-nocheck
import React,{ useRef } from "react";
import Child from "@/components/Child/index.jsx";
export default function VDom() {
  const refChild = useRef(null)
  function addOne () {
    refChild.current.addOne()
  }
  return (
    <div>
      <Child ref={refChild} />
      <button onClick={addOne}>点位加一</button>
    </div>
  )
}