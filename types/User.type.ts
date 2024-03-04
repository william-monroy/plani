import { Timestamp } from "firebase/firestore";

export interface User {
  dateBirth?: Timestamp | undefined;
  direcciones: String[];
  email: String;
  firstName: String;
  lastName: String;
  gender: "male" | "female" | "other" | undefined;
  labels: String[];
  score: Number;
  uid: String;
  registered: Timestamp | undefined;
}
