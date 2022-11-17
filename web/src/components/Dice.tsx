type DiceProps = {
  eye: number;
  onClick?: () => void;
};

export const Dice = ({ eye, onClick }: DiceProps) => {
  return (
    <div
      className={`flex justify-center items-center w-20 aspect-square text-3xl font-bold rounded-lg ${
        onClick && "cursor-pointer"
      } ${eye !== 0 && "hover:border-4"}
      ${eye === 0 && "hover:border-dashed hover:border-4"} 
      `}
      onClick={() => onClick && onClick()}
    >
      {eye !== 0 && eye}
    </div>
  );
};
