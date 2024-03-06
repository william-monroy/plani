import { GeoPoint } from "firebase/firestore";

export interface Plan {
  coordinates: GeoPoint;
  dateEnd: Date | undefined;
  dateStart: Date | undefined;
  description?: string;
  guests: string[];
  idAdmin: string;
  idDireccion: string;
  idValoracion: string;
  labels: string[];
  name: string;
  picture: string;
  requests: string[];
  score: Number;
  uid: string;
}
