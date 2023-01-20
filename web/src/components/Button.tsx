import { Component, JSX } from "solid-js";

type Props = {
  text: string;
  className?: string;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};

export const Button: Component<Props> = ({ text, onClick, className }) => {
  return (
    <button
      class={`font-bold border-2 border-black outline-none rounded-lg py-1 px-2 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
