import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

type ButtonProps = {
  disabled: boolean;
  children: ComponentChildren;
  color: string;
  borderColor: string;
  onClick: JSXInternal.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({
  disabled,
  children,
  onClick,
  color,
  borderColor,
}: ButtonProps) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: hover ? borderColor : color,
        borderColor: borderColor,
      }}
      className="order-2 rounded-lg px-2 py-1 font-bold"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};
