// "male" | "female" | "other"
export type Gender = "male" | "female" | "other" | "";

export interface User {
  dateBirth?: Date | undefined;
  direcciones: String[];
  email: String;
  firstName: String;
  lastName: String;
  gender: Gender | undefined;
  labels: String[];
  score: Number;
  uid: String;
  registered: Date | undefined;
  avatar: String;
  
}
