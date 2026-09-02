export enum Mood {
  GREEN = "green",
  YELLOW = "yellow",
  RED = "red",
}

export interface Update {
  id: string;
  memberId: string;
  date: string;
  text: string;
  mood: Mood;
}
