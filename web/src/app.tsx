import { Route, Routes } from "@solidjs/router";
import { type Component, lazy } from "solid-js";
const Home = lazy(() => import("./pages/Home"));
const Game = lazy(() => import("./pages/Game"));

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={Home} />
      <Route path="/game/:id" component={Game} />
    </Routes>
  );
};

export default App;
