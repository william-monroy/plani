import { GeoPoint, Timestamp } from "firebase/firestore";

export interface Plan {
    coordinates: GeoPoint;
    dateEnd: Timestamp;
    dateStart: Timestamp;
    description: String;
    guests: String[];
    idAdmin: String;
    idDireccion: String;
    idValoracion: String;
    labels: String[];
    name: String;
    picture: String;
    requests: String[];
    score: Number;
    uid: String;
}