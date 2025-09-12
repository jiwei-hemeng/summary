// @ts-nocheck
import React from "react";
import style from "./index.module.css";
export default class Loadding extends React.Component {
  render() {
    return (
      <div className={style.loading}>
        <div className={style.loading_bg}></div>
        <div className={style.loading_box}>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    );
  }
}
