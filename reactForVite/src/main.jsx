// @ts-nocheck
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/index.js";
import App from "./App";
import dayjs from "dayjs";
import ZHCN from "dayjs/locale/zh-cn";
import Loadding from "@/components/loadding";
import indexdbHelper from "@/utils/Indexdb.js";
import "./index.css";
dayjs.locale(ZHCN)
indexdbHelper.init().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <HashRouter>
      <Provider store={store}>
        <Suspense fallback={<Loadding />}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </Suspense>
      </Provider>
    </HashRouter>
  );
});
