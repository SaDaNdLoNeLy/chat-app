import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import StateProvider from "./StateProvider";
import { BrowserRouter } from "react-router-dom";
import CallProvider from "./contexts/callContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StateProvider>
        <CallProvider>
          {/* <React.StrictMode> */}
          <App />
          {/* </React.StrictMode> */}
        </CallProvider>
      </StateProvider>
    </BrowserRouter>
  </Provider>
);
