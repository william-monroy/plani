import { Timestamp } from "firebase/firestore";

export interface PlanCardProps {
    plan: {
    name: string;
    picture?: string;
    dateEnd: Timestamp;
    dateStart: Timestamp;
    description?: string;
    guests?: string[];
    labels?: string[];
    score?: Number;
    }
  }