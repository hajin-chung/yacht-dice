export interface Player {
  id: string;
  name: string;
  room?: string | undefined;
}

export const CommandTypeArray = ["throw", "fix", "select", "score"] as const;

export interface CommandProps {
  playerId: string;
  command: typeof CommandTypeArray[number];
  content: any;
}

export interface CommandReturn {
  msg: string;
  error: boolean;
}

export interface CommandWithRoomProps extends CommandProps {
  roomId: string;
}

export const emptyScore = Array(13).fill(0);
