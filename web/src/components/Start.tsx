import { useState } from "preact/hooks";

type PlayerFormProps = {
  onSubmit: (name: string) => void;
};

function PlayerForm({ onSubmit }: PlayerFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-20" />
      <h1 className="text-9xl font-bold">Yacht Dice</h1>
      <div className="h-10" />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-2xl font-semibold">Name</p>
        <input
          type="text"
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          className="border-solid border-4 rounded-lg outline-none w-50 h-10 font-bold text-xl px-2 focus:border-gray-500"
        />
        <button
          type="submit"
          class="font-bold text-xl p-2 bg-gray-500 hover:bg-gray-800 text-white rounded-lg"
        >
          GO
        </button>
      </form>
    </div>
  );
}

export function Start({ onSubmit }: PlayerFormProps) {
  return (
    <>
      <PlayerForm onSubmit={onSubmit} />
    </>
  );
}
