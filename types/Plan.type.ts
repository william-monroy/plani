import { GeoPoint, Timestamp } from "firebase/firestore";

export interface Plan {
  coordinates: GeoPoint;
  dateEnd: Date | Timestamp | undefined;
  dateStart: Date | Timestamp | undefined;
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
  solicitud: string[];
}
