import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.jsx";
import { Provider } from "react-redux";
import store from "./store/index.jsx";
import "normalize.css";
import "./index.scss";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
