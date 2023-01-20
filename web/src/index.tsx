/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import "./index.css";
import App from "./App";

const _App = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

render(() => <_App />, document.getElementById("root") as HTMLElement);
