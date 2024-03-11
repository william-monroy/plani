import { GeoPoint } from "firebase/firestore";

interface CustomTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Plan {
  coordinates: GeoPoint;
  dateEnd: CustomTimestamp | undefined;
  dateStart: CustomTimestamp | undefined;
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
