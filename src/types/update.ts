export enum Mood {
  GREEN = "Green",
  YELLOW = "Yellow",
  RED = "Red",
}

export interface Update {
  id: string;
  memberId: string;
  date: string;
  text: string;
  mood: Mood;
}
