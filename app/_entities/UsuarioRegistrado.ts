import { Timestamp } from "firebase/firestore";

export interface UsuarioRegistrado {
    dateBirth: Timestamp;
    direcciones: String[];
    email: String;
    firstName: String;
    lastName: String;
    gender: String;
    labels: String[];
    score: Number;
    uid: String;
}