import { Component, JSX } from "solid-js";

type Props = {
  value: string;
  placeholder?: string;
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
  className?: string;
};

export const Input: Component<Props> = ({
  value,
  onInput,
  placeholder,
  className,
}) => {
  return (
    <input
      placeholder={placeholder}
      type="text"
      value={value}
      onInput={onInput}
      class={`p-2 font-bold border-2 border-black rounded-lg outline-none w-full ${className}`}
    />
  );
};
