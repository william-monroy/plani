import { GeoPoint } from "firebase/firestore";

export interface Direccion {
    alias: String;
    city: String;
    coordinates: GeoPoint;
    idUser: String;
    state: String;
    street: String;
    zipCode: Number;
    uid: String;
}