import { Component, createEffect, createSignal } from "solid-js";
import { registerUser } from "../api/user";
import { Button } from "../components/Button";
import { Input } from "../components/InputText";

const Home: Component = () => {
  const [name, setName] = createSignal("");
  const [id, setId] = createSignal<string | undefined>();
  const [isError, setError] = createSignal(false);
  const [isWaiting, setWaiting] = createSignal(false);

  const onClick = async () => {
    try {
      // generate user
      const id = await registerUser(name());
      setId(id);
    } catch {
      setError(true);
    }
  };

  createEffect(() => {
    if (!!id()) {
      setWaiting(true);
    }
  });

  return (
    <main class="relative flex flex-col w-screen h-screen items-center gap-10 justify-center py-20 px-5">
      <p class="text-3xl font-bold">Yacht!</p>
      <div class="flex flex-col gap-4 w-full items-center">
        <Input
          placeholder="Your name is..."
          value={name()}
          onInput={(e) => setName(e.currentTarget.value ?? "")}
          className={`w-full ${isError() && "border-red-500"}`}
        />
        <Button text="Go" onClick={onClick} />
      </div>
      {isWaiting() && (
        <div class="w-screen h-screen absolute top-0 left-0 flex flex-col items-center justify-center bg-opacity-60 bg-black">
          <p class="text-3xl font-bold text-white">Waiting for Other Players</p>
        </div>
      )}
    </main>
  );
};

export default Home;
