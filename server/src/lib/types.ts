import type { CommandProps, CommandReturn } from "../../../yacht/yacht";

export interface CommandWithRoomProps extends CommandProps {
  roomId: string;
  callback: (res: CommandReturn) => void;
}
